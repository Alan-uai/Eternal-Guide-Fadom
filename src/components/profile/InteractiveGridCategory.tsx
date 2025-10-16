'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useFirebase, useMemoFirebase, useCollection } from '@/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { useApp } from '@/context/app-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RarityBadge, getRarityClass } from './RarityBadge';
import { BonusDisplay } from './BonusDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

export function InteractiveGridCategory({ subcollectionName, gridData, itemTypeFilter }: { subcollectionName: string; gridData?: any[]; itemTypeFilter?: string; }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { allGameData } = useApp();
    const { toast } = useToast();
    
    const itemsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, subcollectionName);
    }, [firestore, user, subcollectionName]);

    const { data: equippedItems, isLoading } = useCollection(itemsQuery);
    
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const [levelingPopover, setLevelingPopover] = useState<string | null>(null);
    const [currentLevelingValue, setCurrentLevelingValue] = useState(0);
    
    const allItems = useMemo(() => {
        if (gridData) return gridData;

        let items;
        const nonEquippablePowerNames = [
            'Weapon Evolution', 'Stand Evolution', 'Titan Evolution', 'Chakra Progression', 'Breathings', 'Bankai'
        ];

        if (subcollectionName === 'powers') {
            items = allGameData.flatMap(world => world.powers || [])
            .filter(power => 
                power && 
                power.id && 
                !nonEquippablePowerNames.includes(power.name)
             );
        } else if (itemTypeFilter) {
            items = allGameData.flatMap(world => (world.fighters || [])).filter(item => item && item.id && item.type === itemTypeFilter);
        }
        else {
            items = allGameData.flatMap(world => world[subcollectionName] || []).filter(item => item && item.id);
        }
        return items;

    }, [gridData, allGameData, subcollectionName, itemTypeFilter]);

    const handleEquipItem = async (item: any, rarityOrLevel: string | number) => {
        if (!itemsQuery) return;
        
        let dataToSave: any = { id: item.id, name: item.name };
        if (typeof rarityOrLevel === 'string') {
            dataToSave.rarity = rarityOrLevel;
        } else if (typeof rarityOrLevel === 'number') {
            dataToSave.leveling = rarityOrLevel;
        }

        const itemRef = doc(itemsQuery, item.id);

        try {
            await setDoc(itemRef, dataToSave, { merge: true });
            toast({ title: 'Item Equipado!', description: `${item.name} foi equipado/atualizado.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível equipar ${item.name}.` });
        } finally {
            setOpenPopoverId(null);
        }
    };

    const handleUnequipItem = async (itemId: string) => {
        if (!itemsQuery) return;
        const itemRef = doc(itemsQuery, itemId);
        try {
            await deleteDoc(itemRef);
            toast({ title: 'Item Removido' });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Erro', description: `Não foi possível remover o item.` });
        } finally {
             setOpenPopoverId(null);
        }
    }
    
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
            <div className="grid grid-cols-5 gap-2 w-full">
                {uniqueItems.map((item) => {
                    const isEquipped = equippedItems?.some(i => i.id === item.id);
                    const equippedItemData = equippedItems?.find(i => i.id === item.id);
                    
                    const popoverOptions = item.stats || item.rarity_options || [];
                    const isProgressionPower = item.type === 'progression' && item.maxLevel;

                    const selectedRarity = (equippedItemData as any)?.rarity || popoverOptions?.[0]?.rarity;
                    const selectedOption = popoverOptions?.find((opt:any) => opt.rarity === selectedRarity);
                    const selectedName = selectedOption?.name || (isProgressionPower ? `${((equippedItemData as any)?.leveling || 0)}/${item.maxLevel}` : '');


                    const cardBgClass = isEquipped ? getRarityClass(selectedRarity) : 'bg-muted/30 border-transparent';
                    const hasLeveling = item.leveling && typeof item.leveling.maxLevel !== 'undefined';
                    const currentLeveling = (equippedItemData as any)?.leveling || 0;
                    
                    return (
                        <Popover key={item.id} open={openPopoverId === item.id} onOpenChange={(isOpen) => !isOpen && setOpenPopoverId(null)}>
                            <PopoverTrigger asChild>
                                <button
                                    onClick={() => setOpenPopoverId(item.id)}
                                    className={cn(
                                        'aspect-square rounded-md flex flex-col items-center justify-center p-1 text-center relative overflow-hidden border-2 transition-all duration-200 group',
                                        isEquipped ? 'border-primary/50' : 'hover:border-primary/50',
                                        cardBgClass
                                    )}
                                >
                                     {isEquipped && (
                                        <div className='absolute top-1 text-xs font-semibold opacity-80 z-10 text-center px-1 truncate w-full'>
                                            {selectedName}
                                        </div>
                                     )}

                                    {hasLeveling && isEquipped && (
                                         <Popover open={levelingPopover === item.id} onOpenChange={(isOpen) => !isOpen && setLevelingPopover(null)}>
                                            <PopoverTrigger asChild>
                                                 <div 
                                                    className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center bg-black/50 rounded-full text-white text-[10px] font-bold z-20 cursor-pointer"
                                                    onClick={(e) => { e.stopPropagation(); setCurrentLevelingValue(currentLeveling); setLevelingPopover(item.id); }}
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

                                    <p className="text-[10px] lg:text-xs font-bold leading-tight z-10 group-hover:scale-105 transition-transform">{item.name}</p>

                                     {isEquipped && (
                                        <div className="absolute bottom-1 flex items-center justify-center w-full z-10 gap-2">
                                            <RarityBadge rarity={selectedRarity} />
                                        </div>
                                     )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <div className="flex flex-col">
                                    {popoverOptions && popoverOptions.length > 0 && popoverOptions.map((opt: any) => (
                                        <Button key={opt.id || opt.rarity} variant="ghost" className={cn("rounded-none justify-start", getRarityClass(opt.rarity))} onClick={() => handleEquipItem(item, opt.rarity)}>
                                            <RarityBadge rarity={opt.rarity}>{opt.name || opt.rarity}</RarityBadge>
                                        </Button>
                                    ))}
                                    {isProgressionPower && (
                                        <div className="p-4 space-y-4">
                                            <Label htmlFor="level-slider" className='text-sm'>{item.name} Level ({(equippedItemData as any)?.leveling || 0}/{item.maxLevel})</Label>
                                            <Slider
                                                id="level-slider"
                                                min={0}
                                                max={item.maxLevel}
                                                step={1}
                                                defaultValue={[(equippedItemData as any)?.leveling || 0]}
                                                onValueCommit={(value) => handleEquipItem(item, value[0])}
                                            />
                                        </div>
                                    )}
                                    {isEquipped && (
                                        <>
                                            <Separator />
                                            <Button variant="ghost" className="w-full justify-center text-destructive rounded-none" onClick={() => handleUnequipItem(item.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remover
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </div>
        </div>
    );
}
