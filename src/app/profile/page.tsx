
'use client';

import { useState, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Swords, Shield, Flame, PawPrint, Star, Pyramid, ShieldCheck, PlusCircle, BrainCircuit, User, Upload, Sparkles, X, Image as ImageIcon, LogOut, Award, Eye, ThumbsUp, HelpCircle } from 'lucide-react';
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
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useApp } from '@/context/app-provider';

const RarityBadge = ({ rarity, className }: { rarity: string, className?: string }) => {
    const rarityClasses: Record<string, string> = {
        Common: 'bg-gray-500 text-white border-gray-600',
        Uncommon: 'bg-green-500 text-white border-green-600',
        Rare: 'bg-blue-500 text-white border-blue-600',
        Epic: 'bg-purple-500 text-white border-purple-600',
        Legendary: 'bg-yellow-500 text-black border-yellow-600',
        Mythic: 'bg-red-600 text-white border-red-700',
        Phantom: 'bg-fuchsia-700 text-white border-fuchsia-800',
        Supreme: 'bg-gradient-to-r from-orange-400 to-rose-400 text-white border-transparent',
    };
    return <Badge className={cn('text-xs', rarityClasses[rarity] || 'bg-gray-400', className)}>{rarity}</Badge>;
};

const normalizeString = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric chars, but keep spaces
    .trim();
};

function findItemInGameData(identifiedName: string, allGameData: any[], subcollectionName: string) {
    const normalizedIdentifiedName = normalizeString(identifiedName);

    for (const world of allGameData) {
        const subcollection = world[subcollectionName];
        if (!Array.isArray(subcollection)) continue;

        for (const cachedItem of subcollection) {
            // Level 1 Search: Direct name match on the main item
            const normalizedCachedName = normalizeString(cachedItem.name);
            if (normalizedCachedName === normalizedIdentifiedName) {
                // If it's a direct match, but it's a gacha item, the rarity might be in stats
                // For progression items, this is enough.
                const rarity = cachedItem.stats?.[0]?.rarity || 'Common'; // Default rarity
                return { ...cachedItem, world: world.name, rarity: rarity, id: cachedItem.id || nanoid() };
            }

            // Level 2 Search: If the main item has a 'stats' array, search inside it
            if (cachedItem.stats && Array.isArray(cachedItem.stats)) {
                for (const stat of cachedItem.stats) {
                    if (stat.name) {
                        const normalizedStatName = normalizeString(stat.name);
                         if (normalizedStatName === normalizedIdentifiedName) {
                            // Found a match in the stats array.
                            // Return the PARENT item's data, but with the specific rarity and name from the stat.
                            return { 
                                ...cachedItem, 
                                name: stat.name, // Use the specific stat name for display
                                world: world.name, 
                                rarity: stat.rarity, 
                                id: stat.id || nanoid() 
                            };
                        }
                    }
                }
            }
        }
    }
    return null; // No match found
}


