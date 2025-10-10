'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2, ShieldAlert, Construction } from 'lucide-react';

export default function EditCollectionPage() {
  const params = useParams();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  // Reconstruct the path from the slug array
  const collectionPath = Array.isArray(params.path) ? params.path.join('/') : params.path;

  if (isAdminLoading) {
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
        <p className="text-muted-foreground mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editando Coleção</CardTitle>
          <CardDescription>
            Interface para editar documentos na coleção: <code className="bg-muted px-1 py-0.5 rounded text-sm font-semibold">{collectionPath}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <Construction className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-semibold">Em Construção</h2>
                <p className="mt-2">O editor para esta coleção de dados estará disponível em breve.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
