
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
    ],
    npcs: [],
    pets: [],
    dungeons: [],
  };
  

export default function SeedPage() {
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSeedData() {
    setIsLoading(true);
    
    if (!firestore) {
        toast({
            title: 'Error',
            description: 'Firestore is not initialized.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    const batch = writeBatch(firestore);
    const worldRef = doc(firestore, 'worlds', 'world-20');
    batch.set(worldRef, { name: world20Data.name });

    const allDataForBatch: Record<string, any> = {
        [worldRef.path]: { name: world20Data.name }
    };

    for (const power of world20Data.powers) {
        const powerRef = doc(worldRef, 'powers', power.id);
        const { stats, ...powerData } = power;
        batch.set(powerRef, powerData);
        allDataForBatch[powerRef.path] = powerData;


        for (const stat of stats) {
            const statId = stat.name.toLowerCase().replace(/\s+/g, '-');
            const statRef = doc(powerRef, 'stats', statId);
            batch.set(statRef, stat);
            allDataForBatch[statRef.path] = stat;
        }
    }
    
    batch.commit().then(() => {
        toast({
            title: 'Success!',
            description: 'World 20 data has been successfully seeded to Firestore.',
        });
        setIsLoading(false);
    }).catch((error) => {
        console.error("Batch commit failed:", error);
        const permissionError = new FirestorePermissionError({
            path: 'worlds/world-20 and subcollections',
            operation: 'write',
            requestResourceData: allDataForBatch,
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
    });
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Seed Firestore Database</CardTitle>
          <CardDescription>
            Populate your Firestore database with initial data for World 20.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This action will add the data for "World 20 - Grand Elder", including its gacha powers and stats, into your Firestore `worlds` collection.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Clicking the button will attempt to write the data to Firestore.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedData} disabled={isLoading || !firestore}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              'Seed World 20 Data'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
