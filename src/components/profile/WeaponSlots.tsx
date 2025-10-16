'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { RarityBadge } from './RarityBadge';
import { damageSwordsArticle, scythesArticle, swordsArticle } from '@/lib/wiki-data';

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
