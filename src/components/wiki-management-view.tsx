'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, writeBatch, collection, updateDoc, getDoc } from 'firebase/firestore';
import { Bot, User, Send, Info, Loader2, Eye, Pencil, Database, PlusCircle, Trash2, Check, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { WikiArticle } from '@/lib/types';
import { allWikiArticles } from '@/lib/wiki-data';
import { accessories } from '@/lib/accessory-data';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WorldSubcollections } from '@/components/world-subcollections';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { generateWikiArticleFromData } from '@/ai/flows/generate-wiki-from-data-flow';

// Firestore doesn't have a native "list subcollections" API for clients.
// This is a workaround to get the subcollections by checking the backend.json.
// In a real app, this might be a dedicated metadata doc in Firestore.
import backendConfig from '@/../docs/backend.json';

const getSubcollectionsForWorld = (worldId: string): string[] => {
    if (!backendConfig.firestore || !backendConfig.firestore.structure) {
        return [];
    }
    const worldPathPrefix = `/worlds/${worldId}/`;
    const subcollections = new Set<string>();

    for (const item of backendConfig.firestore.structure) {
        if (item.path.startsWith(worldPathPrefix)) {
            const pathParts = item.path.substring(worldPathPrefix.length).split('/');
            if (pathParts[0]) {
                subcollections.add(pathParts[0]);
            }
        }
    }
    return Array.from(subcollections);
};


