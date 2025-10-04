
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
import { rankArticle, auraArticle, prestigeArticle, gettingStartedArticle, legendaryWeaponsArticle, guildWarsArticle } from '@/lib/wiki-data';
import type { WikiArticle } from '@/lib/types';

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
    world20: false,
    ranks: false,
    auras: false,
    prestige: false,
    otherWorlds: false,
  });

  const handleLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  async function handleSeedWorldData() {
    handleLoading('world20', true);
    
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore is not initialized.', variant: 'destructive' });
        handleLoading('world20', false);
        return;
    }

    const batch = writeBatch(firestore);
    const worldRef = doc(firestore, 'worlds', 'world-20');
    batch.set(worldRef, { name: world20Data.name });

    const allDataForBatch: Record<string, any> = { [worldRef.path]: { name: world20Data.name } };

    for (const power of world20Data.powers) {
        const powerRef = doc(worldRef, 'powers', power.id);
        const { stats, ...powerData } = power;
        batch.set(powerRef, powerData);
        allDataForBatch[powerRef.path] = powerData;

        if (stats) {
            for (const stat of stats) {
                const statId = stat.name.toLowerCase().replace(/\s+/g, '-');
                const statRef = doc(powerRef, 'stats', statId);
                batch.set(statRef, stat);
                allDataForBatch[statRef.path] = stat;
            }
        }
    }
    
    batch.commit().then(() => {
        toast({ title: 'Success!', description: 'World 20 data has been successfully seeded.' });
    }).catch(() => {
        const permissionError = new FirestorePermissionError({
            path: 'worlds/world-20 and subcollections', operation: 'write', requestResourceData: allDataForBatch,
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        handleLoading('world20', false);
    });
  }

  async function seedArticle(article: WikiArticle, loadingKey: keyof typeof loadingStates, articleName: string) {
    handleLoading(loadingKey, true);
    if (!firestore) {
        toast({ title: 'Error', description: 'Firestore is not initialized.', variant: 'destructive' });
        handleLoading(loadingKey, false);
        return;
    }
    const batch = writeBatch(firestore);
    const articleRef = doc(firestore, 'wikiContent', article.id);
    batch.set(articleRef, article);
    
    batch.commit().then(() => {
        toast({ title: 'Success!', description: `${articleName} article has been seeded.` });
    }).catch(() => {
        const permissionError = new FirestorePermissionError({
            path: `wikiContent/${article.id}`, operation: 'write', requestResourceData: { [articleRef.path]: article },
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        handleLoading(loadingKey, false);
    });
  }

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader><CardTitle>Seed World 20 Data</CardTitle></CardHeader>
        <CardContent><CardDescription>Populate Firestore with game data for World 20 (powers, etc.).</CardDescription></CardContent>
        <CardFooter>
          <Button onClick={handleSeedWorldData} disabled={loadingStates.world20 || !firestore}>
            {loadingStates.world20 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStates.world20 ? 'Seeding...' : 'Seed World 20'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Seed Rank System</CardTitle></CardHeader>
        <CardContent><CardDescription>Seed the "Rank System" article to the `wikiContent` collection.</CardDescription></CardContent>
        <CardFooter>
          <Button onClick={() => seedArticle(rankArticle, 'ranks', 'Rank System')} disabled={loadingStates.ranks || !firestore}>
            {loadingStates.ranks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStates.ranks ? 'Seeding...' : 'Seed Rank Article'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Seed Aura System</CardTitle></CardHeader>
        <CardContent><CardDescription>Seed the "Aura System" article to the `wikiContent` collection.</CardDescription></CardContent>
        <CardFooter>
          <Button onClick={() => seedArticle(auraArticle, 'auras', 'Aura System')} disabled={loadingStates.auras || !firestore}>
            {loadingStates.auras ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStates.auras ? 'Seeding...' : 'Seed Aura Article'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Seed Prestige System</CardTitle></CardHeader>
        <CardContent><CardDescription>Seed the "Prestige System" article to the `wikiContent` collection.</CardDescription></CardContent>
        <CardFooter>
          <Button onClick={() => seedArticle(prestigeArticle, 'prestige', 'Prestige System')} disabled={loadingStates.prestige || !firestore}>
            {loadingStates.prestige ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStates.prestige ? 'Seeding...' : 'Seed Prestige Article'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader><CardTitle>Seed Other Worlds</CardTitle></CardHeader>
        <CardContent><CardDescription>Seed data for all other worlds (1-19 and 21). Data not yet available.</CardDescription></CardContent>
        <CardFooter>
          <Button disabled>
            Seed Other Worlds
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
