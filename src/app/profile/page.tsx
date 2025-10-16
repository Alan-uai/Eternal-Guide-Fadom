

'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Swords, Shield, Flame, PawPrint, Star, Pyramid, ShieldCheck, PlusCircle, BrainCircuit, User, Upload, Sparkles, X, Image as ImageIcon, LogOut, Award, Eye, ThumbsUp, HelpCircle, Coins, Zap, Wind, Trophy, Wallet, Users, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { identifyPowersFromImage, type IdentifiedItem } from '@/ai/flows/identify-powers-from-image-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirebase, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useApp } from '@/context/app-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generalAchievements } from '@/lib/achievements-data';
import { energyGainPerRank } from '@/lib/energy-gain-data';
import { allGamepasses, type Gamepass } from '@/lib/gamepass-data';
import { accessories, type Accessory, type RarityOption } from '@/lib/accessory-data';
import { Slider } from '@/components/ui/slider';
import { damageSwordsArticle, scythesArticle, swordsArticle } from '@/lib/wiki-data';


const RarityBadge = ({ rarity, className, children }: { rarity: string, className?: string, children?: React.ReactNode }) => {
    const rarityClasses: Record<string, string> = {
        // Ranks
        'C-Rank': 'bg-gray-500 text-white border-gray-600',
        'B-Rank': 'bg-green-500 text-white border-green-600',
        'A-Rank': 'bg-blue-500 text-white border-blue-600',
        'S-Rank': 'bg-purple-500 text-white border-purple-600',
        'SS-Rank': 'bg-yellow-500 text-black border-yellow-600',
        'SSS-Rank': 'bg-red-600 text-white border-red-700',
        // General
        'Common': 'bg-gray-500 text-white border-gray-600',
        'Uncommon': 'bg-green-500 text-white border-green-600',
        'Rare': 'bg-blue-500 text-white border-blue-600',
        'Epic': 'bg-purple-500 text-white border-purple-600',
        'Legendary': 'bg-yellow-500 text-black border-yellow-600',
        'Mythic': 'bg-red-600 text-white border-red-700',
        'Phantom': 'bg-fuchsia-700 text-white border-fuchsia-800',
        'Supreme': 'bg-gradient-to-r from-orange-400 to-rose-400 text-white border-transparent',
    };
    const finalClassName = rarityClasses[rarity] || 'bg-gray-400';
    return (
        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 whitespace-nowrap', finalClassName, className)}>
            {children || rarity}
        </Badge>
    );
};

