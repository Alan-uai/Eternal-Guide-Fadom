'use client';

import { useParams, useRouter, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2, ShieldAlert, ChevronRight, Files, PlusCircle, Pencil, Trash2, Save } from 'lucide-react';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { doc, collection, deleteDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function NewWorldForm() {
    const router = useRouter();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [worldName, setWorldName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateWorld = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worldName.trim() || !firestore) return;

        setIsCreating(true);
        const worldId = worldName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        if (!worldId) {
            toast({ variant: 'destructive', title: 'Nome Inválido', description: 'Por favor, insira um nome de mundo válido.' });
            setIsCreating(false);
            return;
        }

        const worldRef = doc(firestore, 'worlds', worldId);

        try {
            await setDoc(worldRef, { name: worldName });
            toast({ title: 'Mundo Criado!', description: `O mundo "${worldName}" foi criado com sucesso.` });
            router.push(`/admin/edit-collection/worlds/${worldId}`);
        } catch (error: any) {
            console.error("Erro ao criar mundo:", error);
            toast({ variant: 'destructive', title: "Erro ao Criar", description: error.message });
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Criar Novo Mundo</CardTitle>
                    <CardDescription>
                        Este é o primeiro passo. Dê um nome ao seu novo mundo. Após a criação, você será redirecionado para adicionar coleções como poderes, NPCs e mais.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleCreateWorld}>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="world-name">Nome do Mundo</Label>
                            <Input
                                id="world-name"
                                value={worldName}
                                onChange={(e) => setWorldName(e.target.value)}
                                placeholder="ex: Ilha da Sombra"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Criar e Continuar
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const pathSegments = Array.isArray(params.path) ? params.path : [params.path];
  const isNew = pathSegments.at(-1) === 'new';
  
  const queryPath = isNew ? pathSegments.slice(0, -1) : pathSegments;
  const collectionPath = queryPath.join('/');
  
  const isSubCollection = queryPath.length > 2;
  const subCollectionName = isSubCollection ? queryPath[2] : null;

  const isWorldContext = queryPath[0] === 'worlds';
  const worldId = isWorldContext && queryPath.length > 1 ? queryPath[1] : null;
  
  // Special view for creating a new world
  if (isNew && queryPath.length === 1 && queryPath[0] === 'worlds') {
    return <NewWorldForm />;
  }

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
