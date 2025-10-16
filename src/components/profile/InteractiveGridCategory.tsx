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
import { Loader2 } from 'lucide-react';

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
    
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const holdTimeout = useRef<NodeJS.Timeout>();
    const [levelingPopover, setLevelingPopover] = useState<string | null>(null);
    const [currentLevelingValue, setCurrentLevelingValue] = useState(0);
    
    const allItems = useMemo(() => {
        if (gridData) return gridData;

        let items;
        if (itemTypeFilter) {
            items = allGameData.flatMap(world => (world[subcollectionName] || [])).filter(item => item && item.id && item.type === itemTypeFilter);
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
                 }
                 if (item.leveling?.maxLevel) {
                    dataToSave.leveling = 0;
                 }
                 if (item.type === 'progression') {
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
                    const isPower = subcollectionName === 'powers';
                    const uniqueKey = isPower ? `${item.name}-${item.id}` : item.id;
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
                                     <div className='absolute top-1 text-xs font-semibold opacity-80 z-10 text-center px-1 truncate w-full'>
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

                                     <div className="absolute bottom-1 flex items-center justify-center w-full z-10 gap-2">
                                         {isEquipped && <RarityBadge rarity={selectedRarity} />}
                                         {isEquipped && selectedOption?.name && <span className="text-[10px] font-medium opacity-80">{selectedOption.name}</span>}
                                    </div>
                                </button>
                            </PopoverTrigger>
                             {popoverOptions && popoverOptions.length > 0 && (
                                <PopoverContent className="w-auto p-0">
                                <div className="flex flex-col">
                                    {popoverOptions.map((opt: any) => (
                                        <Button key={opt.id || opt.rarity} variant="ghost" className={cn("rounded-none justify-start", getRarityClass(opt.rarity))} onClick={() => handleRarityChange(item.id, opt.rarity)}>
                                             <RarityBadge rarity={opt.rarity}>{opt.name || opt.rarity}</RarityBadge>
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
