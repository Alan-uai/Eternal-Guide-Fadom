'use client';

import { useEffect, useState } from 'react';
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
import { Loader2, Save } from 'lucide-react';

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
        // Remove the query param from the URL without reloading the page
        router.replace('/profile', { scroll: false });
    };

    const onSubmit = async (values: StatsFormData) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado.' });
            return;
        }
        setIsSaving(true);
        try {
            const userRef = doc(firestore, 'users', user.uid);
            // We use updateDoc because the user document is already created on login
            await updateDoc(userRef, {
                currentWorld: values.currentWorld,
                rank: parseInt(values.rank, 10),
            });
            
            // Save energy and damage to their respective locations
            const energyRef = doc(firestore, 'users', user.uid, 'rank', 'current');
            await setDoc(energyRef, { value: parseInt(values.rank, 10) }, { merge: true });

            // Note: We're saving the 'totalDamage' from the form as the user's 'currentEnergy'
            // because a user's base damage is derived from their accumulated energy.
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


    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Bem-vindo ao Guia Eterno!</DialogTitle>
                    <DialogDescription>
                        Para começar, preencha suas estatísticas básicas do jogo. Isso nos ajudará a fornecer cálculos e dicas personalizadas.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="currentWorld"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mundo Atual</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: Mundo 10" {...field} />
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