// Generic Component for Profile Sections
function ProfileSection({ subcollectionName, sectionTitle, sectionDescription }: { subcollectionName: string, sectionTitle: string, sectionDescription: string }) {
    const { toast } = useToast();
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { allGameData } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userSubcollectionQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, subcollectionName);
    }, [firestore, user, subcollectionName]);

    const { data: savedItems, isLoading: areItemsLoading } = useCollection(userSubcollectionQuery);

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
                description: `Por favor, selecione um ou mais screenshots de seus ${sectionTitle.toLowerCase()}.`,
            });
            return;
        }
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado.' });
            return;
        }

        setIsAnalyzing(true);
        toast({
            title: 'Analisando Imagens...',
            description: `A IA está identificando seus itens. Isso pode levar um momento.`,
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
                let savedCount = 0;
                const notFoundItems: string[] = [];

                for (const identifiedItem of result.powers) {
                    const fullItemData = findItemInGameData(identifiedItem.name, allGameData, subcollectionName);

                    if (fullItemData) {
                        const itemRef = doc(firestore, 'users', user.uid, subcollectionName, fullItemData.id);
                        await setDoc(itemRef, fullItemData, { merge: true });
                        savedCount++;
                    } else {
                        notFoundItems.push(identifiedItem.name);
                    }
                }
                
                if (savedCount > 0) {
                  toast({
                      title: `${savedCount} ${sectionTitle} Salvos!`,
                      description: `Itens foram identificados e salvos em seu perfil.`,
                  });
                }
                
                if (notFoundItems.length > 0) {
                    toast({
                        variant: 'destructive',
                        title: `${notFoundItems.length} itens não encontrados`,
                        description: `Não foi possível encontrar dados para: ${notFoundItems.join(', ')}`,
                    });
                }

                 if (savedCount === 0 && notFoundItems.length > 0) {
                     toast({
                        variant: 'destructive',
                        title: 'Nenhum item salvo',
                        description: 'A busca no cache falhou para todos os itens identificados. Verifique os nomes e os dados do jogo.',
                    });
                 }


            } else {
                 throw new Error('A IA não conseguiu identificar nenhum item.');
            }

        } catch (error: any) {
            console.error(`Erro ao analisar e salvar ${sectionTitle}:`, error);
            toast({
                variant: 'destructive',
                title: 'Erro na Análise',
                description: error.message || `Não foi possível identificar e salvar os itens.`,
            });
        } finally {
            setIsAnalyzing(false);
            setSelectedFiles([]);
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    

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
                    <DialogTitle>Gerenciar {sectionTitle}</DialogTitle>
                    <DialogDescription>{sectionDescription}</DialogDescription>
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
                                        id={`${subcollectionName}-upload`}
                                    />
                                    <label htmlFor={`${subcollectionName}-upload`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
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
                                    Analisar e Salvar
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                         <h3 className="text-lg font-medium">{sectionTitle} Salvos</h3>
                         <Card className="h-[280px]">
                            <CardContent className="p-0 h-full">
                                {areItemsLoading ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin"/></div>
                                ) : (!savedItems || savedItems.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                                        <ImageIcon className="h-10 w-10 mb-2" />
                                        <p className="text-sm">Seus itens salvos aparecerão aqui.</p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-full p-4">
                                        <div className="space-y-3">
                                            {savedItems.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
                                                    <div className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-xs text-center">
                                                       {item.name.substring(0,3)}
                                                    </div>
                                                    <div className='flex-1'>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">{item.world}</p>
                                                    </div>
                                                    <RarityBadge rarity={item.rarity} />
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

const PowersProfileSection = () => <ProfileSection subcollectionName="powers" sectionTitle="Poderes" sectionDescription="Adicione seus poderes enviando um screenshot da sua tela de poderes no jogo. A IA irá identificá-los e salvá-los no seu perfil." />;
const AurasProfileSection = () => <ProfileSection subcollectionName="auras" sectionTitle="Auras" sectionDescription="Adicione suas auras enviando um screenshot. A IA irá identificá-las e salvá-las no seu perfil." />;
const PetsProfileSection = () => <ProfileSection subcollectionName="pets" sectionTitle="Pets" sectionDescription="Adicione seus pets enviando um screenshot. A IA irá identificá-los e salvá-los no seu perfil." />;
const WeaponsProfileSection = () => <ProfileSection subcollectionName="weapons" sectionTitle="Armas" sectionDescription="Adicione suas armas enviando um screenshot. A IA irá identificá-las e salvá-los no seu perfil." />;
const IndexProfileSection = () => <ProfileSection subcollectionName="index" sectionTitle="Index" sectionDescription="Adicione seus tiers de avatares e pets enviando um screenshot. A IA irá identificá-los e salvá-los no seu perfil." />;
const ObelisksProfileSection = () => <ProfileSection subcollectionName="obelisks" sectionTitle="Obeliscos" sectionDescription="Adicione seu progresso nos obeliscos enviando um screenshot. A IA irá identificá-lo e salvá-lo no seu perfil." />;
const RankProfileSection = () => <ProfileSection subcollectionName="rank" sectionTitle="Rank" sectionDescription="Adicione seu rank atual enviando um screenshot. A IA irá identificá-lo e salvá-lo no seu perfil." />;


const profileCategories = [
    { name: 'Poderes', icon: Flame, description: 'Seus poderes de gacha e progressão.', component: PowersProfileSection, subcollectionName: 'powers' },
    { name: 'Auras', icon: Shield, description: 'Auras de chefe e outros buffs.', component: AurasProfileSection, subcollectionName: 'auras' },
    { name: 'Pets', icon: PawPrint, description: 'Seus companheiros e seus bônus.', component: PetsProfileSection, subcollectionName: 'pets' },
    { name: 'Armas', icon: Swords, description: 'Espadas, foices e outros equipamentos.', component: WeaponsProfileSection, subcollectionName: 'weapons' },
    { name: 'Index', icon: Star, description: 'Tiers de avatares e pets.', component: IndexProfileSection, subcollectionName: 'index' },
    { name: 'Obeliscos', icon: Pyramid, description: 'Seu progresso nos obeliscos de poder.', component: ObelisksProfileSection, subcollectionName: 'obelisks' },
    { name: 'Rank', icon: ShieldCheck, description: 'Seu rank atual no jogo.', component: RankProfileSection, subcollectionName: 'rank' },
];


function UserFeedbackSection() {
    const { user } = useUser();
    const firestore = useFirebase().firestore;

    const userFeedbackQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'negativeFeedback'),
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

function ReputationSection() {
    const { user, isUserLoading } = useUser();

    const reputationPoints = (user as any)?.reputationPoints || 0;

    return (
        <Card className='lg:col-span-2'>
            <CardHeader>
                <CardTitle className='flex items-center gap-3'><Award /> Reputação</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center justify-center text-center p-6'>
                {isUserLoading ? (
                    <Loader2 className='h-8 w-8 animate-spin text-primary'/>
                ) : (
                    <>
                        <div className='relative flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 mb-4'>
                            <Sparkles className='h-12 w-12 text-primary opacity-20 absolute' />
                            <span className='text-4xl font-bold text-primary z-10'>{reputationPoints}</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>Você tem {reputationPoints} pontos de reputação por ajudar a melhorar a IA.</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function CategoryDisplay({ subcollectionName }: { subcollectionName: string }) {
    const { user } = useUser();
    const firestore = useFirebase().firestore;

    const itemsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'users', user.uid, subcollectionName), orderBy('name', 'asc'));
    }, [firestore, user, subcollectionName]);

    const { data: items, isLoading } = useCollection(itemsQuery);
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!items || items.length === 0) {
         return (
            <div className='flex items-center justify-center h-full w-full text-muted-foreground'>
                <p className="text-xs">Nenhum item salvo.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-5 gap-2 w-full">
            {items.map(item => (
                <div key={item.id} className="aspect-square bg-muted/50 rounded-md flex flex-col items-center justify-center p-1 relative overflow-hidden border">
                    <p className="text-[10px] font-bold leading-tight text-center z-10">{(item as any).name}</p>
                    <RarityBadge rarity={(item as any).rarity} className="absolute bottom-1 right-1 text-[8px] px-1 py-0 h-4" />
                </div>
            ))}
        </div>
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
                    <Button variant="outline" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReputationSection />

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
                            <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                                <div className='h-48 w-full rounded-md bg-muted/20 border-2 border-dashed flex items-center justify-center p-2'>
                                    <CategoryDisplay subcollectionName={category.subcollectionName} />
                                </div>
                                 {category.component && <category.component />}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
