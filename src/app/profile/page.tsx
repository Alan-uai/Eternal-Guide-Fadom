'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Save, Upload, Sparkles } from 'lucide-react';
import Head from 'next/head';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { GeneralItemUploader } from '@/components/profile/GeneralItemUploader';
import { ReputationSection } from '@/components/profile/ReputationSection';
import { UserFeedbackSection } from '@/components/profile/UserFeedbackSection';
import { CharacterInventory } from '@/components/profile/CharacterInventory';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useGlobalBonuses } from '@/hooks/use-global-bonuses';
import { allGameData } from '@/lib/game-data-context';
import { energyGainPerRank } from '@/lib/energy-gain-data';
import { extractStatsFromImage } from '@/ai/flows/extract-stats-from-image-flow';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';


const MAX_RANK = Math.max(...Object.keys(energyGainPerRank).map(Number));
const MAX_WORLD = allGameData.length;

const suffixes = ["", "k", "M", "B", "T", "qd", "Qn", "sx", "Sp", "O", "N", "de", "Ud", "dD", "tD", "qdD", "QnD", "sxD", "SpD", "OcD", "NvD", "Vgn", "UVg", "DVg", "TVg", "qtV", "QnV", "SeV", "SPG", "OVG", "NVG", "TGN", "UTG", "DTG", "tsTG", "qTG", "QnTG", "ssTG", "SpTG", "OcTG", "NoTG", "QDR", "uQDR", "dQDR", "tQDR"];

const statsSchema = z.object({
    currentWorld: z.string()
        .min(1, 'O mundo atual é obrigatório.')
        .refine(val => !isNaN(parseInt(val, 10)), { message: 'Deve ser um número.' })
        .refine(val => parseInt(val, 10) <= MAX_WORLD, { message: `O mundo máximo é ${MAX_WORLD}.` }),
    rank: z.string()
        .min(1, 'O rank é obrigatório.')
        .refine(val => !isNaN(parseInt(val, 10)), { message: 'Deve ser um número.' })
        .refine(val => parseInt(val, 10) <= MAX_RANK, { message: `O rank máximo é ${MAX_RANK}.` }),
    energyGainValue: z.string().min(1, 'O valor é obrigatório.'),
    energyGainSuffix: z.string(),
    totalDamageValue: z.string().min(1, 'O valor é obrigatório.'),
    totalDamageSuffix: z.string(),
    currentEnergyValue: z.string().min(1, 'O valor é obrigatório.'),
    currentEnergySuffix: z.string(),
});

type StatsFormData = z.infer<typeof statsSchema>;


const parseWithSuffix = (valueStr: string, suffix: string) => {
    if (!valueStr) return 0;
    const value = parseFloat(valueStr);
    if (isNaN(value)) return 0;
    const power = suffixes.indexOf(suffix);
    if (power === -1) return value;
    return value * Math.pow(1000, power);
};

const formatWithSuffix = (num: number): { value: string, suffix: string } => {
    if (num < 1000) return { value: num.toFixed(2), suffix: '' };
    const i = Math.floor(Math.log10(num) / 3);
    const value = (num / Math.pow(1000, i));
    return { value: value.toFixed(2), suffix: suffixes[i] || '' };
};

