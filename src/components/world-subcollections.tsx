'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from './ui/button';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const SUBCOLLECTIONS = ['powers', 'npcs', 'pets', 'dungeons', 'shadows', 'stands', 'accessories'];

export function WorldSubcollections({ worldId }: { worldId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async (subcollectionName: string, itemId: string) => {
        if (!firestore) return;
        const itemRef = doc(firestore, 'worlds', worldId, subcollectionName, itemId);
        try {
            await deleteDoc(itemRef);
            toast({ title: "Item Removido", description: "O item foi removido com sucesso." });
        } catch (error: any) {
            console.error("Erro ao remover item:", error);
            toast({ variant: 'destructive', title: "Erro ao Remover", description: error.message });
        }
    };

    return (
        <div className="pl-4 pt-2 space-y-2">
            {SUBCOLLECTIONS.map(subcollectionName => (
                <SubcollectionItems 
                    key={subcollectionName} 
                    worldId={worldId} 
                    subcollectionName={subcollectionName}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}

interface SubcollectionItemsProps {
    worldId: string;
    subcollectionName: string;
    onDelete: (subcollectionName: string, itemId: string) => void;
}

function SubcollectionItems({ worldId, subcollectionName, onDelete }: SubcollectionItemsProps) {
    const firestore = useFirestore();
    const subcollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'worlds', worldId, subcollectionName) : null, [firestore, worldId, subcollectionName]);
    const { data: items, isLoading } = useCollection(subcollectionRef as any);

    if (isLoading) {
        return (
            <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Carregando {subcollectionName}...
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <Link href={`/wiki/edit/new?collectionPath=worlds/${worldId}/${subcollectionName}`} passHref>
                <Button variant="ghost" className="w-full justify-start text-sm capitalize text-muted-foreground">
                    + Adicionar em {subcollectionName}
                </Button>
            </Link>
        );
    }

    const collectionPath = `worlds/${worldId}/${subcollectionName}`;

    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sm capitalize">
                    - {subcollectionName} ({items.length})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-2 space-y-1">
                {items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between group">
                         <Link href={`/wiki/edit/${item.id}?collectionPath=${collectionPath}`} passHref className='flex-1'>
                            <Button variant="ghost" className="w-full justify-start text-xs h-8">
                                -- {item.name || item.id}
                            </Button>
                        </Link>
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
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
                                  <AlertDialogAction onClick={() => onDelete(subcollectionName, item.id)}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
                 <Link href={`/wiki/edit/new?collectionPath=${collectionPath}`} passHref>
                    <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground">
                        + Adicionar Novo
                    </Button>
                </Link>
            </CollapsibleContent>
        </Collapsible>
    );
}
