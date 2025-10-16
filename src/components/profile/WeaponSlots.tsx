'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Star } from 'lucide-react';
import { RarityBadge } from './RarityBadge';
import { damageSwordsArticle } from '@/lib/wiki-articles/damage-swords';
import { scythesArticle } from '@/lib/wiki-articles/scythes';
import { swordsArticle } from '@/lib/wiki-articles/swords';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


// Dummy data for enchantments - in a real app, this would come from a data file
const breathingEnchantments = ['Sun', 'Moon', 'Water', 'Thunder', 'Wind', 'Beast'];
const stoneEnchantments = ['Attack', 'Speed', 'Critical'];
const passiveEnchantments = ['Lifesteal', 'Cooldown', 'AoE'];

export function WeaponSlots() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
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
            energy: swordsArticle.tables 
                ? Object.values(swordsArticle.tables).flatMap(table => table.rows)
                : [],
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

    const updateWeaponData = async (slotIndex: number, newData: object) => {
        if (!userDocRef) return;
        
        const currentData = (userData as any)?.weaponSlots || {};
        const weaponToUpdate = currentData[slotIndex];

        if (!weaponToUpdate) {
            toast({ variant: "destructive", title: "Erro", description: "Nenhuma arma equipada neste slot." });
            return;
        }

        const updatedWeapon = { ...weaponToUpdate, ...newData };
        const newSlots = { ...currentData, [slotIndex]: updatedWeapon };

        try {
            await updateDoc(userDocRef, { weaponSlots: newSlots });
             // No toast here to avoid being too noisy on star clicks
        } catch (error) {
            console.error("Error updating weapon data:", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar os dados da arma." });
        }
    };


    const handleItemSelect = async (item: any) => {
        if (selectedSlot === null || !userDocRef || !weaponType) return;
        
        const newWeaponData = {
            id: item.name, 
            name: item.name,
            rarity: item.rarity,
            type: weaponType,
            evolutionLevel: 0, 
            breathingEnchantment: null,
            stoneEnchantment: null,
            passiveEnchantment: null,
        };

        const newSlots = {
            ...equippedWeapons,
            [selectedSlot]: newWeaponData
        };

        try {
            await updateDoc(userDocRef, { weaponSlots: newSlots });
            toast({ title: "Arma Equipada!", description: `${item.name} equipada no slot ${selectedSlot + 1}.` });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível equipar a arma." });
        } finally {
            setOpen(false);
        }
    };
    
    const getStatForLevel = (item: any, equipped: any) => {
        if (!item || !equipped) return equipped?.stats;

        const level = equipped.evolutionLevel || 0;
        
        if (item.type === 'damage') {
             // For damage swords, stats are based on enchantments and not stars in the provided data
             // This part might need adjustment if the data structure for damage swords changes to include star levels
             return item.baseDamage;
        }

        if(item.type === 'scythe') {
            switch(level) {
                case 1: return item.one_star_stats;
                case 2: return item.two_star_stats;
                case 3: return item.three_star_stats;
                default: return item.base_stats;
            }
        }

        if(item.type === 'energy') {
            // Find the base item and its evolutions
            const baseItem = weaponData.energy.find(i => i.name.startsWith(item.name.split(' (')[0]) && !i.name.includes('Estrela'));
            const evolutions = weaponData.energy.filter(i => i.name.startsWith(item.name.split(' (')[0]) && i.name.includes('Estrela'));
            
            switch(level) {
                case 1: return evolutions.find(e => e.name.includes('1 Estrela'))?.stats || baseItem?.stats;
                case 2: return evolutions.find(e => e.name.includes('2 Estrelas'))?.stats || baseItem?.stats;
                case 3: return evolutions.find(e => e.name.includes('3 Estrelas'))?.stats || baseItem?.stats;
                default: return baseItem?.stats;
            }
        }
        
        return equipped.stats;
    }

    const isLoading = isUserLoading || isUserDataLoading;
    const baseEvolutionStars = [1, 2, 3];

    return (
        <div className='flex w-full flex-row gap-4 items-start'>
            {[0, 1, 2].map(slotIndex => {
                const equipped = equippedWeapons[slotIndex];
                const fullItemData = equipped ? 
                    (weaponData[equipped.type as 'damage' | 'scythe' | 'energy'] || []).find(i => i.name === equipped.name) 
                    : null;
                
                const displayedStat = getStatForLevel(fullItemData, equipped);

                return (
                    <div key={slotIndex} className="flex flex-col items-center gap-2 w-full">
                        <Card 
                            className="cursor-pointer hover:border-primary/50 transition-colors h-48 w-full flex flex-col justify-between" 
                            onClick={() => handleSlotClick(slotIndex)}
                        >
                            <div className='p-4 text-center relative flex-grow flex flex-col items-center justify-center'>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                ) : equipped ? (
                                    <>
                                        {equipped.type === 'damage' && (
                                            <>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="absolute top-1 left-1 h-6 px-2 text-xs" onClick={(e) => e.stopPropagation()}>
                                                            {equipped.stoneEnchantment || 'Stone'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-1">
                                                        {stoneEnchantments.map(enchant => (
                                                            <Button key={enchant} variant="ghost" size="sm" className="w-full justify-start" onClick={(e) => { e.stopPropagation(); updateWeaponData(slotIndex, { stoneEnchantment: enchant }) }}>
                                                                {enchant}
                                                            </Button>
                                                        ))}
                                                    </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-6 px-2 text-xs" onClick={(e) => e.stopPropagation()}>
                                                            {equipped.breathingEnchantment || 'Breathing'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-1">
                                                        {breathingEnchantments.map(enchant => (
                                                            <Button key={enchant} variant="ghost" size="sm" className="w-full justify-start" onClick={(e) => { e.stopPropagation(); updateWeaponData(slotIndex, { breathingEnchantment: enchant }) }}>
                                                                {enchant}
                                                            </Button>
                                                        ))}
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        )}
                                        {equipped.type === 'scythe' && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-6 px-2 text-xs" onClick={(e) => e.stopPropagation()}>
                                                        {equipped.passiveEnchantment || 'Passive'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-1">
                                                    {passiveEnchantments.map(enchant => (
                                                        <Button key={enchant} variant="ghost" size="sm" className="w-full justify-start" onClick={(e) => { e.stopPropagation(); updateWeaponData(slotIndex, { passiveEnchantment: enchant }) }}>
                                                            {enchant}
                                                        </Button>
                                                    ))}
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                        <p className="font-bold">{equipped.name}</p>
                                        <RarityBadge rarity={equipped.rarity} />
                                        <p className="text-xs mt-2">{displayedStat}</p>
                                    </>
                                ) : (
                                    <div className="text-muted-foreground">
                                        <PlusCircle className="mx-auto h-8 w-8" />
                                        <p className="text-sm mt-2">Equipar Arma</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                        <div className='flex justify-center items-center gap-2 h-5'>
                            {baseEvolutionStars.map(starLevel => (
                                <Star
                                    key={starLevel}
                                    className={cn(
                                        'h-5 w-5 text-gray-500 transition-colors',
                                        equipped && 'cursor-pointer',
                                        equipped && (equipped.evolutionLevel || 0) >= starLevel && 'text-red-500 fill-red-500'
                                    )}
                                    onClick={(e) => {
                                        if (!equipped) return;
                                        e.stopPropagation();
                                        const newLevel = equipped.evolutionLevel === starLevel ? starLevel - 1 : starLevel;
                                        updateWeaponData(slotIndex, { evolutionLevel: newLevel });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
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
                            <Button variant="outline" onClick={() => handleTypeSelect('damage')}>Dano (Espadas de Dano)</Button>
                            <Button variant="outline" onClick={() => handleTypeSelect('scythe')}>Foices</Button>
                            <Button variant="outline" onClick={() => handleTypeSelect('energy')}>Energia (Espadas de Energia)</Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-72">
                            <div className="space-y-2 py-4">
                                {weaponType && weaponData[weaponType]
                                    .filter(item => item.name && !item.name.includes('Estrela') && !item.name.includes('Star'))
                                    .map((item: any, index: number) => (
                                     <Button key={index} variant="ghost" className="w-full justify-start h-auto" onClick={() => handleItemSelect(item)}>
                                        <div className='flex flex-col items-start'>
                                            <p>{item.name}</p>
                                            {item.rarity && <RarityBadge rarity={item.rarity} />}
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
