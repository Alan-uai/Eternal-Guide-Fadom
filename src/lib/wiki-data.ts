import type { WikiArticle } from '@/lib/types';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '../firebase';
 
// This file is now seeded to Firestore and is no longer the source of truth.
// It is kept for reference or for re-seeding if needed.
export const wikiArticles: WikiArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started in Anime Eternal',
    summary: "A beginner's guide to starting your adventure in the world of Anime Eternal.",
    content: "Welcome to Anime Eternal! This guide will walk you through creating your character, understanding the basic controls, and completing your first quest.\n\nFirst, you need to choose your starting class: Warrior, Mage, or Rogue. Each class has unique abilities that cater to different playstyles. Warriors are durable front-liners, Mages control powerful elemental magic from a distance, and Rogues excel at quick, precise strikes and evasion.\n\nYour first quest will be given by the Village Elder in the starting town of Silverwind. Follow the on-screen instructions to learn about movement, combat, and interacting with the world. Good luck, adventurer!",
    tags: ['beginner', 'guide', 'new player', 'class'],
    imageId: 'wiki-1',
  },
  {
    id: 'aura-system',
    title: 'The Aura System Explained',
    summary: 'Learn about Auras, how to unlock them, and how they enhance your abilities.',
    content: 'Auras are powerful buffs that can be unlocked by reaching certain milestones in the game. There are three types of Auras: Offensive, Defensive, and Utility. You can only have one of each type active at a time.\n\nTo unlock new Auras, you must defeat specific bosses or complete legendary quests. For example, defeating the Flame Dragon boss unlocks the "Inferno Soul" offensive aura, which adds fire damage to all your attacks. Experiment with different combinations to find the best setup for your character.',
    tags: ['aura', 'power', 'abilities', 'buffs'],
    imageId: 'wiki-2',
  },
  {
    id: 'legendary-weapons',
    title: 'Crafting Legendary Weapons',
    summary: 'Discover the secrets to forging the most powerful weapons in the game.',
    content: 'Legendary weapons are the pinnacle of equipment in Anime Eternal. Crafting one is a long and arduous journey that requires rare materials, a high crafting level, and a special forge.\n\nThe required materials, known as "Celestial Fragments," are dropped by world bosses and can be found in the deepest dungeons. You will need 100 fragments, along with other rare components, to attempt a craft. The forge is located at the peak of Mount Celestia. Be warned, the path is treacherous.',
    tags: ['crafting', 'weapons', 'legendary', ' endgame'],
    imageId: 'wiki-3',
  },
  {
    id: 'guild-wars',
    title: 'An Introduction to Guild Wars',
    summary: 'Team up with your guild and battle for supremacy and rare rewards.',
    content: 'Guild Wars are weekly events where guilds compete against each other in large-scale PvP battles. To participate, you must be a member of a guild with at least 10 members.\n\nWars take place every Saturday. The objective is to capture and hold control points on a special map. The guild with the most points at the end of the event wins. Victorious guilds receive exclusive rewards, including rare cosmetics, powerful gear, and a significant amount of in-game currency.',
    tags: ['guild', 'pvp', 'event', 'team'],
    imageId: 'wiki-4',
  },
];

// NOTE: This is a one-time function to seed data. 
// You would typically run this from a script, not in your app's runtime code.
// For this environment, we will call it once from a component to seed the data.
async function seedWikiData() {
  const { firestore } = initializeFirebase();
  const wikiCollectionRef = collection(firestore, 'wikiContent');
  
  // Check if data exists to avoid re-seeding
  const existingDocs = await getDocs(wikiCollectionRef);
  if (!existingDocs.empty) {
    console.log("Wiki data already exists in Firestore. Skipping seed.");
    return;
  }
  
  console.log("Seeding wiki data to Firestore...");
  const { setDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
  const { doc } = await import('firebase/firestore');

  for (const article of wikiArticles) {
    const docRef = doc(firestore, 'wikiContent', article.id);
    // We are using setDocumentNonBlocking which is a non-blocking write.
    // This is fine for seeding.
    setDocumentNonBlocking(docRef, article, {});
  }
  console.log("Seeding complete.");
}

// Call the seed function. In a real app, you might have a separate script for this.
// For this example, we call it here. It has a check to prevent re-seeding.
seedWikiData();
