// src/firebase/firestore/data.ts
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getRaceStats(raceName: string) {
  const { firestore } = initializeFirebase();
  try {
    const worldsCollection = collection(firestore, 'worlds');
    const worldsSnapshot = await getDocs(worldsCollection);

    if (worldsSnapshot.empty) {
      return { error: 'No worlds found in the database.' };
    }

    for (const worldDoc of worldsSnapshot.docs) {
      const racesCollection = collection(worldDoc.ref, 'races');
      const q = query(racesCollection, where('name', '==', raceName));
      const raceSnapshot = await getDocs(q);

      if (!raceSnapshot.empty) {
        const raceDoc = raceSnapshot.docs[0];
        // Now, let's get the subcollections for stats
        const statsCollection = collection(raceDoc.ref, 'Stats');
        const statsSnapshot = await getDocs(statsCollection);
        
        if (!statsSnapshot.empty) {
            const statsData = statsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            return {
                race: raceDoc.data(),
                stats: statsData,
            };
        }
      }
    }

    return { error: `Race "${raceName}" not found.` };
  } catch (error) {
    console.error('Error fetching race stats:', error);
    return { error: 'An error occurred while fetching data from Firestore.' };
  }
}
