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
import { rankArticle, auraArticle, prestigeArticle, worldBossesArticle } from '@/lib/wiki-data';
import type { WikiArticle } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { accessories, worldNameToId } from '@/lib/accessory-data';
import { world1Data } from '@/lib/world-1-data';
import { world2Data } from '@/lib/world-2-data';
import { world3Data } from '@/lib/world-3-data';

const world20Data = {
    name: 'World 20 - Grand Elder',
    powers: [
      {
        id: 'grand-elder-power',
        name: 'Grand Elder Power',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Sleeping Power', multiplier: '2x' },
          { name: 'Stirring Spirit', multiplier: '3x' },
          { name: 'Hidden Potential', multiplier: '4.5x' },
          { name: 'Inner Strength', multiplier: '6x' },
          { name: 'Power Unleashed', multiplier: '8x' },
          { name: 'True Potential', multiplier: '10x' },
          { name: 'Limitless Growth', multiplier: '12x' },
          { name: 'Potential Unbound', multiplier: '15x' },
        ],
      },
      {
        id: 'frost-demon-evolution',
        name: 'Frost Demon Evolution',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Second Form', multiplier: '1x' },
          { name: 'Third Form', multiplier: '1.5x' },
          { name: 'Final Form', multiplier: '2x' },
          { name: '50% Power', multiplier: '3x' },
          { name: '100% Full Power', multiplier: '5x' },
          { name: 'Mecha Form', multiplier: '7x' },
          { name: 'Golden Form', multiplier: '9x' },
          { name: 'Black Form', multiplier: '12x' },
        ],
      },
       {
        id: 'dragon-energy',
        name: 'Dragon Energy',
        type: 'progression',
        statType: 'energy',
        maxLevel: 50,
        maxBoost: '1x Energy'
      },
      {
        id: 'dragon-damage',
        name: 'Dragon Damage',
        type: 'progression',
        statType: 'damage',
        maxLevel: 500,
        maxBoost: '10x Damage'
      }
    ],
    npcs: [],
    pets: [],
    dungeons: [],
  };
  
export default function SeedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState({
    world1: false,
    world2: false,
    world3: false,
    world20: false,
    ranks: false,
    auras: false,
    prestige: false,
    bosses: false,
    accessories: false,
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
            const itemRef = doc(worldRef, subcollectionName, item.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { stats, ...itemData } = item;
            batch.set(itemRef, itemData);
            allDataForBatch[itemRef.path] = itemData;

            if (stats && stats.length > 0) {
                for (const stat of stats) {
                    const statId = stat.name.toLowerCase().replace(/\s+/g, '-').replace(/%/g, '');
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
    
    batch.commit().then(() => {
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
    
    batch.commit().then(() => {
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

    batch.commit().then(() => {
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader><CardTitle>Popular Artigos da Wiki e Dados do Jogo</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Popular Dados de Jogo por Mundo</CardTitle>
          <CardDescription>Popula o Firestore com dados de jogo para cada mundo individualmente. Dados para mundos diferentes de 1, 2, 3 e 20 ainda não estão disponíveis.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {worldNumbers.map(worldNum => (
            <div key={worldNum}>
              {worldNum === 1 ? (
                 <Button onClick={() => seedWorldGeneric('world-1', world1Data, 'world1')} disabled={loadingStates.world1 || !firestore} className="w-full">
                    {loadingStates.world1 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loadingStates.world1 ? 'Populando...' : `Popular Mundo ${worldNum}`}
                </Button>
              ) : worldNum === 2 ? (
                <Button onClick={() => seedWorldGeneric('world-2', world2Data, 'world2')} disabled={loadingStates.world2 || !firestore} className="w-full">
                  {loadingStates.world2 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingStates.world2 ? 'Populando...' : `Popular Mundo ${worldNum}`}
                </Button>
              ) : worldNum === 3 ? (
                <Button onClick={() => seedWorldGeneric('world-3', world3Data, 'world3')} disabled={loadingStates.world3 || !firestore} className="w-full">
                  {loadingStates.world3 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingStates.world3 ? 'Populando...' : `Popular Mundo ${worldNum}`}
                </Button>
              ) : worldNum === 20 ? (
                <Button onClick={() => seedWorldGeneric('world-20', world20Data, 'world20')} disabled={loadingStates.world20 || !firestore} className="w-full">
                  {loadingStates.world20 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingStates.world20 ? 'Populando...' : `Popular Mundo ${worldNum}`}
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Popular Mundo {worldNum}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

    