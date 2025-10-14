
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Swords, Shield, Flame, PawPrint, Star, Pyramid, ShieldCheck, PlusCircle, Construction, BrainCircuit, User, Upload, Sparkles, X, Image as ImageIcon, LogOut, Award, Eye, ThumbsUp, HelpCircle } from 'lucide-react';
import Head from 'next/head';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { identifyPowersFromImage, type IdentifiedPower } from '@/ai/flows/identify-powers-from-image-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { signOut, getAuth } from 'firebase/auth';
import { collection, query, where, orderBy } from 'firebase/firestore';

const profileCategories = [
    { name: 'Poderes', icon: Flame, description: 'Seus poderes de gacha e progressão.', component: PowersProfileSection },
    { name: 'Auras', icon: Shield, description: 'Auras de chefe e outros buffs.' },
    { name: 'Pets', icon: PawPrint, description: 'Seus companheiros e seus bônus.' },
    { name: 'Armas', icon: Swords, description: 'Espadas, foices e outros equipamentos.' },
    { name: 'Index', icon: Star, description: 'Tiers de avatares e pets.' },
    { name: 'Obeliscos', icon: Pyramid, description: 'Seu progresso nos obeliscos de poder.' },
    { name: 'Rank', icon: ShieldCheck, description: 'Seu rank atual no jogo.' },
];

function UnderConstructionDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar / Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Em Construção</DialogTitle>
                    <DialogDescription>
                        A funcionalidade para adicionar e editar itens do seu perfil estará disponível em breve!
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function PowersProfileSection() {
    const { isAdmin } = useAdmin();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [identifiedPowers, setIdentifiedPowers] = useState<IdentifiedPower[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleAnalyzeClick = async () => {
        if (selectedFiles.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Nenhum arquivo selecionado',
                description: 'Por favor, selecione um ou mais screenshots dos seus poderes.',
            });
            return;
        }

        setIsAnalyzing(true);
        toast({
            title: 'Analisando Imagens...',
            description: 'A IA está identificando seus poderes. Isso pode levar um momento.',
        });

        try {
            const dataUris = await Promise.all(
                selectedFiles.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            const result = await identifyPowersFromImage({ images: dataUris });
            if (result && result.powers) {
                // Combine and remove duplicates
                const uniquePowers = [...identifiedPowers];
                result.powers.forEach(newPower => {
                    if (!uniquePowers.some(existing => existing.name === newPower.name)) {
                        uniquePowers.push(newPower);
                    }
                });
                setIdentifiedPowers(uniquePowers);
                toast({
                    title: 'Poderes Identificados!',
                    description: `${result.powers.length} novos poderes foram encontrados e adicionados ao seu perfil.`,
                });
            } else {
                 throw new Error('A IA não conseguiu identificar nenhum poder.');
            }

        } catch (error: any) {
            console.error("Erro ao analisar poderes:", error);
            toast({
                variant: 'destructive',
                title: 'Erro na Análise',
                description: error.message || 'Não foi possível identificar os poderes da imagem.',
            });
        } finally {
            setIsAnalyzing(false);
            setSelectedFiles([]);
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    const RarityBadge = ({ rarity }: { rarity: string }) => {
        const rarityClasses: Record<string, string> = {
            Common: 'bg-gray-500 text-white',
            Uncommon: 'bg-green-500 text-white',
            Rare: 'bg-blue-500 text-white',
            Epic: 'bg-purple-500 text-white',
            Legendary: 'bg-yellow-500 text-black',
            Mythic: 'bg-red-600 text-white',
            Phantom: 'bg-fuchsia-700 text-white',
            Supreme: 'bg-gradient-to-r from-orange-400 to-rose-400 text-white',
        };
        return <Badge className={cn('text-xs', rarityClasses[rarity] || 'bg-gray-400')}>{rarity}</Badge>;
    };

    if (isAdmin === undefined) return null; // Wait for admin check

    if (!isAdmin) {
        return <UnderConstructionDialog />;
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar / Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Gerenciar Poderes</DialogTitle>
                    <DialogDescription>
                        Adicione seus poderes enviando um screenshot da sua tela de poderes no jogo. A IA irá identificá-los para você.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Fazer Upload</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                     <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="power-upload"
                                    />
                                    <label htmlFor="power-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, etc.</p>
                                        </div>
                                    </label>

                                    {selectedFiles.length > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                            <p>{selectedFiles.length} arquivo(s) selecionado(s):</p>
                                            <ul className="list-disc pl-4">
                                                {selectedFiles.map(f => <li key={f.name}>{f.name}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <Button onClick={handleAnalyzeClick} disabled={isAnalyzing || selectedFiles.length === 0} className="w-full">
                                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Analisar Imagens
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                         <h3 className="text-lg font-medium">Poderes Identificados</h3>
                         <Card className="h-[280px]">
                            <CardContent className="p-0 h-full">
                                {identifiedPowers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                                        <ImageIcon className="h-10 w-10 mb-2" />
                                        <p className="text-sm">Seus poderes aparecerão aqui após a análise.</p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-full p-4">
                                        <div className="space-y-3">
                                            {identifiedPowers.map(power => (
                                                <div key={power.name} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
                                                    <div className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-xs text-center">
                                                       {power.name.substring(0,3)}
                                                    </div>
                                                    <div className='flex-1'>
                                                        <p className="font-semibold">{power.name}</p>
                                                        <p className="text-xs text-muted-foreground">{power.world}</p>
                                                    </div>
                                                    <RarityBadge rarity={power.rarity} />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                         </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function UserFeedbackSection() {
    const { user } = useUser();
    const firestore = useFirebase().firestore;

    const userFeedbackQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'negativeFeedback'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: feedbacks, isLoading } = useCollection(userFeedbackQuery);
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'reviewing': return <Badge variant="secondary" className='bg-yellow-500/20 text-yellow-500 border-yellow-500/30'><Eye className="mr-1 h-3 w-3"/>Em Revisão</Badge>;
            case 'fixed': return <Badge variant="secondary" className='bg-green-500/20 text-green-500 border-green-500/30'><ThumbsUp className="mr-1 h-3 w-3"/>Resolvido</Badge>;
            default: return <Badge variant="outline">Pendente</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-3'><HelpCircle /> Seus Feedbacks</CardTitle>
                <CardDescription>Acompanhe o status das respostas que você marcou como negativas.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <div className='flex items-center justify-center'><Loader2 className='h-6 w-6 animate-spin'/></div>}
                {!isLoading && (!feedbacks || feedbacks.length === 0) && (
                    <p className='text-sm text-muted-foreground text-center'>Você ainda não marcou nenhuma resposta como negativa.</p>
                )}
                {!isLoading && feedbacks && feedbacks.length > 0 && (
                     <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-4">
                            {feedbacks.map(fb => (
                                <div key={fb.id} className="flex justify-between items-center p-3 rounded-md border bg-card">
                                    <p className="text-sm truncate pr-4">"{(fb as any).question}"</p>
                                    {getStatusBadge((fb as any).status || 'pending')}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
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
                    <Button variant="outline" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className='lg:col-span-2'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><Award /> Reputação</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6'>
                            <div className='flex items-center justify-center h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed mb-4'>
                                 <Construction className='h-8 w-8 text-muted-foreground'/>
                            </div>
                             <p className='text-sm text-muted-foreground'>Seus pontos de reputação por ajudar a melhorar a IA aparecerão aqui em breve.</p>
                        </CardContent>
                    </Card>

                    <UserFeedbackSection />

                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Meu Personagem</h2>
                    <p className="text-muted-foreground">Construa o perfil do seu personagem com seus poderes, armas, pets e progresso atual.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileCategories.map((category) => (
                        <Card key={category.name}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-3'>
                                    <category.icon className="h-6 w-6 text-primary" />
                                    {category.name}
                                </CardTitle>
                                <CardDescription>{category.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0'>
                                <div className='flex items-center justify-center h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed mb-4'>
                                     <Construction className='h-8 w-8 text-muted-foreground'/>
                                </div>
                                 {category.component ? (
                                    <category.component />
                                ) : (
                                   <UnderConstructionDialog />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
