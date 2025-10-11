// src/app/calculator/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Swords, Shield, Flame, PawPrint, Star, Pyramid, ShieldCheck, PlusCircle, Construction, BrainCircuit, User } from 'lucide-react';
import Head from 'next/head';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';

const profileCategories = [
    { name: 'Poderes', icon: Flame, description: 'Seus poderes de gacha e progressão.' },
    { name: 'Auras', icon: Shield, description: 'Auras de chefe e outros buffs.' },
    { name: 'Pets', icon: PawPrint, description: 'Seus companheiros e seus bônus.' },
    { name: 'Armas', icon: Swords, description: 'Espadas, foices e outros equipamentos.' },
    { name: 'Index', icon: Star, description: 'Tiers de avatares e pets.' },
    { name: 'Obeliscos', icon: Pyramid, description: 'Seu progresso nos obeliscos de poder.' },
    { name: 'Rank', icon: ShieldCheck, description: 'Seu rank atual no jogo.' },
];

function UserProfilePage() {
  return (
    <>
      <Head>
        <title>Meu Personagem - Guia Eterno</title>
      </Head>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3"><User /> Meu Personagem</h1>
          <p className="text-muted-foreground">Construa o perfil do seu personagem com seus poderes, armas, pets e progresso atual.</p>
        </header>

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
                    <CardContent className='flex flex-col items-center justify-center text-center p-6 pt-0'>
                        <div className='flex items-center justify-center h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed mb-4'>
                             <Construction className='h-8 w-8 text-muted-foreground'/>
                        </div>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar / Editar
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Em Construção</DialogTitle>
                                    <DialogDescription>
                                        A funcionalidade para adicionar e editar itens do seu perfil estará disponível em breve!
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </>
  );
}


export default function ProfileBuilderPage() {
    // Usaremos a mesma lógica de "em breve" da calculadora antiga por enquanto.
    const { isAdmin, isLoading } = useAdmin();
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    // Por enquanto, vamos deixar a página visível para todos os usuários.
    // A checagem de admin pode ser usada no futuro se necessário.
    return <UserProfilePage />;
}
