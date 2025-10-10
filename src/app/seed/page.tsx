'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SeedPage() {
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
