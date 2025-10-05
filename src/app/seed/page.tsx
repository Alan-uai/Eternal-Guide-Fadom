
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
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
  titansArticle
} from '@/lib/wiki-data';
import type { WikiArticle } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { accessories, worldNameToId } from '@/lib/accessory-data';
import { world1Data } from '@/lib/world-1-data';
import { world2Data } from '@/lib/world-2-data';
import { world3Data } from '@/lib/world-3-data';
import { world4Data } from '@/lib/world-4-data';
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

export default function SeedPage() {
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
    all: false
  });

  const handleLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
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

  const worldNumbers = Array.from({ length: 21 }, (_, i) => i + 1);
  const worldSeedData: { [key: number]: any } = {
    1: { data: world1Data, key: 'world1' },
    2: { data: world2Data, key: 'world2' },
    3: { data: world3Data, key: 'world3' },
    4: { data: world4Data, key: 'world4' },
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
  };

  async function handleSeedAll() {
    handleLoading('all', true);
    toast({ title: 'Iniciando...', description: 'Populando todos os dados do jogo. Isso pode levar um momento.' });
    
    await seedArticle(gettingStartedArticle, 'gettingStarted', 'Começando no Anime Eternal');
    await seedArticle(rankArticle, 'ranks', 'Sistema de Ranks');
    await seedArticle(auraArticle, 'auras', 'Sistema de Auras');
    await seedArticle(prestigeArticle, 'prestige', 'Sistema de Prestígio');
    await seedArticle(worldBossesArticle, 'bosses', 'Guia de Chefes de Mundo');
    await seedArticle(swordsArticle, 'swords', 'Espadas de Energia');
    await seedArticle(damageSwordsArticle, 'damageSwords', 'Espadas de Dano');
    await seedArticle(world20RaidsArticle, 'world20Raids', 'Raids do Mundo 20');
    await seedArticle(raidRequirementsArticle, 'raidRequirements', 'Requisitos de Raid');
    await seedArticle(gamepassTierListArticle, 'gamepass', 'Tier List de Gamepasses');
    await seedArticle(scientificNotationArticle, 'notation', 'Notação Científica');
    await seedArticle(scythesArticle, 'scythes', 'Foices (Mundo 21)');
    await seedArticle(titansArticle, 'titans', 'Guia de Titãs (Mundo 11)');

    await handleSeedAccessories();

    for (const worldNum in worldSeedData) {
      const seedInfo = worldSeedData[worldNum];
      await seedWorldGeneric(`world-${worldNum}`, seedInfo.data, seedInfo.key as keyof typeof loadingStates);
    }

    toast({ title: 'Concluído!', description: 'Todos os dados foram populados com sucesso.' });
    handleLoading('all', false);
  }

  return (
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
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Artigo Inicial</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Começando no Anime Eternal" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(gettingStartedArticle, 'gettingStarted', 'Começando no Anime Eternal')} disabled={loadingStates.gettingStarted || !firestore}>
                {loadingStates.gettingStarted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.gettingStarted ? 'Populando...' : 'Popular Artigo Inicial'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Sistema de Ranks</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Sistema de Ranks" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(rankArticle, 'ranks', 'Sistema de Ranks')} disabled={loadingStates.ranks || !firestore}>
                {loadingStates.ranks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.ranks ? 'Populando...' : 'Popular Artigo de Ranks'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Sistema de Auras</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Sistema de Auras" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(auraArticle, 'auras', 'Sistema de Auras')} disabled={loadingStates.auras || !firestore}>
                {loadingStates.auras ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.auras ? 'Populando...' : 'Popular Artigo de Auras'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Sistema de Prestígio</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Sistema de Prestígio" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(prestigeArticle, 'prestige', 'Sistema de Prestígio')} disabled={loadingStates.prestige || !firestore}>
                {loadingStates.prestige ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.prestige ? 'Populando...' : 'Popular Artigo de Prestígio'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Guia de Chefes de Mundo</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Guia de Chefes de Mundo" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(worldBossesArticle, 'bosses', 'Guia de Chefes de Mundo')} disabled={loadingStates.bosses || !firestore}>
                {loadingStates.bosses ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.bosses ? 'Populando...' : 'Popular Guia de Chefes'}
              </Button>
            </CardFooter>
          </Card>
           <Card>
            <CardHeader><CardTitle className="text-lg">Popular Acessórios</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula todos os acessórios do jogo em seus respectivos mundos.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={handleSeedAccessories} disabled={loadingStates.accessories || !firestore}>
                {loadingStates.accessories ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.accessories ? 'Populando...' : 'Popular Acessórios'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Espadas de Energia</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Espadas de Energia" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(swordsArticle, 'swords', 'Espadas de Energia')} disabled={loadingStates.swords || !firestore}>
                {loadingStates.swords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.swords ? 'Populando...' : 'Popular Espadas de Energia'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Espadas de Dano</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Espadas de Dano (Evolução)" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(damageSwordsArticle, 'damageSwords', 'Espadas de Dano')} disabled={loadingStates.damageSwords || !firestore}>
                {loadingStates.damageSwords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.damageSwords ? 'Populando...' : 'Popular Espadas de Dano'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Raids do Mundo 20</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Raids do Mundo 20" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(world20RaidsArticle, 'world20Raids', 'Raids do Mundo 20')} disabled={loadingStates.world20Raids || !firestore}>
                {loadingStates.world20Raids ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.world20Raids ? 'Populando...' : 'Popular Raids Mundo 20'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Requisitos de Raid</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Requisitos de Energia para Raids" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(raidRequirementsArticle, 'raidRequirements', 'Requisitos de Raid')} disabled={loadingStates.raidRequirements || !firestore}>
                {loadingStates.raidRequirements ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.raidRequirements ? 'Populando...' : 'Popular Requisitos de Raid'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Tier List de Gamepasses</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Tier List de Gamepasses" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(gamepassTierListArticle, 'gamepass', 'Tier List de Gamepasses')} disabled={loadingStates.gamepass || !firestore}>
                {loadingStates.gamepass ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.gamepass ? 'Populando...' : 'Popular Tier List'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Notação Científica</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Abreviações de Notação Científica" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(scientificNotationArticle, 'notation', 'Notação Científica')} disabled={loadingStates.notation || !firestore}>
                {loadingStates.notation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.notation ? 'Populando...' : 'Popular Notação'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Foices (Mundo 21)</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Foices (Mundo 21)" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(scythesArticle, 'scythes', 'Foices (Mundo 21)')} disabled={loadingStates.scythes || !firestore}>
                {loadingStates.scythes ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.scythes ? 'Populando...' : 'Popular Foices'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Popular Guia de Titãs (Mundo 11)</CardTitle></CardHeader>
            <CardContent><CardDescription>Popula o artigo "Guia de Titãs (Mundo 11)" na coleção `wikiContent`.</CardDescription></CardContent>
            <CardFooter>
              <Button onClick={() => seedArticle(titansArticle, 'titans', 'Guia de Titãs (Mundo 11)')} disabled={loadingStates.titans || !firestore}>
                {loadingStates.titans ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingStates.titans ? 'Populando...' : 'Popular Titãs'}
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
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {worldNumbers.map(worldNum => {
            const seedInfo = worldSeedData[worldNum];
            const loadingKey = seedInfo ? seedInfo.key as keyof typeof loadingStates : null;
            return (
              <div key={worldNum}>
                {seedInfo ? (
                   <Button onClick={() => seedWorldGeneric(`world-${worldNum}`, seedInfo.data, loadingKey!)} disabled={loadingStates[loadingKey!] || !firestore} className="w-full">
                      {loadingStates[loadingKey!] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loadingStates[loadingKey!] ? 'Populando...' : `Popular Mundo ${worldNum}`}
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Popular Mundo {worldNum}
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  );
}