export function WikiManagementView() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [viewingContent, setViewingContent] = useState<{ title: string; data: any, id?: string, editPath?: string } | null>(null);
  const [editingWorld, setEditingWorld] = useState<{ id: string, name: string } | null>(null);
  const [newWorldName, setNewWorldName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);


  const worldsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'worlds') : null, [firestore]);
  const { data: worlds, isLoading: areWorldsLoading } = useCollection(worldsCollectionRef as any);

  const articlesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'wikiContent') : null, [firestore]);
  const { data: articles, isLoading: areArticlesLoading } = useCollection<WikiArticle>(articlesCollectionRef as any);

  const combinedArticles = useMemo(() => {
    const firestoreIds = new Set(articles?.map(a => a.id));
    const staticArticlesToAdd = allWikiArticles.filter(sa => !firestoreIds.has(sa.id));
    return [...(articles || []), ...staticArticlesToAdd];
  }, [articles]);

  const sortedWorlds = useMemo(() => {
    if (!worlds) return [];
    return [...worlds].sort((a, b) => {
      const numA = parseInt(a.id.split('-').pop() || '0', 10);
      const numB = parseInt(b.id.split('-').pop() || '0', 10);
      return numA - numB;
    });
  }, [worlds]);

  const handleViewContent = (title: string, data: any, id?: string, editPath?: string) => {
    setViewingContent({ title, data, id, editPath });
  };

  const handleOpenEditDialog = (world: { id: string, name: string }) => {
    setEditingWorld(world);
    setNewWorldName(world.name);
  };
  
  const handleCloseEditDialog = () => {
    setEditingWorld(null);
    setNewWorldName('');
  };
  
  const handleUpdateWorldName = async () => {
    if (!editingWorld || !newWorldName.trim() || !firestore) return;
  
    setIsUpdatingName(true);
    const worldRef = doc(firestore, 'worlds', editingWorld.id);
  
    try {
      await updateDoc(worldRef, { name: newWorldName });
      toast({
        title: 'Sucesso!',
        description: `O nome do mundo foi atualizado para "${newWorldName}".`
      });
      handleCloseEditDialog();
    } catch (error) {
      console.error('Erro ao atualizar o nome do mundo:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o nome do mundo.'
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleGenerateArticle = async (worldName: string, worldData: any) => {
    setIsGeneratingArticle(true);
    toast({ title: 'Gerando Artigo...', description: 'A IA está escrevendo o artigo da Wiki. Isso pode levar um momento.' });
    try {
        if (!firestore) throw new Error("Firestore não está disponível.");
        // Fetch the most up-to-date name from Firestore before generating
        const worldRef = doc(firestore, 'worlds', worldData.id);
        const worldSnap = await getDoc(worldRef);
        const currentWorldName = worldSnap.exists() ? worldSnap.data().name : worldName;

        const result = await generateWikiArticleFromData({
            worldName: currentWorldName,
            worldDataJson: JSON.stringify(worldData)
        });

        if (result && result.wikiArticleJson) {
            // Armazene o artigo gerado para ser pego pela página de edição
            sessionStorage.setItem('generated-wiki-article', result.wikiArticleJson);
            router.push('/wiki/edit/new?from-generation=true');
        } else {
            throw new Error('A IA não retornou um artigo válido.');
        }

    } catch (error: any) {
        console.error('Erro ao gerar artigo da wiki:', error);
        toast({ variant: 'destructive', title: 'Erro ao Gerar Artigo', description: error.message });
    } finally {
        setIsGeneratingArticle(false);
        setViewingContent(null);
    }
  };

  return (
    <>
        <header className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Gerenciar Conteúdo</h1>
            <p className="text-muted-foreground">Popule o banco de dados e gerencie os artigos da Wiki e os dados do jogo.</p>
        </header>

      <div className="p-1 md:p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle Geral de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                 Utilize os botões de guia para entender como gerenciar os dados do jogo e os artigos da wiki.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon"><HelpCircle className="h-5 w-5"/></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                        <DialogTitle>Guia de Gerenciamento de Mundos</DialogTitle>
                        <DialogDescription>
                            Entenda como os dados dos mundos alimentam a IA.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground space-y-4">
                            <p>A seção **"Dados de Jogo por Mundo"** é a fonte da verdade para a IA quando se trata de estatísticas precisas. O Firestore é a única fonte da verdade.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-foreground">O que são os dados?</strong> São os documentos e subcoleções (powers, npcs, pets) no Firestore. A IA usa a ferramenta `getGameData` para buscar esses dados brutos e fazer cálculos exatos.</li>
                                <li><strong className="text-foreground">Renomear Mundo (Ícone de <Database className="inline h-4 w-4"/>):</strong> Esta ação permite que você altere o nome de exibição de um mundo diretamente no Firestore.</li>
                                <li><strong className="text-foreground">Editar Itens:</strong> Você pode expandir cada mundo para ver suas subcoleções e editar cada item individualmente. Todas as alterações são salvas automaticamente no Firestore.</li>
                                <li><strong className="text-foreground">Smart Seeding:</strong> Ao criar um "Novo Mundo", você pode enviar um arquivo. A IA processará esse arquivo para popular o novo mundo automaticamente, poupando o trabalho manual.</li>
                            </ul>
                            <p>Manter esses dados estruturados e corretos é crucial para a IA fornecer respostas numéricas precisas.</p>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" size="icon"><HelpCircle className="h-5 w-5"/></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                        <DialogTitle>Guia de Gerenciamento da Wiki</DialogTitle>
                        <DialogDescription>
                            Entenda como os artigos da Wiki e os dados do jogo trabalham juntos.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground space-y-4">
                             <p>As seções **"Artigos da Wiki"** e **"Dados de Jogo por Mundo"** são separadas, mas complementares.</p>
                             <h4 className="font-semibold text-foreground">Fluxo de Trabalho Recomendado:</h4>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong className="text-foreground">Crie ou Edite um Mundo:</strong> Primeiro, certifique-se de que os dados estruturados de um mundo (ex: Mundo 23) existem no Firestore, seja criando via "Novo Mundo" ou editando um existente.</li>
                                <li><strong className="text-foreground">Gere o Artigo (Ícone de <Sparkles className="inline h-4 w-4"/>):</strong> Visualize os dados do mundo recém-criado e clique no botão "Gerar Artigo da Wiki". A IA lerá todos os dados (poderes, npcs, etc.) e criará um artigo completo para você.</li>
                                <li><strong className="text-foreground">Revise e Salve:</strong> Você será redirecionado para o editor da Wiki com o artigo gerado pela IA já preenchido. Revise, adicione qualquer contexto extra e salve.</li>
                            </ol>
                            <p>Este fluxo garante que sua Wiki seja um reflexo textual preciso dos dados do jogo, permitindo que a IA compreenda tanto o contexto (`wikiContent`) quanto os detalhes numéricos (`worlds` data).</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>
          </Card>

          <Separator />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Artigos da Wiki</CardTitle>
              <Link href="/wiki/edit/new" passHref>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Artigo
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areArticlesLoading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Carregando artigos...</span>
                  </div>
              ) : (
                combinedArticles?.map((article) => (
                  <div key={article.id} className="flex w-full">
                    <Link href={`/wiki/edit/${article.id}`} passHref className='w-full'>
                      <Button variant="outline" className="w-full justify-start">
                        {article.title}
                      </Button>
                    </Link>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleViewContent(article.title, article, article.id, `/wiki/edit/${article.id}`)}>
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar dados</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Separator />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dados Gerais</CardTitle>
              <Button variant="outline" size="sm" onClick={() => toast({title: "Em breve!", description: "A criação de novos dados gerais estará disponível em breve."})}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
             <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="flex gap-2">
                  <Button disabled={true} className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    Acessórios
                  </Button>
                   <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleViewContent("Acessórios", accessories)}>
                                <Eye className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                         <TooltipContent>
                          <p>Visualizar dados estáticos</p>
                        </TooltipContent>
                      </Tooltip>
                   </TooltipProvider>
                </div>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dados de Jogo por Mundo</CardTitle>
              <Link href="/admin/edit-collection/worlds/new" passHref>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Mundo
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areWorldsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Carregando mundos...</span>
                </div>
              ) : (
                sortedWorlds?.map(world => {
                  const fetchedSubcollections = getSubcollectionsForWorld(world.id);
                  return (
                    <Collapsible key={world.id} className="space-y-2">
                      <div className="flex w-full">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <Button variant="outline" size="icon" className="rounded-r-none pl-3 pr-2 border-r-0" onClick={() => handleOpenEditDialog(world)}>
                                <Database className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Renomear {world.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-start rounded-l-none pl-2 border-l-0">
                                {world.name}
                            </Button>
                        </CollapsibleTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleViewContent(world.name, world, world.id)}>
                                  <Eye className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visualizar dados do Firestore</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <CollapsibleContent>
                        <WorldSubcollections worldId={world.id} fetchedSubcollections={fetchedSubcollections} />
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })
              )}
            </CardContent>
          </Card>
      </div>
      <Dialog open={!!viewingContent} onOpenChange={(isOpen) => !isOpen && setViewingContent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
                <div>
                    <DialogTitle>{viewingContent?.title}</DialogTitle>
                    <DialogDescription>
                    Visualizando os dados JSON.
                    </DialogDescription>
                </div>
                 {viewingContent?.id && (
                    <div className="flex items-center gap-2">
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleGenerateArticle(viewingContent.title, viewingContent.data)} disabled={isGeneratingArticle}>
                                        {isGeneratingArticle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Gerar Artigo da Wiki com IA</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
          </DialogHeader>
          <ScrollArea className="h-[70vh] mt-4">
            <pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap">
              {JSON.stringify(viewingContent?.data, null, 2)}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingWorld} onOpenChange={(isOpen) => !isOpen && handleCloseEditDialog()}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Editar Nome do Mundo</DialogTitle>
            <DialogDescription>
                Altere o nome de "{editingWorld?.name}" e clique em salvar.
            </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="world-name" className="sr-only">
                    Nome
                    </Label>
                    <Input
                    id="world-name"
                    value={newWorldName}
                    onChange={(e) => setNewWorldName(e.target.value)}
                    />
                </div>
                <Button type="submit" size="icon" className="px-3" disabled={isUpdatingName} onClick={handleUpdateWorldName}>
                    {isUpdatingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Check className="h-4 w-4" />
                    )}
                    <span className="sr-only">Salvar</span>
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    </>
  );
}
