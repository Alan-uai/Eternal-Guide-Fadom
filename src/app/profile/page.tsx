
'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Swords, Shield, Flame, PawPrint, Star, Pyramid, ShieldCheck, PlusCircle, BrainCircuit, User, Upload, Sparkles, X, Image as ImageIcon, LogOut, Award, Eye, ThumbsUp, HelpCircle, Coins, Zap, Wind } from 'lucide-react';
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
import { collection, query, where, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useApp } from '@/context/app-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
function GeneralItemUploader() {
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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Itens com IA
                </Button>
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
    { name: 'Poderes', icon: Flame, description: 'Seus poderes de gacha e progressão.', subcollectionName: 'powers' },
    { name: 'Auras', icon: Shield, description: 'Auras de chefe e outros buffs.', subcollectionName: 'auras' },
    { name: 'Pets', icon: PawPrint, description: 'Seus companheiros e seus bônus.', subcollectionName: 'pets' },
    { name: 'Armas', icon: Swords, description: 'Espadas, foices e outros equipamentos.', subcollectionName: 'weapons' },
    { name: 'Acessórios', icon: User, description: 'Chapéus, capas e outros itens de vestuário.', subcollectionName: 'accessories' },
    { name: 'Index', icon: Star, description: 'Tiers de avatares e pets.', subcollectionName: 'index' },
    { name: 'Obeliscos', icon: Pyramid, description: 'Seu progresso nos obeliscos de poder.', subcollectionName: 'obelisks' },
    { name: 'Rank', icon: ShieldCheck, description: 'Seu rank atual no jogo.', subcollectionName: 'rank' },
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

function BonusDisplay({ items }: { items: any[] }) {
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
            if (item.damage_bonus) bonusTotals.damage += parseBonus(item.damage_bonus);
            if (item.energy_bonus) bonusTotals.energy += parseBonus(item.energy_bonus);
            if (item.coins_bonus) bonusTotals.coins += parseBonus(item.coins_bonus);
            if (item.exp_bonus) bonusTotals.exp += parseBonus(item.exp_bonus);
            if (item.movespeed_bonus) bonusTotals.movespeed += parseBonus(item.movespeed_bonus);

            if (item.statType === 'damage' && item.multiplier) bonusTotals.damage += parseBonus(item.multiplier);
            if (item.statType === 'energy' && item.multiplier) bonusTotals.energy += parseBonus(item.multiplier);
            if (item.statType === 'coin' && item.multiplier) bonusTotals.coins += parseBonus(item.multiplier);
        });
        
        return bonusTotals;

    }, [items]);

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

function CategoryDisplay({ subcollectionName }: { subcollectionName: string }) {
    const { user } = useUser();
    const firestore = useFirebase().firestore;

    if (subcollectionName === 'index') {
        return <IndexTierCalculator />;
    }
    if (subcollectionName === 'obelisks') {
        return <ObeliskLevelCalculator />;
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
            <BonusDisplay items={items} />
            <div className="grid grid-cols-5 gap-2 w-full">
                {items.map(item => (
                    <div key={item.id} className="aspect-square bg-muted/50 rounded-md flex flex-col items-center justify-center p-1 relative overflow-hidden border">
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
                        <Card key={category.name}>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-3'>
                                    <category.icon className="h-6 w-6 text-primary" />
                                    {category.name}
                                </CardTitle>
                                <CardDescription>{category.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                                <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                    <CategoryDisplay subcollectionName={category.subcollectionName} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

    