const getRarityClass = (rarity: string): string => {
     const rarityClasses: Record<string, string> = {
        'C-Rank': 'bg-gray-500/10 text-white border-gray-600/50',
        'B-Rank': 'bg-green-500/10 text-white border-green-600/50',
        'A-Rank': 'bg-blue-500/10 text-white border-blue-600/50',
        'S-Rank': 'bg-purple-500/10 text-white border-purple-600/50',
        'SS-Rank': 'bg-yellow-500/10 text-yellow-300 border-yellow-600/50',
        'SSS-Rank': 'bg-red-600/10 text-white border-red-700/50',
        'Common': 'bg-gray-500/10 text-white border-gray-600/50',
        'Uncommon': 'bg-green-500/10 text-white border-green-600/50',
        'Rare': 'bg-blue-500/10 text-white border-blue-600/50',
        'Epic': 'bg-purple-500/10 text-white border-purple-600/50',
        'Legendary': 'bg-yellow-500/10 text-yellow-300 border-yellow-600/50',
        'Mythic': 'bg-red-600/10 text-white border-red-700/50',
        'Phantom': 'bg-fuchsia-700/10 text-white border-fuchsia-800/50',
        'Supreme': 'bg-gradient-to-r from-orange-400/20 to-rose-400/20 text-white border-transparent',
    };
    return rarityClasses[rarity] || 'bg-muted/30 border-transparent';
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


function findItemInGameData(identifiedName: string, category: string, allGameData: any[]) {
    const normalizedIdentifiedName = normalizeString(identifiedName);

    for (const world of allGameData) {
        const subcollection = world[category];
        if (!Array.isArray(subcollection)) continue;

        for (const cachedItem of subcollection) {
            // Level 1 Search: Direct name match on the main item (for progression, etc.)
            const normalizedCachedName = normalizeString(cachedItem.name);
            if (normalizedCachedName === normalizedIdentifiedName && !cachedItem.stats) {
                const rarity = cachedItem.rarity || 'Common';
                return { ...cachedItem, world: world.name, rarity: rarity, id: cachedItem.id || nanoid() };
            }

            // Level 2 Search: If the item has a 'stats' array, search inside it
            if (cachedItem.stats && Array.isArray(cachedItem.stats)) {
                for (const stat of cachedItem.stats) {
                    if (stat.name) {
                        const normalizedStatName = normalizeString(stat.name);
                         if (normalizedStatName === normalizedIdentifiedName) {
                            // Found a match in the stats array.
                            // Return ONLY the specific stat object with the world name and an id.
                            return { 
                                ...stat,
                                id: stat.id || nanoid(),
                                world: world.name,
                            };
                        }
                    }
                }
            }
        }
    }
    return null; // No match found
}


// Componente centralizado para upload e análise de itens
function GeneralItemUploader({ asShortcut = false }: { asShortcut?: boolean }) {
    const { toast } = useToast();
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { allGameData } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [foundItems, setFoundItems] = useState<any[]>([]);
    const [notFoundNames, setNotFoundNames] = useState<string[]>([]);
    
    // Reset state when dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            setSelectedFiles([]);
            setFoundItems([]);
            setNotFoundNames([]);
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isDialogOpen]);

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
                description: `Por favor, selecione um ou mais screenshots.`,
            });
            return;
        }
        if (!firestore || !user) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado.' });
            return;
        }

        setIsAnalyzing(true);
        setFoundItems([]);
        setNotFoundNames([]);
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

            if (result && result.items) {
                let savedCount = 0;
                const notFound: string[] = [];

                for (const identifiedItem of result.items) {
                    const fullItemData = findItemInGameData(identifiedItem.name, identifiedItem.category, allGameData);

                    if (fullItemData) {
                        const itemRef = doc(firestore, 'users', user.uid, identifiedItem.category, fullItemData.id);
                        await setDoc(itemRef, fullItemData, { merge: true });
                        savedCount++;
                    } else {
                        notFound.push(`${identifiedItem.name} (${identifiedItem.category})`);
                    }
                }
                
                if (savedCount > 0) {
                  toast({
                      title: `${savedCount} ${savedCount > 1 ? 'Itens Salvos' : 'Item Salvo'}!`,
                      description: `Itens foram identificados e salvos em seu perfil.`,
                  });
                }
                
                if (notFound.length > 0) {
                    toast({
                        variant: 'destructive',
                        title: `${notFound.length} ${notFound.length > 1 ? 'itens não encontrados' : 'item não encontrado'}`,
                        description: `Não foi possível encontrar dados para: ${notFound.join(', ')}`,
                    });
                }

                 if (savedCount === 0 && notFound.length > 0) {
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
            console.error(`Erro ao analisar e salvar itens:`, error);
            toast({
                variant: 'destructive',
                title: 'Erro na Análise',
                description: error.message || `Não foi possível identificar e salvar os itens.`,
            });
        } finally {
            setIsAnalyzing(false);
            // Optionally close dialog on success/error or let user close it
            // setIsDialogOpen(false); 
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {asShortcut ? (
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Itens com IA
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Adicionar Itens ao seu Perfil</DialogTitle>
                    <DialogDescription>
                        Envie screenshots dos seus poderes, auras, pets, armas, etc. A IA irá identificá-los e adicioná-los automaticamente ao seu perfil na categoria correta.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="general-item-upload"
                    />
                    <label htmlFor="general-item-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
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
            </DialogContent>
        </Dialog>
    )
}

const profileCategories = [
    { name: 'Poderes', icon: Flame, description: 'Seus poderes de gacha e progressão.', subcollectionName: 'powers', isInteractiveGrid: true },
    { name: 'Auras', icon: Shield, description: 'Auras de chefe e outros buffs.', subcollectionName: 'auras', isInteractiveGrid: true },
    { name: 'Pets', icon: PawPrint, description: 'Seus companheiros e seus bônus.', subcollectionName: 'pets', isInteractiveGrid: true },
    { name: 'Armas', icon: Swords, description: 'Espadas e foices com seus encantamentos.', subcollectionName: 'weapons', isWeaponSlots: true },
    { name: 'Acessórios', icon: User, description: 'Chapéus, capas e outros itens de vestuário.', subcollectionName: 'accessories', isInteractiveGrid: true },
    { name: 'Gamepasses', icon: Wallet, description: 'Gamepasses que você possui.', subcollectionName: 'gamepasses', isInteractiveGrid: true },
    { name: 'Index', icon: Star, description: 'Tiers de avatares e pets.', subcollectionName: 'index', disableItemUpload: true },
    { name: 'Obeliscos', icon: Pyramid, description: 'Seu progresso nos obeliscos de poder.', subcollectionName: 'obelisks', disableItemUpload: true },
    { name: 'Conquistas', icon: Trophy, description: 'Calcule seus bônus de conquistas.', subcollectionName: 'achievements', disableItemUpload: true },
    { name: 'Rank', icon: ShieldCheck, description: 'Seu rank atual no jogo.', subcollectionName: 'rank', disableItemUpload: true },
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

function IndexTierCalculator() {
    const { user } = useUser();
    const { firestore } = useFirebase();

    const docRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid, 'index', 'tiers');
    }, [firestore, user]);

    const { data: tierData, isLoading } = useDoc(docRef);

    const [avatarTier, setAvatarTier] = useState<number>(0);
    const [petTier, setPetTier] = useState<number>(0);

    const tierOptions = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

    useEffect(() => {
        if (tierData) {
            setAvatarTier((tierData as any).avatarTier || 0);
            setPetTier((tierData as any).petTier || 0);
        }
    }, [tierData]);

    const handleTierChange = async (type: 'avatar' | 'pet', value: string) => {
        if (!docRef) return;
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) return;

        const newAvatarTier = type === 'avatar' ? numericValue : avatarTier;
        const newPetTier = type === 'pet' ? numericValue : petTier;

        if (type === 'avatar') {
            setAvatarTier(numericValue);
        } else {
            setPetTier(numericValue);
        }
        
        await setDoc(docRef, { avatarTier: newAvatarTier, petTier: newPetTier }, { merge: true });
    };

    const avatarBonus = useMemo(() => (avatarTier * 0.05).toFixed(2), [avatarTier]);
    const petBonus = useMemo(() => (petTier * 0.05).toFixed(2), [petTier]);

    if (isLoading) {
      return (
          <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
      );
    }

    return (
        <div className="w-full p-2 space-y-4">
            <div className='space-y-2'>
                <Label htmlFor='avatar-tier'>Tier de Avatar</Label>
                <Select value={avatarTier.toString()} onValueChange={(value) => handleTierChange('avatar', value)}>
                    <SelectTrigger id="avatar-tier">
                        <SelectValue placeholder="Selecione o tier" />
                    </SelectTrigger>
                    <SelectContent>
                        {tierOptions.map(tier => (
                            <SelectItem key={tier} value={tier.toString()}>{tier}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">Bônus de Dano: <span className="font-semibold text-primary">{avatarBonus}x</span></p>
            </div>
            <div className='space-y-2'>
                <Label htmlFor='pet-tier'>Tier de Pet</Label>
                 <Select value={petTier.toString()} onValueChange={(value) => handleTierChange('pet', value)}>
                    <SelectTrigger id="pet-tier">
                        <SelectValue placeholder="Selecione o tier" />
                    </SelectTrigger>
                    <SelectContent>
                        {tierOptions.map(tier => (
                            <SelectItem key={tier} value={tier.toString()}>{tier}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Bônus de Energia: <span className="font-semibold text-primary">{petBonus}x</span></p>
            </div>
        </div>
    );
}

function ObeliskLevelCalculator() {
    const { user } = useUser();
    const { firestore } = useFirebase();

    const docRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid, 'obelisks', 'levels');
    }, [firestore, user]);

    const { data: obeliskData, isLoading } = useDoc(docRef);

    const [damageLevel, setDamageLevel] = useState<number>(0);
    const [energyLevel, setEnergyLevel] = useState<number>(0);
    const [luckyLevel, setLuckyLevel] = useState<number>(0);

    const damageEnergyOptions = Array.from({ length: 21 }, (_, i) => i); // 0 to 20
    const luckyOptions = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

    useEffect(() => {
        if (obeliskData) {
            setDamageLevel((obeliskData as any).damage || 0);
            setEnergyLevel((obeliskData as any).energy || 0);
            setLuckyLevel((obeliskData as any).lucky || 0);
        }
    }, [obeliskData]);

    const handleLevelChange = async (type: 'damage' | 'energy' | 'lucky', value: string) => {
        if (!docRef) return;
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) return;

        let newLevels = {
            damage: damageLevel,
            energy: energyLevel,
            lucky: luckyLevel,
        };

        if (type === 'damage') {
            setDamageLevel(numericValue);
            newLevels.damage = numericValue;
        } else if (type === 'energy') {
            setEnergyLevel(numericValue);
            newLevels.energy = numericValue;
        } else if (type === 'lucky') {
            setLuckyLevel(numericValue);
            newLevels.lucky = numericValue;
        }
        
        await setDoc(docRef, newLevels, { merge: true });
    };

    // Assuming a simple linear bonus for now. This can be adjusted.
    const damageBonus = useMemo(() => (damageLevel * 0.02).toFixed(2), [damageLevel]); // Example: 2% per level
    const energyBonus = useMemo(() => (energyLevel * 0.02).toFixed(2), [energyLevel]); // Example: 2% per level
    const luckyBonus = useMemo(() => (luckyLevel * 0.01).toFixed(2), [luckyLevel]); // Example: 1% per level

    if (isLoading) {
      return (
          <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
      );
    }

    return (
        <div className="w-full p-2 grid grid-cols-3 gap-4">
            <div className='space-y-2'>
                <Label htmlFor='damage-obelisk'>Dano</Label>
                <Select value={damageLevel.toString()} onValueChange={(value) => handleLevelChange('damage', value)}>
                    <SelectTrigger id="damage-obelisk">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {damageEnergyOptions.map(level => (
                            <SelectItem key={level} value={level.toString()}>Lvl {level}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">Bônus: <span className="font-semibold text-primary">+{damageBonus}x</span></p>
            </div>
            <div className='space-y-2'>
                <Label htmlFor='energy-obelisk'>Energia</Label>
                 <Select value={energyLevel.toString()} onValueChange={(value) => handleLevelChange('energy', value)}>
                    <SelectTrigger id="energy-obelisk">
                         <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {damageEnergyOptions.map(level => (
                            <SelectItem key={level} value={level.toString()}>Lvl {level}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Bônus: <span className="font-semibold text-primary">+{energyBonus}x</span></p>
            </div>
             <div className='space-y-2'>
                <Label htmlFor='lucky-obelisk'>Sorte</Label>
                 <Select value={luckyLevel.toString()} onValueChange={(value) => handleLevelChange('lucky', value)}>
                    <SelectTrigger id="lucky-obelisk">
                         <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {luckyOptions.map(level => (
                            <SelectItem key={level} value={level.toString()}>Lvl {level}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Bônus: <span className="font-semibold text-primary">+{luckyBonus}%</span></p>
            </div>
        </div>
    );
}

function toRoman(num: number): string {
  if (num === 0) return '0';
  if (num < 1 || num > 49) return num.toString();
  const roman: [number, string][] = [
    [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = '';
  for (const [value, symbol] of roman) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

function AchievementCalculator() {
    const { user } = useUser();
    const { firestore } = useFirebase();

    const docRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid, 'achievements', 'levels');
    }, [firestore, user]);

    const { data: savedLevels, isLoading } = useDoc(docRef);
    const [levels, setLevels] = useState<Record<string, number>>({});

    useEffect(() => {
        if (savedLevels) {
            setLevels(savedLevels as Record<string, number>);
        }
    }, [savedLevels]);

    const handleLevelChange = async (achievementId: string, value: string) => {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || !docRef) return;

        const updatedLevels = { ...levels, [achievementId]: numericValue };
        setLevels(updatedLevels);
        await setDoc(docRef, updatedLevels, { merge: true });
    };

    const totalBonuses = useMemo(() => {
        return generalAchievements.reduce((acc, ach) => {
            const currentLevel = levels[ach.id] || 0;
            if (ach.progressionBonus.includes('energia')) {
                acc.energy += currentLevel * 0.05;
            } else if (ach.progressionBonus.includes('damage')) {
                acc.damage += currentLevel * 0.05;
            } else if (ach.progressionBonus.includes('coins')) {
                acc.coins += currentLevel * 0.05;
            }
            return acc;
        }, { energy: 0, damage: 0, coins: 0 });
    }, [levels]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    return (
        <div className="w-full p-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {generalAchievements.map(ach => (
                    <div key={ach.id} className="space-y-2">
                        <Label htmlFor={ach.id} className="text-xs truncate">{ach.name}</Label>
                        <Select value={(levels[ach.id] || 0).toString()} onValueChange={(value) => handleLevelChange(ach.id, value)}>
                            <SelectTrigger id={ach.id}>
                                <SelectValue placeholder="Lvl" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: ach.maxLevel + 1 }, (_, i) => i).map(lvl => (
                                    <SelectItem key={lvl} value={lvl.toString()}>Lvl {toRoman(lvl)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
            <div className="border-t pt-4">
                 <h4 className="text-sm font-semibold mb-2">Bônus Totais de Conquistas</h4>
                 <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-md bg-muted/50 border">
                        <Zap className="h-5 w-5 mb-1 mx-auto text-blue-500" />
                        <span className="text-xs font-bold">{`+${totalBonuses.energy.toFixed(2)}x`}</span>
                    </div>
                     <div className="p-2 rounded-md bg-muted/50 border">
                        <Flame className="h-5 w-5 mb-1 mx-auto text-red-500" />
                        <span className="text-xs font-bold">{`+${totalBonuses.damage.toFixed(2)}x`}</span>
                    </div>
                     <div className="p-2 rounded-md bg-muted/50 border">
                        <Coins className="h-5 w-5 mb-1 mx-auto text-yellow-500" />
                        <span className="text-xs font-bold">{`+${totalBonuses.coins.toFixed(2)}x`}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
}

function RankSelector() {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const docRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid, 'rank', 'current');
    }, [firestore, user]);
    
    const { data: rankData, isLoading } = useDoc(docRef);
    const [rank, setRank] = useState<number>(0);

    useEffect(() => {
        if (rankData) {
            setRank((rankData as any).value || 0);
        }
    }, [rankData]);

    const handleRankChange = async (value: string) => {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || !docRef) return;
        
        setRank(numericValue);
        await setDoc(docRef, { value: numericValue }, { merge: true });
    };

    const baseEnergyGain = useMemo(() => {
        return (energyGainPerRank as Record<string, string>)[rank.toString()] || '0';
    }, [rank]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    return (
         <div className="w-full p-2 space-y-2">
            <Label htmlFor='rank-selector'>Seu Rank Atual</Label>
            <Input 
                id="rank-selector"
                type="number"
                value={rank}
                onChange={(e) => handleRankChange(e.target.value)}
                min="0"
                max="115"
            />
            <p className="text-xs text-muted-foreground">Ganho de Energia Base: <span className="font-semibold text-primary">{baseEnergyGain}</span></p>
        </div>
    );
}

function BonusDisplay({ items, category }: { items: any[], category: string }) {
    const totals = useMemo(() => {
        const bonusTotals = {
            damage: 0,
            energy: 0,
            coins: 0,
            exp: 0,
            movespeed: 0,
        };

        if (!items) return bonusTotals;

        const parseBonus = (value: string | undefined): number => {
            if (typeof value !== 'string') return 0;
            return parseFloat(value.replace(/x|%/g, ''));
        };

        items.forEach(item => {
            let data: any = item;
            if(category === 'accessories') {
                const fullAccessory: Accessory | undefined = accessories.find(a => a.id === item.id);
                const rarityOption: RarityOption | undefined = fullAccessory?.rarity_options.find(ro => ro.rarity === item.rarity);
                if (!rarityOption) return;
                data = rarityOption;
            }
            
            if (data.damage_bonus) bonusTotals.damage += parseBonus(data.damage_bonus);
            if (data.energy_bonus) bonusTotals.energy += parseBonus(data.energy_bonus);
            if (data.coins_bonus) bonusTotals.coins += parseBonus(data.coins_bonus);
            if (data.exp_bonus) bonusTotals.exp += parseBonus(data.exp_bonus);
            if (data.movespeed_bonus) bonusTotals.movespeed += parseBonus(data.movespeed_bonus);

            if (item.statType === 'damage' && item.multiplier) bonusTotals.damage += parseBonus(item.multiplier);
            if (item.statType === 'energy' && item.multiplier) bonusTotals.energy += parseBonus(item.multiplier);
            if (item.statType === 'coin' && item.multiplier) bonusTotals.coins += parseBonus(item.multiplier);
        });
        
        return bonusTotals;

    }, [items, category]);

    const bonusConfig = [
        { key: 'damage', label: 'Dano', icon: Flame, color: 'text-red-500', suffix: 'x' },
        { key: 'energy', label: 'Energia', icon: Zap, color: 'text-blue-500', suffix: 'x' },
        { key: 'coins', label: 'Moedas', icon: Coins, color: 'text-yellow-500', suffix: 'x' },
        { key: 'exp', label: 'EXP', icon: Star, color: 'text-green-500', suffix: '%' },
        { key: 'movespeed', label: 'Velocidade', icon: Wind, color: 'text-sky-500', suffix: '%' },
    ] as const;

    const hasAnyBonus = Object.values(totals).some(val => val > 0);

    if (!hasAnyBonus) {
        return null; // Don't render anything if there are no bonuses
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full text-center mb-4">
            {bonusConfig.map(({ key, label, icon: Icon, color, suffix }) => {
                if (totals[key] > 0) {
                    return (
                        <div key={key} className={`flex flex-col items-center p-2 rounded-md bg-muted/50 border`}>
                            <Icon className={`h-5 w-5 mb-1 ${color}`} />
                            <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                            <span className="text-xs font-bold">{`+${totals[key].toFixed(2)}${suffix}`}</span>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    )
}

function InteractiveGridCategory({ subcollectionName, gridData, itemTypeFilter }: { subcollectionName: string; gridData?: any[]; itemTypeFilter?: string; }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { allGameData } = useApp();
    const { toast } = useToast();
    
    const itemsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, subcollectionName);
    }, [firestore, user, subcollectionName]);

    const { data: equippedItems, isLoading } = useCollection(itemsQuery);
    
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const holdTimeout = useRef<NodeJS.Timeout>();
    const [levelingPopover, setLevelingPopover] = useState<string | null>(null);
    const [currentLevelingValue, setCurrentLevelingValue] = useState(0);
    
    const allItems = useMemo(() => {
        if (gridData) return gridData;

        let items;
        if (itemTypeFilter) {
            items = allGameData.flatMap(world => world[itemTypeFilter] || []).filter(item => item && item.id);
        } else if (subcollectionName === 'weapons') {
            const scythes = allGameData.flatMap(world => world.scythes || []);
            const swords = allGameData.flatMap(world => (world.powers || []).filter(p => p.name === 'Swords'));
            items = [...scythes, ...swords];
        } else if (subcollectionName === 'powers') {
            const nonEquippableNames = [
                'Weapon Evolution', 'Stand Evolution', 'Titan Evolution', 'Chakra Progression', 'Breathings', 'Bankai', 'Swords', 'Stands'
            ];
            const equipablePowers = allGameData.flatMap(world => world.powers || [])
            .filter(power => 
                power && 
                power.id && 
                !nonEquippableNames.includes(power.name)
             );
            return equipablePowers;
        }
        else {
            items = allGameData.flatMap(world => world[subcollectionName] || []).filter(item => item && item.id);
        }
        return items;

    }, [gridData, allGameData, subcollectionName, itemTypeFilter]);

    const handleItemClick = async (item: any) => {
        if (!itemsQuery) return;
        const itemRef = doc(itemsQuery, item.id);
        const isEquipped = equippedItems?.some(i => i.id === item.id);

        try {
            if (isEquipped) {
                await deleteDoc(itemRef);
            } else {
                 let dataToSave: any = { id: item.id, name: item.name };
                 if (item.stats && item.stats.length > 0) {
                    dataToSave.rarity = item.stats[0].rarity; 
                 } else if (item.rarity_options && item.rarity_options.length > 0) {
                    dataToSave.rarity = item.rarity_options[0].rarity;
                 } else if (item.leveling?.maxLevel) {
                    dataToSave.leveling = 0;
                 }
                await setDoc(itemRef, dataToSave, { merge: true });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível atualizar ${item.name}.` });
        }
    };

    const handleRarityChange = async (itemId: string, rarity: string) => {
        if (!itemsQuery) return;
        const itemRef = doc(itemsQuery, itemId);
        try {
            await setDoc(itemRef, { rarity }, { merge: true });
            toast({ title: 'Raridade Atualizada!', description: `A raridade do item foi definida como ${rarity}.` });
        } catch (error) {
            console.error(error);
        } finally {
            setOpenPopover(null);
        }
    };
    
    const handlePointerDown = (itemId: string, item: any) => {
         const hasOptions = (item.stats?.length > 0) || (item.rarity_options?.length > 0) || (item.type === 'progression' && item.maxLevel);
        if (!hasOptions) return;
        holdTimeout.current = setTimeout(() => {
            setOpenPopover(itemId);
        }, 1000); 
    };

    const handlePointerUp = () => {
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
        }
    };

    const handleLevelingChange = async (itemId: string, level: number) => {
        if (!itemsQuery) return;
        const itemRef = doc(itemsQuery, itemId);
        try {
            await setDoc(itemRef, { leveling: level }, { merge: true });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full w-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    const uniqueItems = allItems.filter((item, index, self) =>
        index === self.findIndex((t) => (t.id === item.id))
    );
    
    return (
        <div className="w-full">
            <BonusDisplay items={equippedItems} category={subcollectionName} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                {uniqueItems.map((item) => {
                    const uniqueKey = item.id;
                    const isEquipped = equippedItems?.some(i => i.id === item.id);
                    const equippedItemData = equippedItems?.find(i => i.id === item.id);
                    
                    const popoverOptions = item.stats || item.rarity_options || [];

                    const selectedRarity = (equippedItemData as any)?.rarity || popoverOptions?.[0]?.rarity;
                    const selectedOption = popoverOptions?.find((opt:any) => opt.rarity === selectedRarity);
                    const cardBgClass = isEquipped ? getRarityClass(selectedRarity) : 'bg-muted/30 border-transparent';
                    const hasLeveling = item.leveling && typeof item.leveling.maxLevel !== 'undefined';
                    const currentLeveling = (equippedItemData as any)?.leveling || 0;

                    return (
                        <Popover key={uniqueKey} open={openPopover === item.id} onOpenChange={(isOpen) => !isOpen && setOpenPopover(null)}>
                            <PopoverTrigger asChild>
                                <button
                                    onClick={() => handleItemClick(item)}
                                    onPointerDown={() => handlePointerDown(item.id, item)}
                                    onPointerUp={handlePointerUp}
                                    onPointerLeave={handlePointerUp}
                                    className={cn(
                                        'aspect-square rounded-md flex flex-col items-center justify-center p-2 text-center relative overflow-hidden border-2 transition-all duration-200',
                                        isEquipped ? 'border-primary/50' : 'hover:border-primary/50',
                                        cardBgClass
                                    )}
                                >
                                     <div className='absolute top-1 text-xs font-semibold opacity-80 z-10 text-center px-1'>
                                        {isEquipped && selectedOption?.name}
                                     </div>

                                    {hasLeveling && isEquipped && (
                                         <Popover open={levelingPopover === item.id} onOpenChange={(isOpen) => !isOpen && setLevelingPopover(null)}>
                                            <PopoverTrigger asChild>
                                                 <div 
                                                    className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center bg-black/50 rounded-full text-white text-[10px] font-bold z-20 cursor-pointer"
                                                    onPointerDown={(e) => { e.stopPropagation(); clearTimeout(holdTimeout.current as NodeJS.Timeout); }}
                                                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrentLevelingValue(currentLeveling); setLevelingPopover(item.id); }}
                                                 >
                                                    {currentLeveling}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-56 p-4">
                                                <div className="space-y-4">
                                                    <Label htmlFor="leveling-slider" className='text-sm'>Leveling ({currentLevelingValue}/{item.leveling.maxLevel})</Label>
                                                    <Slider
                                                        id="leveling-slider"
                                                        min={0}
                                                        max={item.leveling.maxLevel}
                                                        step={1}
                                                        value={[currentLevelingValue]}
                                                        onValueChange={(value) => setCurrentLevelingValue(value[0])}
                                                        onValueCommit={(value) => handleLevelingChange(item.id, value[0])}
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )}

                                    <p className="text-sm font-bold leading-tight z-10">{item.name}</p>

                                     <div className="absolute bottom-1 flex items-center justify-center w-full z-10">
                                         {isEquipped && <RarityBadge rarity={selectedRarity} />}
                                    </div>
                                </button>
                            </PopoverTrigger>
                             {popoverOptions && popoverOptions.length > 0 && (
                                <PopoverContent className="w-auto p-0">
                                <div className="flex flex-col">
                                    {popoverOptions.map((opt: any) => (
                                        <Button key={opt.id || opt.rarity} variant="ghost" className={cn("rounded-none justify-start", getRarityClass(opt.rarity))} onClick={() => handleRarityChange(item.id, opt.rarity)}>
                                             <RarityBadge rarity={opt.rarity}>{opt.name}</RarityBadge>
                                        </Button>
                                    ))}
                                </div>
                                </PopoverContent>
                            )}
                             {item.type === 'progression' && item.maxLevel && (
                                 <PopoverContent className="w-56 p-4">
                                    <div className="space-y-4">
                                        <Label htmlFor="level-slider" className='text-sm'>{item.name} Level ({(equippedItemData as any)?.leveling || 0}/{item.maxLevel})</Label>
                                        <Slider
                                            id="level-slider"
                                            min={0}
                                            max={item.maxLevel}
                                            step={1}
                                            defaultValue={[(equippedItemData as any)?.leveling || 0]}
                                            onValueCommit={(value) => handleLevelingChange(item.id, value[0])}
                                        />
                                    </div>
                                </PopoverContent>
                             )}
                        </Popover>
                    );
                })}
            </div>
        </div>
    );
}

function WeaponSlots() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirebase().firestore;
    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [step, setStep] = useState<'type' | 'item'>('type');
    const [weaponType, setWeaponType] = useState<'damage' | 'scythe' | 'energy' | null>(null);
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    
    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const equippedWeapons = (userData as any)?.weaponSlots || {};

    const weaponData = useMemo(() => {
        return {
            damage: damageSwordsArticle.tables?.damageSwords.rows || [],
            scythe: scythesArticle.tables?.scythes.rows || [],
            energy: swordsArticle.tables?.world3.rows.concat(swordsArticle.tables?.world5.rows, swordsArticle.tables?.world15.rows, swordsArticle.tables?.world19.rows) || [],
        };
    }, []);

    const handleSlotClick = (slotIndex: number) => {
        setSelectedSlot(slotIndex);
        setStep('type');
        setWeaponType(null);
        setOpen(true);
    };

    const handleTypeSelect = (type: 'damage' | 'scythe' | 'energy') => {
        setWeaponType(type);
        setStep('item');
    };

    const handleItemSelect = async (item: any) => {
        if (selectedSlot === null || !userDocRef) return;
        const newSlots = {
            ...equippedWeapons,
            [selectedSlot]: {
                name: item.Espada || item.Foice,
                rarity: item.Raridade,
                stats: item['Stats (3 Estrelas)'] || item.Stats
            }
        };

        try {
            await updateDoc(userDocRef, { weaponSlots: newSlots });
            toast({ title: "Arma Equipada!", description: `${item.Espada || item.Foice} equipada no slot ${selectedSlot + 1}.` });
        } catch (error) {
            toast({ variant: 'destructive', title: "Erro", description: "Não foi possível equipar a arma." });
        } finally {
            setOpen(false);
        }
    };
    
    const isLoading = isUserLoading || isUserDataLoading;

    return (
        <div className='grid grid-cols-3 gap-4'>
            {[0, 1, 2].map(slotIndex => {
                const equipped = equippedWeapons[slotIndex];
                return (
                    <Card key={slotIndex} onClick={() => handleSlotClick(slotIndex)} className="cursor-pointer hover:border-primary/50 transition-colors h-48 flex flex-col justify-center items-center">
                        <CardContent className="p-4 text-center">
                             {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : equipped ? (
                                <div>
                                    <p className="font-bold">{equipped.name}</p>
                                    <p className="text-xs text-muted-foreground">{equipped.rarity}</p>
                                    <p className="text-xs mt-2">{equipped.stats}</p>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">
                                    <PlusCircle className="mx-auto h-8 w-8" />
                                    <p className="text-sm mt-2">Equipar Arma</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
             <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Equipar Arma no Slot {selectedSlot !== null ? selectedSlot + 1 : ''}</DialogTitle>
                        <DialogDescription>
                            {step === 'type' ? 'Selecione o tipo de arma.' : `Selecione uma arma do tipo ${weaponType}.`}
                        </DialogDescription>
                    </DialogHeader>
                    {step === 'type' ? (
                        <div className='grid grid-cols-1 gap-2 py-4'>
                            <Button variant="outline" onClick={() => handleTypeSelect('damage')}>Dano (Espadas)</Button>
                            <Button variant="outline" onClick={() => handleTypeSelect('scythe')}>Foices</Button>
                            <Button variant="outline" onClick={() => handleTypeSelect('energy')}>Energia (Espadas)</Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-72">
                            <div className="space-y-2 py-4">
                                {weaponType && weaponData[weaponType].map((item: any, index: number) => (
                                     <Button key={index} variant="ghost" className="w-full justify-start h-auto" onClick={() => handleItemSelect(item)}>
                                        <div className='flex flex-col items-start'>
                                            <p>{item.Espada || item.Foice}</p>
                                            {item.Raridade && <RarityBadge rarity={item.Raridade} />}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CategoryDisplay({ subcollectionName, isInteractiveGrid, isWeaponSlots }: { subcollectionName: string, isInteractiveGrid?: boolean, isWeaponSlots?: boolean }) {
    const { allGameData } = useApp();
    const { user } = useUser();
    const { firestore } = useFirebase();

    if (subcollectionName === 'index') return <IndexTierCalculator />;
    if (subcollectionName === 'obelisks') return <ObeliskLevelCalculator />;
    if (subcollectionName === 'achievements') return <AchievementCalculator />;
    if (subcollectionName === 'rank') return <RankSelector />;
    if (isWeaponSlots) return <WeaponSlots />;
    if (isInteractiveGrid) {
        const gridData = subcollectionName === 'gamepasses' ? allGamepasses : (subcollectionName === 'accessories' ? accessories : undefined);
        return <InteractiveGridCategory subcollectionName={subcollectionName} gridData={gridData} />;
    }

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
        <>
            <BonusDisplay items={items} category={subcollectionName} />
            <div className="grid grid-cols-5 gap-2 w-full">
                {items.map(item => (
                     <div key={(item as any).id || (item as any).name} className="aspect-square bg-muted/50 rounded-md flex flex-col items-center justify-center p-1 relative overflow-hidden border">
                        <p className="text-[10px] font-bold leading-tight text-center z-10">{(item as any).name}</p>
                        <RarityBadge rarity={(item as any).rarity} className="absolute bottom-1 right-1 text-[8px] px-1 py-0 h-4" />
                    </div>
                ))}
            </div>
        </>
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

                 <Card>
                    <CardHeader>
                        <CardTitle>Bônus Totais</CardTitle>
                        <CardDescription>Resumo de todos os bônus combinados de suas categorias.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for the global bonus display */}
                        <p className='text-sm text-muted-foreground text-center py-4'>Cálculo de bônus globais será implementado aqui.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReputationSection />
                    <UserFeedbackSection />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Meu Personagem</h2>
                    <p className="text-muted-foreground">Adicione seus itens usando o botão acima. Eles aparecerão aqui automaticamente.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileCategories.map((category) => (
                        <Card key={category.name} className={cn("relative", category.isWeaponSlots && "md:col-span-2 lg:col-span-3")}>
                            <CardHeader className='flex-row items-start justify-between'>
                                <div>
                                    <CardTitle className='flex items-center gap-3'>
                                        <category.icon className="h-6 w-6 text-primary" />
                                        {category.name}
                                    </CardTitle>
                                    <CardDescription>{category.description}</CardDescription>
                                </div>
                                {!category.disableItemUpload && (
                                    <div className="absolute top-2 right-2">
                                        <GeneralItemUploader asShortcut={true} />
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                                <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                    <CategoryDisplay 
                                        subcollectionName={category.subcollectionName} 
                                        isInteractiveGrid={category.isInteractiveGrid}
                                        isWeaponSlots={category.isWeaponSlots}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {/* Fighters Section */}
                    <Card className="relative md:col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><Users className="h-6 w-6 text-primary" />Titãs</CardTitle>
                            <CardDescription>Seus lutadores do tipo Titã.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                <InteractiveGridCategory subcollectionName="fighters" itemTypeFilter="Titan" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="relative md:col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><Users className="h-6 w-6 text-primary" />Stands</CardTitle>
                            <CardDescription>Seus lutadores do tipo Stand.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                 <InteractiveGridCategory subcollectionName="stands" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="relative md:col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><Users className="h-6 w-6 text-primary" />Shadows</CardTitle>
                            <CardDescription>Seus lutadores do tipo Shadow.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                <InteractiveGridCategory subcollectionName="shadows" />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}
