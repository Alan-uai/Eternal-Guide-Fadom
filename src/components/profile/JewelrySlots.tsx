'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Gem, Coins, Flame, Shield } from 'lucide-react';
import { RarityBadge } from './RarityBadge';
import { allJewelry } from '@/lib/jewelry-data';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


type JewelryType = 'energy' | 'coin' | 'damage' | 'luck';

const jewelryIcons: Record<JewelryType, React.ElementType> = {
    energy: Gem,
    coin: Coins,
    damage: Flame,
    luck: Shield
};

export function JewelrySlots() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<JewelryType | null>(null);
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    
    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const [equippedJewelry, setEquippedJewelry] = useState<any>({});
    
    useEffect(() => {
        if (userData?.jewelrySlots) {
            setEquippedJewelry(userData.jewelrySlots);
        } else {
            setEquippedJewelry({});
        }
    }, [userData]);


    const handleSlotClick = (slotType: JewelryType) => {
        setSelectedSlot(slotType);
        setOpen(true);
    };

    const handleItemSelect = async (item: any) => {
        if (selectedSlot === null || !userDocRef) return;
        
        const newJewelryData: any = {
            id: item.id, 
            name: item.name,
            level: item.level,
            type: item.type,
        };

        const newSlots = {
            ...equippedJewelry,
            [selectedSlot]: newJewelryData
        };

        setEquippedJewelry(newSlots);

        try {
            await updateDoc(userDocRef, { jewelrySlots: newSlots });
            toast({ title: "Jóia Equipada!", description: `${item.name} equipada no slot de ${selectedSlot}.` });
        } catch (error) {
            console.error(error);
            setEquippedJewelry((userData as any)?.jewelrySlots || {});
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível equipar a jóia." });
        } finally {
            setOpen(false);
        }
    };
    
    const getBonusForJewelry = (item: any) => {
        if (!item) return '0x';
        const jewelryData = allJewelry.find(j => j.type === item.type && j.level === item.level);
        return jewelryData?.bonus || '0x';
    };

    const isLoading = isUserLoading || isUserDataLoading;
    const slots: JewelryType[] = ['energy', 'coin', 'damage', 'luck'];

    return (
        <div className='w-full'>
            <div className='grid grid-cols-2 gap-4 items-start justify-center max-w-sm mx-auto'>
                {slots.map(slotType => {
                    const equipped = equippedJewelry[slotType];
                    const Icon = jewelryIcons[slotType];

                    return (
                        <Card 
                            key={slotType}
                            className="cursor-pointer hover:border-primary/50 transition-colors w-full aspect-square flex flex-col justify-center items-center gap-2 text-center"
                            onClick={() => handleSlotClick(slotType)}
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : equipped ? (
                                <>
                                    <Icon className="h-6 w-6 text-primary" />
                                    <p className="font-bold text-sm leading-tight">{equipped.name}</p>
                                    <RarityBadge rarity={equipped.level} />
                                    <p className="text-xs mt-1 font-semibold">{getBonusForJewelry(equipped)}</p>
                                </>
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <Icon className="h-8 w-8" />
                                    <p className="text-sm capitalize">Equipar {slotType}</p>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>
             <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Equipar Jóia de <span className='capitalize text-primary'>{selectedSlot}</span></DialogTitle>
                        <DialogDescription>
                            Selecione o nível do bracelete para equipar.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-72">
                        <div className="space-y-2 py-4">
                            {allJewelry
                                .filter(item => item.type === selectedSlot)
                                .map((item: any, index: number) => (
                                 <Button key={index} variant="ghost" className="w-full justify-start h-auto" onClick={() => handleItemSelect(item)}>
                                    <div className='flex flex-col items-start'>
                                        <p>{item.name}</p>
                                        <RarityBadge rarity={item.level} />
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
