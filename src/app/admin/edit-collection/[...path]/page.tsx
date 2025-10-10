'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2, ShieldAlert, Construction, ChevronRight, Files } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';

// Define the potential sub-collections a world might have
const worldSubCollections = [
  'accessories',
  'dungeons',
  'npcs',
  'pets',
  'powers',
  'shadows',
  'stands',
];

export default function EditCollectionPage() {
  const params = useParams();
  const firestore = useFirestore();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const pathSegments = Array.isArray(params.path) ? params.path : [params.path];
  const collectionPath = pathSegments.join('/');

  // Check if we are at a world's root (e.g., /worlds/world-1)
  const isWorldRoot = pathSegments.length === 2 && pathSegments[0] === 'worlds';
  const worldId = isWorldRoot ? pathSegments[1] : null;

  const worldRef = useMemoFirebase(() => {
    if (!firestore || !worldId) return null;
    return doc(firestore, 'worlds', worldId);
  }, [firestore, worldId]);

  const { data: worldData, isLoading: isWorldLoading } = useDoc(worldRef);

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

  // If we are at a world's root, show sub-collection navigation
  if (isWorldRoot) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Editando Mundo: {isWorldLoading ? <Loader2 className="inline h-6 w-6 animate-spin"/> : worldData?.name || worldId}</CardTitle>
            <CardDescription>
              Selecione uma categoria de dados para editar dentro deste mundo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worldSubCollections.map(subCollection => (
              <Link key={subCollection} href={`/admin/edit-collection/${collectionPath}/${subCollection}`} passHref>
                <Button variant="outline" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                        <Files className="h-5 w-5 text-primary" />
                        <span className="capitalize">{subCollection}</span>
                    </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Placeholder for deeper paths (e.g., /worlds/world-1/powers)
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
                <p className="mt-2">O editor para a coleção <span className='font-bold'>{pathSegments[pathSegments.length -1]}</span> estará disponível em breve.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
