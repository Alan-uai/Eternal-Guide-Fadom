'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, PlusCircle } from 'lucide-react';
import Head from 'next/head';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

import { profileCategories } from '@/lib/profile-config';
import { GeneralItemUploader } from '@/components/profile/GeneralItemUploader';
import { ReputationSection } from '@/components/profile/ReputationSection';
import { UserFeedbackSection } from '@/components/profile/UserFeedbackSection';
import { CategoryDisplay } from '@/components/profile/CategoryDisplay';


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
                            <CardTitle className='flex items-center gap-3'><User className="h-6 w-6 text-primary" />Titãs</CardTitle>
                            <CardDescription>Seus lutadores do tipo Titã.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                <CategoryDisplay subcollectionName="fighters" itemTypeFilter="Titan" isInteractiveGrid={true}/>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="relative md:col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><User className="h-6 w-6 text-primary" />Stands</CardTitle>
                            <CardDescription>Seus lutadores do tipo Stand.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                 <CategoryDisplay subcollectionName="stands" isInteractiveGrid={true} />
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="relative md:col-span-1 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-3'><User className="h-6 w-6 text-primary" />Shadows</CardTitle>
                            <CardDescription>Seus lutadores do tipo Shadow.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0 space-y-4'>
                             <div className='w-full rounded-md bg-muted/20 border-2 border-dashed flex flex-col items-center justify-center p-2 min-h-48'>
                                <CategoryDisplay subcollectionName="shadows" isInteractiveGrid={true} />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}
