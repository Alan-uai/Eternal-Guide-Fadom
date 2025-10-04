// src/app/seed/page.tsx
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

    try {
        const worldsCollection = collection(firestore, 'worlds');
        const q = query(worldsCollection, where('name', '==', world20Data.name));
        const worldSnapshot = await getDocs(q);

        if (!worldSnapshot.empty) {
            toast({
                title: 'Data Already Exists',
                description: 'The data for World 20 has already been seeded.',
                variant: 'default',
            });
            setIsLoading(false);
            return;
        }

        const batch = writeBatch(firestore);

        const worldRef = doc(firestore, 'worlds', 'world-20');
        batch.set(worldRef, { name: world20Data.name });

        for (const power of world20Data.powers) {
            const powerRef = doc(worldRef, 'powers', power.id);
            const { stats, ...powerData } = power;
            batch.set(powerRef, powerData);

            for (const stat of stats) {
                const statId = stat.name.toLowerCase().replace(/\s+/g, '-');
                const statRef = doc(powerRef, 'stats', statId);
                batch.set(statRef, stat);
            }
        }
        
        await batch.commit();

        toast({
            title: 'Success!',
            description: 'World 20 data has been successfully seeded to Firestore.',
        });
    } catch (error: any) {
        console.error('Error seeding data:', error);
        toast({
            title: 'Error Seeding Data',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
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
            The process will check if the data already exists to prevent duplicates.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedData} disabled={isLoading}>
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
