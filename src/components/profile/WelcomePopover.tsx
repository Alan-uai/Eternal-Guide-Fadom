'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser, useFirebase } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, Sparkles } from 'lucide-react';
import { extractStatsFromImage } from '@/ai/flows/extract-stats-from-image-flow';
import { Separator } from '../ui/separator';
import { useGlobalBonuses } from '@/hooks/use-global-bonuses'; // Assuming this hook can be adapted
import { allGameData } from '@/lib/game-data-context';
import { energyGainPerRank } from '@/lib/energy-gain-data';

const statsSchema = z.object({
    currentWorld: z.string().min(1, 'O mundo atual é obrigatório.'),
    rank: z.string().min(1, 'O rank é obrigatório.'),
    totalDamage: z.string().min(1, 'O dano total é obrigatório.'),
    energyGain: z.string().min(1, 'O ganho de energia é obrigatório.'),
});

type StatsFormData = z.infer<typeof statsSchema>;

export function WelcomePopover() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Placeholder for max stats calculation logic
    const { bonuses: maxBonuses, isLoading: areBonusesLoading } = useGlobalBonuses("5.6e+34", true);


    const form = useForm<StatsFormData>({
        resolver: zodResolver(statsSchema),
        defaultValues: {
            currentWorld: '',
            rank: '',
            totalDamage: '',
            energyGain: '',
        },
    });

    useEffect(() => {
        if (searchParams.get('new-user') === 'true') {
            setIsOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsOpen(false);
        router.replace('/profile', { scroll: false });
    };

    const handleCalculateMaxStats = () => {
        const maxWorld = allGameData.length;
        const maxRank = Math.max(...Object.keys(energyGainPerRank).map(Number));

        // Use the calculated max bonuses
        const maxEnergyGain = maxBonuses.energyGain;
        const maxDamage = maxBonuses.damage;
        
        function formatNumber(num: number): string {
            if (num < 1e3) return num.toFixed(2);
            const suffixes = ["", "k", "M", "B", "T", "qd", "Qn", "sx", "Sp", "O", "N", "de", "Ud", "dD", "tD", "qdD", "QnD", "sxD", "SpD", "OcD", "NvD", "Vgn", "UVg", "DVg", "TVg", "qtV", "QnV", "SeV", "SPG", "OVG", "NVG", "TGN", "UTG", "DTG", "tsTG", "qTG", "QnTG", "ssTG", "SpTG", "OcTG", "NoTG", "QDR", "uQDR", "dQDR", "tQDR"];
            const i = Math.floor(Math.log10(num) / 3);
            if (i < suffixes.length) {
                const value = (num / Math.pow(1000, i));
                return `${value.toFixed(2)}${suffixes[i]}`;
            }
            return num.toExponential(2);
        }


        form.setValue('currentWorld', String(maxWorld));
        form.setValue('rank', String(maxRank));
        form.setValue('totalDamage', formatNumber(maxDamage));
        form.setValue('energyGain', formatNumber(maxEnergyGain));

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
            await updateDoc(userRef, {
                currentWorld: values.currentWorld,
                rank: parseInt(values.rank, 10),
            });
            
            const energyRef = doc(firestore, 'users', user.uid, 'rank', 'current');
            await setDoc(energyRef, { value: parseInt(values.rank, 10) }, { merge: true });

            localStorage.setItem('eternal-guide-current-energy', values.totalDamage);

            toast({ title: 'Perfil Atualizado!', description: 'Suas informações foram salvas.' });
            handleClose();

        } catch (error: any) {
            console.error('Error saving initial stats:', error);
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
                const missingFields: string[] = [];

                if (result.currentWorld) {
                    form.setValue('currentWorld', result.currentWorld);
                    foundFields.push('Mundo');
                } else {
                    missingFields.push('Mundo');
                }
                if (result.rank) {
                    form.setValue('rank', result.rank);
                    foundFields.push('Rank');
                } else {
                    missingFields.push('Rank');
                }
                if (result.totalDamage) {
                    form.setValue('totalDamage', result.totalDamage);
                    foundFields.push('Dano');
                } else {
                    missingFields.push('Dano');
                }
                if (result.energyGain) {
                    form.setValue('energyGain', result.energyGain);
                    foundFields.push('Energia');
                } else {
                    missingFields.push('Energia');
                }

                if (foundFields.length > 0) {
                    toast({ title: 'Campos Preenchidos!', description: `A IA encontrou: ${foundFields.join(', ')}.` });
                }
                if (missingFields.length > 0) {
                     toast({ variant: 'destructive', title: 'Campos Faltando', description: `Não foi possível encontrar: ${missingFields.join(', ')}. Por favor, preencha manualmente.` });
                }
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            toast({ variant: 'destructive', title: 'Erro na Análise', description: 'Não foi possível extrair dados da imagem.' });
        } finally {
            setIsAnalyzing(false);
            if(imageInputRef.current) imageInputRef.current.value = '';
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Bem-vindo ao Guia Eterno!</DialogTitle>
                    <DialogDescription>
                        Para começar, preencha suas estatísticas, envie um screenshot do jogo ou calcule os stats máximos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2 py-2">
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

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Ou Preencha Manualmente
                    </span>
                  </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentWorld"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mundo Atual</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: 23" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="rank"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seu Rank</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="ex: 115" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="totalDamage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dano Total (DPS)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: 1.5sx" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="energyGain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ganho de Energia (por clique)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: 87.04O" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter className='pt-4'>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Salvar e Continuar
                            </Button>
                         </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
