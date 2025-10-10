'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2, ShieldAlert, ChevronRight, Files, PlusCircle, Pencil, Eye, Trash2 } from 'lucide-react';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import EditArticlePage from '@/app/wiki/edit/[articleId]/page';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const pathSegments = Array.isArray(params.path) ? params.path : [params.path];
  const isNew = pathSegments.at(-1) === 'new';
  const collectionPath = pathSegments.join('/');
  
  // Is this a sub-collection view like /worlds/world-1/powers?
  const isSubCollection = pathSegments.length > 2;
  const subCollectionName = isSubCollection ? pathSegments[2] : null;

  // Check if we are editing a world (e.g., /worlds/world-1)
  const isWorldContext = pathSegments[0] === 'worlds';
  const worldId = isWorldContext && !isNew ? pathSegments[1] : null;

  const worldRef = useMemoFirebase(() => {
    if (!firestore || !worldId) return null;
    return doc(firestore, 'worlds', worldId);
  }, [firestore, worldId]);

  const subCollectionRef = useMemoFirebase(() => {
    if (!firestore || !worldId || !subCollectionName) return null;
    return collection(firestore, 'worlds', worldId, subCollectionName);
  }, [firestore, worldId, subCollectionName]);

  const { data: worldData, isLoading: isWorldLoading } = useDoc(worldRef);
  const { data: subCollectionData, isLoading: isSubCollectionLoading } = useCollection(subCollectionRef as any);

  const handleDelete = async (itemId: string) => {
    if (!subCollectionRef) return;
    try {
      await deleteDoc(doc(subCollectionRef, itemId));
      toast({ title: "Item Removido", description: "O item foi removido com sucesso da coleção." });
    } catch (error: any) {
      console.error("Erro ao remover item:", error);
      toast({ variant: 'destructive', title: "Erro ao Remover", description: error.message });
    }
  };

  const isLoading = isAdminLoading || isWorldLoading || isSubCollectionLoading;

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
        <p className="text-muted-foreground mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  // If we are at a specific world's root, show sub-collection navigation
  if (worldId && !isSubCollection) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Editando Mundo: {worldData?.name || worldId}</CardTitle>
            <CardDescription>
              Selecione uma categoria de dados para editar ou adicione uma nova.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worldSubCollections.map(subCollection => (
              <Link key={subCollection} href={`/admin/edit-collection/worlds/${worldId}/${subCollection}`} passHref>
                <Button variant="outline" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                        <Files className="h-5 w-5 text-primary" />
                        <span className="capitalize">{subCollection}</span>
                    </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            ))}
             <Button variant="outline" className="w-full justify-between h-12 border-dashed" onClick={() => toast({title: "Em breve!", description: "A criação de novas sub-coleções estará disponível em breve."})}>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <PlusCircle className="h-5 w-5" />
                    <span>Nova Categoria</span>
                </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isNew && pathSegments.length <= 2) {
     return <EditArticlePage />;
  }
  
  // If we are in a sub-collection view, list the items
  if (isSubCollection && subCollectionName) {
    const newPath = `/wiki/edit/new?collectionPath=${collectionPath}`;
    return (
       <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className='flex-row items-center justify-between'>
              <div>
                <CardTitle>Editando: <span className="capitalize font-bold text-primary">{subCollectionName}</span></CardTitle>
                <CardDescription>Mundo: {worldData?.name || worldId}</CardDescription>
              </div>
              <Link href={newPath} passHref>
                 <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Adicionar Novo
                 </Button>
              </Link>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                {subCollectionData && subCollectionData.length > 0 ? (
                  subCollectionData.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md border bg-card-foreground/5">
                      <span className="font-medium">{item.name || item.id}</span>
                      <div className="flex items-center gap-2">
                         <Link href={`/wiki/edit/${item.id}?collectionPath=${collectionPath}`} passHref>
                            <Button variant="ghost" size="icon">
                               <Pencil className="h-4 w-4"/>
                            </Button>
                         </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o item
                                <span className='font-bold text-foreground'> {item.name || item.id} </span>
                                do banco de dados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum item encontrado nesta coleção.</p>
                )}
               </div>
            </CardContent>
          </Card>
       </div>
    )
  }

  // Fallback for any other path
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <ShieldAlert className="h-16 w-16 mb-4 text-destructive" />
        <h1 className="text-2xl font-bold">Caminho Inválido</h1>
        <p className="text-muted-foreground mt-2">O caminho <code className="bg-muted px-1 py-0.5 rounded text-sm font-semibold">{collectionPath}</code> não é uma rota de edição válida.</p>
    </div>
  );
}
