'use client';

import { Loader2, ShieldAlert } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function SeedPage() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShieldAlert className="h-16 w-16 mb-4 text-destructive" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground mt-2">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <ShieldAlert className="h-16 w-16 mb-4 text-amber-500" />
        <h1 className="text-2xl font-bold">Página Movida</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
            Esta funcionalidade foi movida e integrada ao novo painel de administrador para um gerenciamento centralizado.
        </p>
        <Link href="/admin-chat">
            <Button className="mt-4">Ir para o Painel do Admin</Button>
        </Link>
    </div>
  );
}
