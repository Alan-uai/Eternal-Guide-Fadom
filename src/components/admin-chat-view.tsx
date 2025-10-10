'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { Bot, User, Send, Info, Loader2, Eye, Pencil, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { WikiArticle } from '@/lib/types';
import { allWikiArticles } from '@/lib/wiki-data';
import { accessories, worldNameToId } from '@/lib/accessory-data';
import { world1Data } from '@/lib/world-1-data';
import { world2Data } from '@/lib/world-2-data';
import { world3Data } from '@/lib/world-3-data';
import { world4Data } from '@/lib/world-4-data';
import { world5Data } from '@/lib/world-5-data';
import { world6Data } from '@/lib/world-6-data';
import { world7Data } from '@/lib/world-7-data';
import { world8Data } from '@/lib/world-8-data';
import { world9Data } from '@/lib/world-9-data';
import { world10Data } from '@/lib/world-10-data';
import { world11Data } from '@/lib/world-11-data';
import { world12Data } from '@/lib/world-12-data';
import { world13Data } from '@/lib/world-13-data';
import { world14Data } from '@/lib/world-14-data';
import { world15Data } from '@/lib/world-15-data';
import { world16Data } from '@/lib/world-16-data';
import { world17Data } from '@/lib/world-17-data';
import { world18Data } from '@/lib/world-18-data';
import { world19Data } from '@/lib/world-19-data';
import { world20Data } from '@/lib/world-20-data';
import { world21Data } from '@/lib/world-21-data';
import { world22Data } from '@/lib/world-22-data';
import Link from 'next/link';


function WikiManagementTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [viewingContent, setViewingContent] = useState<{ title: string; data: any } | null>(null);

  const handleLoading = (key: string, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const handleViewContent = (title: string, data: any) => {
    setViewingContent({ title, data });
  };

  async function seedWorldGeneric(worldId: string, worldData: any, loadingKey: string) {
    handleLoading(loadingKey, true);
    
    if (!firestore) {
        toast({ title: 'Erro', description: 'O Firestore não foi inicializado.', variant: 'destructive' });
        handleLoading(loadingKey, false);
        return;
    }

    const batch = writeBatch(firestore);
    const worldRef = doc(firestore, 'worlds', worldId);
    batch.set(worldRef, { name: worldData.name });

    const allDataForBatch: Record<string, any> = { [worldRef.path]: { name: worldData.name } };

    const seedSubcollection = (subcollectionName: string, items: any[]) => {
      if (items && items.length > 0) {
        for (const item of items) {
            if (!item.id) continue;
            const itemRef = doc(worldRef, subcollectionName, item.id);
            const { stats, ...itemData } = item;
            batch.set(itemRef, itemData);
            allDataForBatch[itemRef.path] = itemData;

            if (stats && stats.length > 0) {
                for (const stat of stats) {
                    const statId = (stat.id || stat.name || JSON.stringify(stat)).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    if (!statId) continue;
                    const statRef = doc(itemRef, 'stats', statId);
                    batch.set(statRef, stat);
                    allDataForBatch[statRef.path] = stat;
                }
            }
        }
      }
    };

    seedSubcollection('powers', worldData.powers);
    seedSubcollection('npcs', worldData.npcs);
    seedSubcollection('pets', worldData.pets);
    seedSubcollection('dungeons', worldData.dungeons);
    seedSubcollection('shadows', worldData.shadows);
    seedSubcollection('stands', worldData.stands);
    
    await batch.commit().then(() => {
        toast({ title: 'Sucesso!', description: `Os dados do ${worldData.name} foram populados.` });
    }).catch(() => {
        const permissionError = new FirestorePermissionError({
            path: `worlds/${worldId} e subcoleções`, operation: 'write', requestResourceData: allDataForBatch,
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        handleLoading(loadingKey, false);
    });
  }

  async function seedArticle(article: WikiArticle, loadingKey: string, articleName: string) {
    handleLoading(loadingKey, true);
    if (!firestore) {
        toast({ title: 'Erro', description: 'O Firestore não foi inicializado.', variant: 'destructive' });
        handleLoading(loadingKey, false);
        return;
    }
    const batch = writeBatch(firestore);
    const articleRef = doc(firestore, 'wikiContent', article.id);
    batch.set(articleRef, article);
    
    await batch.commit().then(() => {
        toast({ title: 'Sucesso!', description: `O artigo "${articleName}" foi populado.` });
    }).catch(() => {
        const permissionError = new FirestorePermissionError({
            path: `wikiContent/${article.id}`, operation: 'write', requestResourceData: { [articleRef.path]: article },
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        handleLoading(loadingKey, false);
    });
  }

  async function handleSeedAccessories() {
    handleLoading('accessories', true);
    if (!firestore) {
      toast({ title: 'Erro', description: 'O Firestore não foi inicializado.', variant: 'destructive' });
      handleLoading('accessories', false);
      return;
    }

    const batch = writeBatch(firestore);
    const allDataForBatch: Record<string, any> = {};

    for (const acc of accessories) {
      const worldId = worldNameToId[acc.world];
      if (worldId) {
        const accessoryRef = doc(firestore, 'worlds', worldId, 'accessories', acc.id);
        batch.set(accessoryRef, acc);
        allDataForBatch[accessoryRef.path] = acc;
      }
    }

    await batch.commit().then(() => {
      toast({ title: 'Sucesso!', description: 'Os dados dos acessórios foram populados.' });
    }).catch(() => {
      const permissionError = new FirestorePermissionError({
        path: 'batch de acessórios', operation: 'write', requestResourceData: allDataForBatch,
      });
      errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
      handleLoading('accessories', false);
    });
  }

  const worldNumbers = Array.from({ length: 22 }, (_, i) => i + 1);
  const worldSeedData: { [key: number]: any } = {
    1: { data: world1Data, key: 'world1' }, 2: { data: world2Data, key: 'world2' },
    3: { data: world3Data, key: 'world3' }, 4: { data: world4Data, key: 'world4' },
    5: { data: world5Data, key: 'world5' }, 6: { data: world6Data, key: 'world6' },
    7: { data: world7Data, key: 'world7' }, 8: { data: world8Data, key: 'world8' },
    9: { data: world9Data, key: 'world9' }, 10: { data: world10Data, key: 'world10' },
    11: { data: world11Data, key: 'world11' }, 12: { data: world12Data, key: 'world12' },
    13: { data: world13Data, key: 'world13' }, 14: { data: world14Data, key: 'world14' },
    15: { data: world15Data, key: 'world15' }, 16: { data: world16Data, key: 'world16' },
    17: { data: world17Data, key: 'world17' }, 18: { data: world18Data, key: 'world18' },
    19: { data: world19Data, key: 'world19' }, 20: { data: world20Data, key: 'world20' },
    21: { data: world21Data, key: 'world21' }, 22: { data: world22Data, key: 'world22' },
  };

  const articleSeedData = allWikiArticles.map(article => ({
      article: article,
      key: article.id,
      name: article.title
  }));
  

  async function handleSeedAll() {
    handleLoading('all', true);
    toast({ title: 'Iniciando...', description: 'Populando todos os dados do jogo. Isso pode levar um momento.' });
    
    for (const { article, key, name } of articleSeedData) {
      await seedArticle(article, key, name);
    }
    
    await handleSeedAccessories();

    for (const worldNum in worldSeedData) {
      const seedInfo = worldSeedData[worldNum];
      if (seedInfo) {
        await seedWorldGeneric(`world-${worldNum}`, seedInfo.data, seedInfo.key);
      }
    }

    toast({ title: 'Concluído!', description: 'Todos os dados foram populados com sucesso.' });
    handleLoading('all', false);
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-1 md:p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle Geral de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Use este botão para popular (ou repopular) todos os artigos da wiki e dados de todos os mundos disponíveis de uma só vez, sincronizando o Firestore com os arquivos base do projeto.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSeedAll} disabled={loadingStates.all || !firestore}>
                {loadingStates.all && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loadingStates.all ? 'Populando Tudo...' : 'Popular Todos os Dados'}
              </Button>
            </CardFooter>
          </Card>

          <Separator />

          <Card>
            <CardHeader><CardTitle>Artigos da Wiki</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articleSeedData.map(({ article, key, name }) => (
                <div key={key} className="flex gap-2">
                   <Link href={`/wiki/edit/${article.id}`} className='w-full'>
                      <Button variant="outline" className="w-full justify-between">
                          {name}
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                   </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleViewContent(name, article)}>
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />
          
          <Card>
            <CardHeader><CardTitle>Dados Gerais</CardTitle></CardHeader>
             <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="flex gap-2">
                  <Button onClick={handleSeedAccessories} disabled={loadingStates.accessories || !firestore} className="w-full justify-start">
                    {loadingStates.accessories && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Database className="mr-2 h-4 w-4" />
                    {loadingStates.accessories ? 'Populando...' : 'Acessórios'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleViewContent("Acessórios", accessories)}>
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader><CardTitle>Dados de Jogo por Mundo</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {worldNumbers.map(worldNum => {
                const seedInfo = worldSeedData[worldNum];
                const loadingKey = seedInfo ? seedInfo.key : `world${worldNum}-disabled`;
                return (
                  <div key={worldNum} className="flex gap-2">
                    <Button onClick={() => seedInfo && seedWorldGeneric(`world-${worldNum}`, seedInfo.data, loadingKey)} disabled={!seedInfo || loadingStates[loadingKey] || !firestore} className="w-full justify-start">
                      {loadingStates[loadingKey] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       <Database className="mr-2 h-4 w-4" />
                      Mundo {worldNum}
                    </Button>
                    {seedInfo && (
                      <Button variant="ghost" size="icon" onClick={() => handleViewContent(seedInfo.data.name, seedInfo.data)}>
                        <Eye className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <Dialog open={!!viewingContent} onOpenChange={(isOpen) => !isOpen && setViewingContent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingContent?.title}</DialogTitle>
            <DialogDescription>
              Visualizando os dados JSON que serão populados no Firestore.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] mt-4">
            <pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap">
              {JSON.stringify(viewingContent?.data, null, 2)}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminChatView() {
    return (
        <div className="flex flex-col h-full">
            <header className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Canal Direto com a IA</h1>
                <p className="text-muted-foreground">Utilize este painel para direcionar o desenvolvimento e gerenciar o conteúdo da Wiki.</p>
            </header>

            <Tabs defaultValue="wiki-management" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 max-w-md self-start">
                    <TabsTrigger value="chat">Conversar com a IA</TabsTrigger>
                    <TabsTrigger value="wiki-management" className="flex items-center gap-2">
                        <span>Gerenciar Conteúdo</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-muted-foreground" tabIndex={0}><Info className="h-4 w-4" /></span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm" side="top" align="center">
                                    <h4 className="font-bold mb-2">Como Estruturar Informações</h4>
                                    <p className="mb-2">Ao adicionar ou atualizar conteúdo, siga estas regras para garantir que a IA consiga entender e usar os dados:</p>
                                    <ul className="list-disc list-inside space-y-1 text-left">
                                        <li><strong>IDs Únicos:</strong> Cada item (poder, NPC, artigo) deve ter um `id` único em letras minúsculas e separado por hífen (ex: `grand-elder-power`).</li>
                                        <li><strong>Tabelas Estruturadas:</strong> Para tabelas de dados (como ranks ou stats), use o formato `tables` com `headers` (uma lista de strings) e `rows` (uma lista de objetos).</li>
                                        <li><strong>Notação do Jogo:</strong> Use as abreviações de números do jogo (k, M, B, T, qd, etc.) para valores de energia, HP e EXP.</li>
                                        <li><strong>Consistência é Chave:</strong> Mantenha os nomes das propriedades (`statType`, `rarity`, `multiplier`) consistentes com os dados já existentes.</li>
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 flex flex-col mt-4 min-h-0">
                    <div className="flex-1 overflow-auto relative">
                        <div className="p-4 md:p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/20 text-primary p-2 rounded-full border border-primary/50">
                                    <Bot size={20} />
                                </div>
                                <Card className="max-w-2xl">
                                    <CardHeader>
                                        <CardTitle className='text-lg'>Assistente de Desenvolvimento</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Olá! Sou seu parceiro de codificação AI. Estou pronto para ajudar.</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Use o campo abaixo para me dizer o que você precisa. Por exemplo:
                                        </p>
                                        <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                                            <li>"Adicione uma nova propriedade 'cooldown' à entidade 'PowerStat' no backend.json."</li>
                                            <li>"Corrija o cálculo de DPS na página da calculadora para incluir o bônus do pet."</li>
                                            <li>"Crie um novo artigo na wiki sobre o sistema de 'Rebirth'."</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
    
                    <div className="border-t p-4 bg-background">
                        <div className="flex items-center gap-4">
                            <div className='flex-1 relative'>
                                <Textarea
                                    placeholder="Digite sua solicitação aqui..."
                                    className="resize-none pr-12"
                                />
                                <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90">
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Enviar</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
    
                <TabsContent value="wiki-management" className="flex-1 mt-4 overflow-hidden">
                   <WikiManagementTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
