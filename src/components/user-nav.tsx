
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useApp } from '@/context/app-provider';
import { LogIn, User } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function UserNav() {
  const { user } = useUser();
  const { setAuthDialogOpen } = useApp();

  if (user && !user.isAnonymous) {
     return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/profile" passHref>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full md:h-8 md:w-8">
                            <Avatar className="h-9 w-9 md:h-8 md:w-8">
                                <AvatarImage
                                    src={user?.photoURL ?? undefined}
                                    alt={user?.displayName ?? 'Avatar do usuário'}
                                />
                                <AvatarFallback>
                                <User />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Perfil</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
  }

  // Se for anônimo ou não estiver logado, mostra um botão de login
  return (
     <Button variant="outline" onClick={() => setAuthDialogOpen(true)}>
        <LogIn className="mr-2 h-4 w-4" />
        Entrar
    </Button>
  );
}
