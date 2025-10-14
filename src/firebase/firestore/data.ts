
// src/firebase/firestore/data.ts
'use server';

import { initializeFirebaseServer } from '@/firebase/server';
import { collection, getDocs, query, where, doc, getDoc, collectionGroup } from 'firebase/firestore';

// Helper function to parse multiplier string to a number
function parseMultiplier(multiplier: string): number {
    if (typeof multiplier !== 'string') return 0;
    return parseFloat(multiplier.replace('x', ''));
}

export async function getGameData(worldName: string, category: string, itemName?: string) {
  const { firestore } = initializeFirebaseServer();
  try {
    let worldQuery;
    const lowerCaseWorldName = worldName.toLowerCase();
    
    // Create a query to find the world document.
    // This is more flexible than a static map.
    const worldsRef = collection(firestore, 'worlds');
    worldQuery = query(worldsRef, where('name', '>=', worldName), where('name', '<=', worldName + '\uf8ff'));

    const worldQuerySnapshot = await getDocs(worldQuery);
    
    let targetWorldDoc;

    if (!worldQuerySnapshot.empty) {
        // Find the best match if multiple documents are returned (e.g., "World 1" and "World 10" for query "World 1")
        targetWorldDoc = worldQuerySnapshot.docs.find(doc => doc.data().name.toLowerCase().startsWith(lowerCaseWorldName));
        if (!targetWorldDoc) {
             // If no perfect start-of-string match, maybe it's a substring match like "windmill" for "World 2 - Windmill Island"
             targetWorldDoc = worldQuerySnapshot.docs.find(doc => doc.data().name.toLowerCase().includes(lowerCaseWorldName));
        }
        // Fallback to the first result if no better match is found
        if (!targetWorldDoc) {
            targetWorldDoc = worldQuerySnapshot.docs[0];
        }
    }

    if (!targetWorldDoc) {
      return { error: `World containing name "${worldName}" not found.` };
    }

    const categoryCollectionRef = collection(targetWorldDoc.ref, category);
    
    let itemQuery;
    if (itemName) {
      // Be more flexible with item names as well
      const lowerCaseItemName = itemName.toLowerCase();
      const allItemsSnapshot = await getDocs(categoryCollectionRef);
      const matchedDocs = allItemsSnapshot.docs.filter(doc => doc.data().name.toLowerCase().includes(lowerCaseItemName));
      
      if(matchedDocs.length === 0) {
        return { error: `No items found in category "${category}" with name containing "${itemName}" for world "${targetWorldDoc.data().name}".` };
      }
      // "Fake" a snapshot to continue the flow
      itemQuery = matchedDocs;

    } else {
      const allItemsSnapshot = await getDocs(categoryCollectionRef);
      itemQuery = allItemsSnapshot.docs;
    }

    if (itemQuery.length === 0) {
        return { error: `No items found in category "${category}" ${itemName ? `with name "${itemName}"` : ''} for world "${targetWorldDoc.data().name}".` };
    }
    
    const results = [];
    for (const itemDoc of itemQuery) {
        const itemData = { id: itemDoc.id, ...itemDoc.data() };
        
        // Fetch sub-collections like 'stats' for a power
        if (category === 'powers' && itemDoc.ref) {
            const statsCollectionRef = collection(itemDoc.ref, 'stats');
            const statsSnapshot = await getDocs(statsCollectionRef);
            if (!statsSnapshot.empty) {
                const statsData = statsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));
                
                // Sort stats by multiplier in ascending order
                statsData.sort((a, b) => parseMultiplier(a.multiplier) - parseMultiplier(b.multiplier));

                (itemData as any)['stats'] = statsData;
            }
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
