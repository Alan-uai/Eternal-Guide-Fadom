// src/firebase/firestore/data.ts
'use server';

import { initializeFirebaseServer } from '@/firebase/server';
import { collection, getDocs, query, where, doc, collectionGroup } from 'firebase/firestore';

export async function getGameData(worldName: string, category: string, itemName?: string) {
  const { firestore } = initializeFirebaseServer();
  try {
    // Find the world first
    const worldsCollection = collection(firestore, 'worlds');
    const worldQuery = query(worldsCollection, where('name', '==', worldName));
    const worldSnapshot = await getDocs(worldQuery);

    if (worldSnapshot.empty) {
      return { error: `World "${worldName}" not found.` };
    }

    const worldDoc = worldSnapshot.docs[0];
    const categoryCollectionRef = collection(worldDoc.ref, category);
    
    let itemQuery;
    if (itemName) {
      itemQuery = query(categoryCollectionRef, where('name', '==', itemName));
    } else {
      itemQuery = categoryCollectionRef;
    }

    const itemSnapshot = await getDocs(itemQuery);

    if (itemSnapshot.empty) {
        return { error: `No items found in category "${category}" ${itemName ? `with name "${itemName}"` : ''} for world "${worldName}".` };
    }
    
    const results = [];
    for (const itemDoc of itemSnapshot.docs) {
        const itemData = { id: itemDoc.id, ...itemDoc.data() };
        
        // Let's also fetch sub-collections if they exist, like 'stats' for a power
        const subcollections = await itemDoc.ref.listCollections();
        for (const subcollectionRef of subcollections) {
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            (itemData as any)[subcollectionRef.id] = subcollectionSnapshot.docs.map(d => ({id: d.id, ...d.data()}));
        }
        results.push(itemData);
    }
    
    return results;

  } catch (error) {
    console.error('Error fetching game data:', error);
    return { error: 'An error occurred while fetching data from Firestore.' };
  }
}

// Kept for backwards compatibility if needed by other parts of the app, but new logic should use getGameData
export async function getRaceStats(raceName: string) {
  return getGameData("World1", "races", raceName);
}