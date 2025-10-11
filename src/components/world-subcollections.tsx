'use client';

import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from './ui/button';
import { Loader2, PlusCircle, Trash2, ChevronRight, Check } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';
import backendSchema from '@/../docs/backend.json';
import { ScrollArea } from './ui/scroll-area';

const DEFAULT_SUBCOLLECTIONS = ['powers', 'npcs', 'pets', 'dungeons', 'shadows', 'stands', 'accessories'];

function getEntitySchemaForSubcollection(subcollectionName: string) {
    if (!backendSchema.firestore || !backendSchema.firestore.structure) return null;

    const singularName = subcollectionName.endsWith('s') ? subcollectionName.slice(0, -1) : subcollectionName;
    
    // Find the definition in the firestore structure
    const structureDef = backendSchema.firestore.structure.find(s => {
        const pathEnd = s.path.split('/').slice(-2)[0];
        // e.g. /worlds/{worldId}/powers/{powerId} -> 'powers'
        return pathEnd === subcollectionName;
    });

    const entityName = structureDef?.definition.entityName;

    if (!entityName || !(entityName in backendSchema.entities)) {
        return null;
    }

    return (backendSchema.entities as Record<string, any>)[entityName];
}

function InlineItemEditor({ item, itemRef, subcollectionName }: { item: any, itemRef: any, subcollectionName: string }) {
    const { toast } = useToast();
    const [localData, setLocalData] = useState(item);
    const [isAddingField, setIsAddingField] = useState(false);
    const [newFieldKey, setNewFieldKey] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [fieldToAdd, setFieldToAdd] = useState<string | null>(null);

    const entitySchema = useMemo(() => getEntitySchemaForSubcollection(subcollectionName), [subcollectionName]);
    
    const suggestedFields = useMemo(() => {
        if (!entitySchema || !entitySchema.properties) return [];
        const existingKeys = Object.keys(localData);
        return Object.keys(entitySchema.properties).filter(propKey => !existingKeys.includes(propKey));
    }, [entitySchema, localData]);

    const handleFieldChange = (key: string, value: any) => {
        if (key.includes('.')) {
            const keys = key.split('.');
            setLocalData((prev: any) => {
                const newData = { ...prev };
                let current = newData;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
                return newData;
            });
        } else {
            setLocalData({ ...localData, [key]: value });
        }
    };

    const handleSaveField = async (key: string) => {
        let valueToSave;
        if (key.includes('.')) {
            const keys = key.split('.');
            let current = localData;
            for (const k of keys) {
                current = current[k];
            }
            valueToSave = current;
        } else {
            valueToSave = localData[key];
        }
       
        try {
            await updateDoc(itemRef, { [key]: valueToSave });
            toast({
                title: 'Campo Atualizado!',
                description: `O campo "${key}" foi salvo com sucesso.`,
            });
        } catch (error: any) {
            console.error("Erro ao atualizar campo:", error);
            toast({ variant: 'destructive', title: "Erro ao Salvar", description: error.message });
            setLocalData(item);
        }
    };
    
    const handleAddNewField = async () => {
        const keyToAdd = fieldToAdd || newFieldKey;
        if (!keyToAdd.trim()) {
            toast({ variant: 'destructive', title: 'Erro', description: 'O nome do campo não pode ser vazio.' });
            return;
        }
        try {
            await updateDoc(itemRef, { [keyToAdd]: newFieldValue });
            toast({ title: 'Campo Adicionado!', description: `O campo "${keyToAdd}" foi adicionado.` });
            setLocalData({ ...localData, [keyToAdd]: newFieldValue });
            setNewFieldKey('');
            setNewFieldValue('');
            setIsAddingField(false);
            setFieldToAdd(null);
        } catch (error: any) {
             console.error("Erro ao adicionar campo:", error);
            toast({ variant: 'destructive', title: "Erro ao Adicionar", description: error.message });
        }
    };

    const handleOpenAddFieldDialog = (fieldName: string | null = null) => {
        setFieldToAdd(fieldName);
        setNewFieldKey(fieldName || '');
        setIsAddingField(true);
    };

    const renderField = (key: string, value: any, prefix = '') => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
             return (
                <div key={fullKey} className="space-y-2 p-2 border rounded-md bg-background/50">
                    <Label className="font-semibold capitalize text-primary">{key}</Label>
                    <div className="pl-4 space-y-2">
                        {Object.entries(value).map(([subKey, subValue]) => renderField(subKey, subValue, fullKey))}
                    </div>
                </div>
             )
        }
        
        if (typeof value === 'object' && value !== null && Array.isArray(value)) {
            const jsonString = JSON.stringify(value, null, 2);
             return (
                <div key={fullKey} className="space-y-2">
                    <Label htmlFor={fullKey} className="capitalize">{key}</Label>
                    <Textarea
                        id={fullKey}
                        value={jsonString}
                        className="font-mono text-xs min-h-[100px]"
                        onChange={(e) => {
                             try {
                                const parsed = JSON.parse(e.target.value);
                                handleFieldChange(fullKey, parsed);
                            } catch (err) {
                               // Silently ignore invalid JSON during typing
                            }
                        }}
                        onBlur={() => handleSaveField(fullKey)}
                    />
                </div>
            )
        }

        const isLongText = typeof value === 'string' && value.length > 70;

        return (
            <div key={fullKey} className="space-y-2">
                <Label htmlFor={fullKey} className="capitalize">{key}</Label>
                 {isLongText ? (
                    <Textarea
                        id={fullKey}
                        value={value}
                        onChange={(e) => handleFieldChange(fullKey, e.target.value)}
                        onBlur={() => handleSaveField(fullKey)}
                    />
                ) : (
                    <Input
                        id={fullKey}
                        type={typeof value === 'number' ? 'number' : 'text'}
                        value={value}
                        onChange={(e) => handleFieldChange(fullKey, e.target.value)}
                        onBlur={() => handleSaveField(fullKey)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="p-3 bg-muted/50 rounded-md border space-y-4">
             {Object.entries(localData).filter(([key]) => key !== 'id').map(([key, value]) => renderField(key, value))}
            <Button variant="ghost" className="w-full justify-center text-xs text-muted-foreground" onClick={() => handleOpenAddFieldDialog()}>
                <PlusCircle className="mr-2 h-4 w-4"/> Adicionar Campo
            </Button>
            <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Campo</DialogTitle>
                         <DialogDescription>
                            {suggestedFields.length > 0 ? "Escolha uma sugestão ou adicione um campo personalizado." : "Insira o nome e o valor para o novo campo."}
                        </DialogDescription>
                    </DialogHeader>

                     {suggestedFields.length > 0 && (
                        <div className='py-2'>
                            <Label className="text-sm font-medium">Sugestões de Campos</Label>
                            <ScrollArea className="h-24 mt-2">
                                <div className="space-y-2 pr-4">
                                {suggestedFields.map(field => (
                                    <Button key={field} variant="outline" size="sm" className="w-full justify-start" onClick={() => handleOpenAddFieldDialog(field)}>
                                        + {field}
                                    </Button>
                                ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="new-field-key">Nome do Campo (Chave)</Label>
                            <Input 
                                id="new-field-key" 
                                placeholder="ex: chance, cooldown" 
                                value={newFieldKey}
                                onChange={(e) => setNewFieldKey(e.target.value)}
                                disabled={!!fieldToAdd}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-field-value">Valor do Campo</Label>
                            <Input 
                                id="new-field-value" 
                                placeholder="ex: 10, 2.5s, true" 
                                value={newFieldValue}
                                onChange={(e) => setNewFieldValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsAddingField(false); setFieldToAdd(null); }}>Cancelar</Button>
                        <Button onClick={handleAddNewField}>Salvar Campo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function WorldSubcollections({ worldId, fetchedSubcollections }: { worldId: string, fetchedSubcollections: string[] }) {
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

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
    
    const handleCreateCategory = () => {
      if (!newCategoryName.trim()) {
        toast({ variant: 'destructive', title: 'Nome Inválido', description: 'O nome da categoria não pode estar vazio.' });
        return;
      }
      setIsCreatingCategory(true);
      const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newPath = `/wiki/edit/new?collectionPath=worlds/${worldId}/${slug}`;
      router.push(newPath);
      setIsAddCategoryOpen(false);
      setNewCategoryName('');
      setIsCreatingCategory(false);
    }

    const allSubcollections = Array.from(new Set([...DEFAULT_SUBCOLLECTIONS, ...fetchedSubcollections]));

    return (
        <div className="pl-4 pt-2 space-y-2">
            {allSubcollections.map(subcollectionName => (
                <SubcollectionItems 
                    key={subcollectionName} 
                    worldId={worldId} 
                    subcollectionName={subcollectionName}
                    onDelete={handleDelete}
                />
            ))}
             <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <Button variant="ghost" className="w-full justify-start text-sm capitalize text-muted-foreground" onClick={() => setIsAddCategoryOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Nova Categoria
                </Button>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Criar Nova Categoria</DialogTitle>
                    <DialogDescription>
                        Dê um nome para a nova categoria de dados dentro deste mundo (ex: "missões", "itens").
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="category-name" className="sr-only">
                                Nome da Categoria
                            </Label>
                            <Input
                                id="category-name"
                                placeholder="ex: missoes"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancelar</Button>
                        <Button type="submit" onClick={handleCreateCategory} disabled={isCreatingCategory}>
                          {isCreatingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Criar e Adicionar Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
        const newPath = `/wiki/edit/new?collectionPath=worlds/${worldId}/${subcollectionName}`;
        return (
            <Link href={newPath} passHref>
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
                <Button variant="ghost" className="w-full justify-between text-sm capitalize">
                   <span>{subcollectionName} ({items.length})</span>
                   <ChevronRight className="h-4 w-4 transform transition-transform duration-200 group-data-[state=open]:rotate-90"/>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-2 space-y-2">
                {items.map((item: any) => {
                    const itemRef = doc(firestore, 'worlds', worldId, subcollectionName, item.id);
                    return (
                        <Collapsible key={item.id}>
                             <div className="flex items-center justify-between group">
                                <CollapsibleTrigger asChild>
                                   <Button variant="ghost" className="w-full justify-start text-xs h-8">
                                       <ChevronRight className="mr-2 h-3 w-3 transform transition-transform duration-200 group-data-[state=open]:rotate-90"/>
                                       {item.name || item.id}
                                   </Button>
                                </CollapsibleTrigger>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100">
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
                             <CollapsibleContent className="pl-6 pr-2 py-2">
                                <InlineItemEditor item={item} itemRef={itemRef} subcollectionName={subcollectionName} />
                            </CollapsibleContent>
                        </Collapsible>
                    )
                })}
                 <Link href={`/wiki/edit/new?collectionPath=${collectionPath}`} passHref>
                    <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground">
                        <PlusCircle className="mr-2 h-4 w-4"/> Adicionar Novo
                    </Button>
                </Link>
            </CollapsibleContent>
        </Collapsible>
    );
}
