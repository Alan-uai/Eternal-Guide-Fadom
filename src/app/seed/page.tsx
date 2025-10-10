'use client';

import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, ShieldAlert, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useAdmin } from '@/hooks/use-admin';
import { 
  gettingStartedArticle,
  rankArticle, 
  auraArticle, 
  prestigeArticle, 
  worldBossesArticle,
  swordsArticle,
  damageSwordsArticle,
  world20RaidsArticle,
  raidRequirementsArticle,
  gamepassTierListArticle,
  scientificNotationArticle,
  scythesArticle,
  titansArticle,
  standsArticle,
  howToGetStrongerArticle,
  lobbyDungeonsArticle,
  energyGainPerRankArticle,
  levelExpArticle
} from '@/lib/wiki-data';
import type { WikiArticle } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
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
import { ScrollArea } from '@/components/ui/scroll-area';

function AdminSeedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState({
    world1: false,
    world2: false,
    world3: false,
    world4: false,
    world5: false,
    world6: false,
    world7: false,
    world8: false,
    world9: false,
    world10: false,
    world11: false,
    world12: false,
    world13: false,
    world14: false,
    world15: false,
    world16: false,
    world17: false,
    world18: false,
    world19: false,
    world20: false,
    world21: false,
    world22: false,
    gettingStarted: false,
    ranks: false,
    auras: false,
    prestige: false,
    bosses: false,
    accessories: false,
    swords: false,
    damageSwords: false,
    world20Raids: false,
    raidRequirements: false,
    gamepass: false,
    notation: false,
    scythes: false,
    titans: false,
    stands: false,
    howToGetStronger: false,
    lobbyDungeons: false,
    energyGain: false,
    levelExp: false,
    all: false
  });
  const [viewingContent, setViewingContent] = useState<{ title: string; data: any } | null>(null);

  const handleLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const handleViewContent = (title: string, data: any) => {
    setViewingContent({ title, data });
  };

  async function seedWorldGeneric(worldId: string, worldData: any, loadingKey: keyof typeof loadingStates) {
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { stats, ...itemData } = item;
            batch.set(itemRef, itemData);
            allDataForBatch[itemRef.path] = itemData;

            if (stats && stats.length > 0) {
                for (const stat of stats) {
                    // Use a combination of properties to create a unique ID for stats if they don't have one
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
        toast({ title: 'Sucesso!', description: `Os dados do ${worldData.name} foram populados com sucesso.` });
    }).catch(() => {
        const permissionError = new FirestorePermissionError({
            path: `worlds/${worldId} and subcollections`, operation: 'write', requestResourceData: allDataForBatch,
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        handleLoading(loadingKey, false);
    });
  }

  async function seedArticle(article: WikiArticle, loadingKey: keyof typeof loadingStates, articleName: string) {
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
      toast({ title: 'Sucesso!', description: 'Os dados dos acessórios foram populados com sucesso.' });
    }).catch(() => {
      const permissionError = new FirestorePermissionError({
        path: 'accessories batch write', operation: 'write', requestResourceData: allDataForBatch,
      });
      errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
      handleLoading('accessories', false);
    });
  }

  const worldNumbers = Array.from({ length: 22 }, (_, i) => i + 1);
  const worldSeedData: { [key: number]: any } = {
    1: { data: world1Data, key: 'world1' },
    2: { data: world2Data, key: 'world2' },
    3: { data: world3Data, key: 'world3' },
    4: { data: world4Data, key: 'world4' },
    5: { data: world5Data, key: 'world5' },
    6: { data: world6Data, key: 'world6' },
    7: { data: world7Data, key: 'world7' },
    8: { data: world8Data, key: 'world8' },
    9: { data: world9Data, key: 'world9' },
    10: { data: world10Data, key: 'world10' },
    11: { data: world11Data, key: 'world11' },
    12: { data: world12Data, key: 'world12' },
    13: { data: world13Data, key: 'world13' },
    14: { data: world14Data, key: 'world14' },
    15: { data: world15Data, key: 'world15' },
    16: { data: world16Data, key: 'world16' },
    17: { data: world17Data, key: 'world17' },
    18: { data: world18Data, key: 'world18' },
    19: { data: world19Data, key: 'world19' },
    20: { data: world20Data, key: 'world20' },
    21: { data: world21Data, key: 'world21' },
    22: { data: world22Data, key: 'world22' },
  };

  const articleSeedData = [
    { article: gettingStartedArticle, key: 'gettingStarted', name: 'Começando no Anime Eternal' },
    { article: rankArticle, key: 'ranks', name: 'Sistema de Ranks' },
    { article: energyGainPerRankArticle, key: 'energyGain', name: 'Ganho de Energia por Rank' },
    { article: levelExpArticle, key: 'levelExp', name: 'Experiência por Nível' },
    { article: auraArticle, key: 'auras', name: 'Sistema de Auras' },
    { article: prestigeArticle, key: 'prestige', name: 'Sistema de Prestígio' },
    { article: worldBossesArticle, key: 'bosses', name: 'Guia de Chefes de Mundo' },
    { article: swordsArticle, key: 'swords', name: 'Espadas de Energia' },
    { article: damageSwordsArticle, key: 'damageSwords', name: 'Espadas de Dano' },
    { article: world20RaidsArticle, key: 'world20Raids', name: 'Raids do Mundo 20' },
    { article: raidRequirementsArticle, key: 'raidRequirements', name: 'Requisitos de Raid' },
    { article: gamepassTierListArticle, key: 'gamepass', name: 'Tier List de Gamepasses' },
    { article: scientificNotationArticle, key: 'notation', name: 'Notação Científica' },
    { article: scythesArticle, key: 'scythes', name: 'Foices (Mundo 21)' },
    { article: titansArticle, key: 'titans', name: 'Guia de Titãs (Mundo 11)' },
    { article: standsArticle, key: 'stands', name: 'Guia de Stands (Mundo 16)' },
    { article: howToGetStrongerArticle, key: 'howToGetStronger', name: 'Guia Estratégico' },
    { article: lobbyDungeonsArticle, key: 'lobbyDungeons', name: 'Guia de Dungeons do Lobby' },
  ];

  async function handleSeedAll() {
    handleLoading('all', true);
    toast({ title: 'Iniciando...', description: 'Populando todos os dados do jogo. Isso pode levar um momento.' });
    
    for (const { article, key, name } of articleSeedData) {
      await seedArticle(article, key as keyof typeof loadingStates, name);
    }
    
    await handleSeedAccessories();

    for (const worldNum in worldSeedData) {
      const seedInfo = worldSeedData[worldNum];
      await seedWorldGeneric(`world-${worldNum}`, seedInfo.data, seedInfo.key as keyof typeof loadingStates);
    }

    toast({ title: 'Concluído!', description: 'Todos os dados foram populados com sucesso.' });
    handleLoading('all', false);
  }

  return (
    <>
    <div className="container mx-auto py-8 space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Controle Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Use este botão para popular todos os artigos da wiki e dados de todos os mundos disponíveis de uma só vez.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedAll} disabled={loadingStates.all || !firestore}>
            {loadingStates.all ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStates.all ? 'Populando Tudo...' : 'Popular Tudo'}
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      <Card>
        <CardHeader><CardTitle>Popular Artigos da Wiki e Dados do Jogo</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articleSeedData.map(({ article, key, name }) => (
            <Card key={key}>
              <CardHeader><CardTitle className="text-lg">{name}</CardTitle></CardHeader>
              <CardContent><CardDescription>Popula o artigo "{name}" na coleção `wikiContent`.</CardDescription></CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => seedArticle(article, key as keyof typeof loadingStates, name)} disabled={loadingStates[key as keyof typeof loadingStates] || !firestore}>
                  {loadingStates[key as keyof typeof loadingStates] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingStates[key as keyof typeof loadingStates] ? 'Populando...' : 'Popular'}
                </Button>
                 <Button variant="ghost" size="icon" onClick={() => handleViewContent(name, article)}>
                    <Eye className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
            <Card>
                <CardHeader><CardTitle className="text-lg">Popular Acessórios</CardTitle></CardHeader>
                <CardContent><CardDescription>Popula todos os acessórios do jogo em seus respectivos mundos.</CardDescription></CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleSeedAccessories} disabled={loadingStates.accessories || !firestore}>
                        {loadingStates.accessories ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loadingStates.accessories ? 'Populando...' : 'Popular Acessórios'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleViewContent("Acessórios", accessories)}>
                        <Eye className="h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Popular Dados de Jogo por Mundo</CardTitle>
          <CardDescription>Popula o Firestore com dados de jogo para cada mundo individualmente.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {worldNumbers.map(worldNum => {
            const seedInfo = worldSeedData[worldNum];
            const loadingKey = seedInfo ? seedInfo.key as keyof typeof loadingStates : null;
            return (
              <div key={worldNum} className="flex gap-2">
                {seedInfo ? (
                   <Button onClick={() => seedWorldGeneric(`world-${worldNum}`, seedInfo.data, loadingKey!)} disabled={loadingStates[loadingKey!] || !firestore} className="w-full justify-start">
                      {loadingStates[loadingKey!] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loadingStates[loadingKey!] ? 'Populando...' : `Popular Mundo ${worldNum}`}
                  </Button>
                ) : (
                  <Button disabled className="w-full justify-start">
                    Popular Mundo {worldNum}
                  </Button>
                )}
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
    <Dialog open={!!viewingContent} onOpenChange={(isOpen) => !isOpen && setViewingContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingContent?.title}</DialogTitle>
            <DialogDescription>
              Visualizando os dados JSON que serão populados no Firestore.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] mt-4">
            <pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap">
              {JSON.stringify(viewingContent?.data, null, 2)}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

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

  return <AdminSeedPage />;
}
