// src/firebase/firestore/seed-world-20.ts
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const world20Data = {
  name: 'World 20 - Grand Elder',
  powers: [
    {
      id: 'grand-elder-power',
      name: 'Grand Elder Power',
      type: 'progression',
      statType: 'energy', // Custom field to distinguish power type
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
      type: 'progression',
      statType: 'damage', // Custom field to distinguish power type
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
  // NPCs, Pets, Dungeons for World 20 would go here
  npcs: [],
  pets: [],
  dungeons: [],
};

async function seedWorld20Data() {
  const { firestore } = initializeFirebase();
  console.log('Seeding data for World 20...');

  try {
    const batch = writeBatch(firestore);

    // World document
    const worldRef = doc(firestore, 'worlds', 'world-20');
    batch.set(worldRef, { name: world20Data.name });

    // Powers subcollection
    for (const power of world20Data.powers) {
      const powerRef = doc(worldRef, 'powers', power.id);
      const { stats, ...powerData } = power; // Separate stats from power data
      batch.set(powerRef, powerData);

      // Stats sub-subcollection for each power
      for (const stat of stats) {
        // Use stat name as ID for simplicity, ensuring it's a valid path segment
        const statId = stat.name.toLowerCase().replace(/\s+/g, '-');
        const statRef = doc(powerRef, 'stats', statId);
        batch.set(statRef, stat);
      }
    }

    await batch.commit();
    console.log('Successfully seeded data for World 20.');
  } catch (error) {
    // Avoid re-seeding errors, but log others.
    if (error instanceof Error && error.message.includes('permission-denied')) {
        console.log('Skipping seed for World 20, data likely already exists or rules prevent writing.');
    } else {
        console.error('Error seeding World 20 data:', error);
    }
  }
}

seedWorld20Data();
