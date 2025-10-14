
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { useApp } from '@/context/app-provider';
import { LogIn, LogOut, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const { setAuthDialogOpen } = useApp();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* O avatar agora é um Link para o perfil, mas também abre o dropdown */}
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
             <Link href="/profile" passHref>
                <AvatarImage
                    src={user?.photoURL ?? undefined}
                    alt={user?.displayName ?? 'Avatar do usuário'}
                />
             </Link>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user && !user.isAnonymous ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.displayName ?? 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* O item de menu "Sair" apenas executa a ação de logout */}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => setAuthDialogOpen(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Entrar / Criar Conta</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