function MyStatsForm() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { bonuses: maxBonuses, isLoading: areBonusesLoading } = useGlobalBonuses("0", true);

    const form = useForm<StatsFormData>({
        resolver: zodResolver(statsSchema),
        defaultValues: {
            currentWorld: '',
            rank: '',
            energyGainValue: '',
            energyGainSuffix: '',
            totalDamageValue: '',
            totalDamageSuffix: '',
            currentEnergyValue: '',
            currentEnergySuffix: '',
        },
    });

    useEffect(() => {
        async function fetchUserData() {
            if (user && firestore) {
                const userRef = doc(firestore, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    form.reset({
                        currentWorld: data.currentWorld || '',
                        rank: data.rank ? String(data.rank) : '',
                        ...splitValueAndSuffix(localStorage.getItem('eternal-guide-current-energy') || '', 'currentEnergy'),
                        ...splitValueAndSuffix(data.totalDamage || '', 'totalDamage'),
                        ...splitValueAndSuffix(data.energyGain || '', 'energyGain'),
                    });
                }
            }
        }
        fetchUserData();
    }, [user, firestore, form]);

    const splitValueAndSuffix = (fullValue: string, fieldPrefix: 'totalDamage' | 'currentEnergy' | 'energyGain') => {
        if (!fullValue) return { [`${fieldPrefix}Value`]: '', [`${fieldPrefix}Suffix`]: '' };
        const foundSuffix = suffixes.slice().reverse().find(s => s && fullValue.toLowerCase().endsWith(s.toLowerCase()));
        if (foundSuffix) {
            const valuePart = fullValue.slice(0, -foundSuffix.length);
            return { [`${fieldPrefix}Value`]: valuePart, [`${fieldPrefix}Suffix`]: foundSuffix };
        }
        return { [`${fieldPrefix}Value`]: fullValue, [`${fieldPrefix}Suffix`]: '' };
    };

    const handleCalculateMaxStats = () => {
        const { value, suffix } = formatWithSuffix(maxBonuses.damage);
        form.setValue('currentWorld', String(MAX_WORLD));
        form.setValue('rank', String(MAX_RANK));
        form.setValue('totalDamageValue', value);
        form.setValue('totalDamageSuffix', suffix);
        form.setValue('energyGainValue', '');
        form.setValue('energyGainSuffix', '');
        form.setValue('currentEnergyValue', '');
        form.setValue('currentEnergySuffix', '');

        toast({
            title: "Valores Máximos Calculados!",
            description: "Os campos foram preenchidos com os stats máximos teóricos."
        });
    };

    const onSubmit = async (values: StatsFormData) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado.' });
            return;
        }
        setIsSaving(true);
        try {
            const userRef = doc(firestore, 'users', user.uid);
            
            const currentEnergyCombined = `${values.currentEnergyValue}${values.currentEnergySuffix}`;

            await updateDoc(userRef, {
                currentWorld: values.currentWorld,
                rank: parseInt(values.rank, 10),
                totalDamage: `${values.totalDamageValue}${values.totalDamageSuffix}`,
                energyGain: `${values.energyGainValue}${values.energyGainSuffix}`,
            });
            
            const rankRef = doc(firestore, 'users', user.uid, 'rank', 'current');
            await setDoc(rankRef, { value: parseInt(values.rank, 10) }, { merge: true });

            if (values.currentEnergyValue) {
                localStorage.setItem('eternal-guide-current-energy', currentEnergyCombined);
            }

            toast({ title: 'Perfil Atualizado!', description: 'Suas informações foram salvas.' });

        } catch (error: any) {
            console.error('Error saving stats:', error);
            toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível salvar suas informações.' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        toast({ title: 'Analisando Imagem...', description: 'A IA está lendo suas estatísticas.' });

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const fileDataUri = reader.result as string;
                const result = await extractStatsFromImage({ image: fileDataUri });
                
                const foundFields: string[] = [];
                if (result.currentWorld) { form.setValue('currentWorld', result.currentWorld.replace(/\D/g, '')); foundFields.push('Mundo'); }
                if (result.rank) { form.setValue('rank', result.rank); foundFields.push('Rank'); }
                if (result.totalDamage) { const {value, suffix} = splitValueAndSuffix(result.totalDamage, 'totalDamage'); form.setValue('totalDamageValue', value.totalDamageValue); form.setValue('totalDamageSuffix', value.totalDamageSuffix); foundFields.push('Dano'); }
                if (result.energyGain) { const {value, suffix} = splitValueAndSuffix(result.energyGain, 'energyGain'); form.setValue('energyGainValue', value.energyGainValue); form.setValue('energyGainSuffix', value.energyGainSuffix); foundFields.push('Energia'); }

                if (foundFields.length > 0) toast({ title: 'Campos Preenchidos!', description: `A IA encontrou: ${foundFields.join(', ')}.` });
                else toast({ variant: 'destructive', title: 'Nada Encontrado', description: `Não foi possível extrair dados da imagem.` });
            };
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro na Análise', description: 'Não foi possível extrair dados da imagem.' });
        } finally {
            setIsAnalyzing(false);
            if(imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Minhas Estatísticas</CardTitle>
                <CardDescription>
                    Gerencie suas estatísticas para obter cálculos precisos no chat da IA.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-2 gap-2 mb-4">
                    <input type="file" ref={imageInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                    <Button variant="outline" className='w-full' onClick={() => imageInputRef.current?.click()} disabled={isAnalyzing}>
                         {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isAnalyzing ? 'Analisando...' : 'Enviar Imagem'}
                    </Button>
                     <Button variant="outline" className='w-full' onClick={handleCalculateMaxStats} disabled={areBonusesLoading}>
                         {areBonusesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                         Calcular Máximo
                    </Button>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="currentWorld" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mundo Atual</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <ScrollArea className="h-72">
                                                {allGameData.map((world, index) => (
                                                    <SelectItem key={world.id} value={String(index + 1)}>{world.name}</SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                             <FormField control={form.control} name="rank" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seu Rank</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <ScrollArea className="h-72">
                                                {Array.from({ length: MAX_RANK }, (_, i) => i + 1).map(rankNum => (
                                                    <SelectItem key={rankNum} value={String(rankNum)}>Rank {rankNum}</SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        
                        <FormField control={form.control} name="totalDamageValue" render={() => (
                           <FormItem>
                            <FormLabel>Dano Total (DPS)</FormLabel>
                                <div className="flex gap-2">
                                     <FormField control={form.control} name="totalDamageValue" render={({ field }) => ( <FormControl><Input placeholder="ex: 1.5" {...field} /></FormControl>)} />
                                     <FormField control={form.control} name="totalDamageSuffix" render={({ field }) => (
                                         <Select onValueChange={(v) => field.onChange(v === 'none' ? '' : v)} defaultValue={field.value} value={field.value}>
                                             <FormControl><SelectTrigger className="w-[120px]"><SelectValue placeholder="Sigla" /></SelectTrigger></FormControl>
                                             <SelectContent><ScrollArea className="h-72">{suffixes.map(s => <SelectItem key={s || 'none'} value={s || 'none'}>{s || 'Nenhuma'}</SelectItem>)}</ScrollArea></SelectContent>
                                         </Select>
                                     )} />
                                </div>
                                <FormMessage />
                           </FormItem>
                        )}/>
                        <FormField control={form.control} name="currentEnergyValue" render={() => (
                           <FormItem>
                            <FormLabel>Energia Atual (Acumulada)</FormLabel>
                                <div className="flex gap-2">
                                     <FormField control={form.control} name="currentEnergyValue" render={({ field }) => ( <FormControl><Input placeholder="ex: 1.5" {...field} /></FormControl>)} />
                                     <FormField control={form.control} name="currentEnergySuffix" render={({ field }) => (
                                         <Select onValueChange={(v) => field.onChange(v === 'none' ? '' : v)} defaultValue={field.value} value={field.value}>
                                             <FormControl><SelectTrigger className="w-[120px]"><SelectValue placeholder="Sigla" /></SelectTrigger></FormControl>
                                             <SelectContent><ScrollArea className="h-72">{suffixes.map(s => <SelectItem key={s || 'none'} value={s || 'none'}>{s || 'Nenhuma'}</SelectItem>)}</ScrollArea></SelectContent>
                                         </Select>
                                     )} />
                                </div>
                                <FormMessage />
                           </FormItem>
                        )}/>
                        <FormField control={form.control} name="energyGainValue" render={() => (
                           <FormItem>
                            <FormLabel>Ganho de Energia (por clique)</FormLabel>
                                <div className="flex gap-2">
                                     <FormField control={form.control} name="energyGainValue" render={({ field }) => ( <FormControl><Input placeholder="ex: 87.04" {...field} /></FormControl>)} />
                                     <FormField control={form.control} name="energyGainSuffix" render={({ field }) => (
                                         <Select onValueChange={(v) => field.onChange(v === 'none' ? '' : v)} defaultValue={field.value} value={field.value}>
                                             <FormControl><SelectTrigger className="w-[120px]"><SelectValue placeholder="Sigla" /></SelectTrigger></FormControl>
                                             <SelectContent><ScrollArea className="h-72">{suffixes.map(s => <SelectItem key={s || 'none'} value={s || 'none'}>{s || 'Nenhuma'}</SelectItem>)}</ScrollArea></SelectContent>
                                         </Select>
                                     )} />
                                </div>
                                <FormMessage />
                           </FormItem>
                        )}/>
                        <Button type="submit" disabled={isSaving} className="w-full">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Estatísticas
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


export default function ProfilePage() {
    const auth = useAuth();
    const { isUserLoading } = useUser();
    const { toast } = useToast();

    const handleSignOut = async () => {
        if (auth) {
            try {
                await signOut(auth);
                toast({ title: 'Logout efetuado com sucesso.'});
            } catch (error) {
                console.error("Logout error", error);
                toast({ variant: 'destructive', title: 'Erro ao fazer logout.'});
            }
        }
    };
    
    if (isUserLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    return (
        <>
            <Head>
                <title>Meu Perfil - Guia Eterno</title>
            </Head>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className='flex items-center gap-4'>
                         <User className="h-8 w-8 text-primary"/>
                         <div>
                            <h1 className="text-3xl font-bold tracking-tight font-headline">Meu Perfil</h1>
                            <p className="text-muted-foreground">Gerencie seus dados do jogo, reputação e configurações.</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <GeneralItemUploader />
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Button>
                    </div>
                </header>

                <MyStatsForm />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReputationSection />
                    <UserFeedbackSection />
                </div>

                <CharacterInventory />
            </div>
        </>
    );
}
