'use server';

import { initializeFirebaseServer } from '@/firebase/server';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export async function handleUserLogin(user: User) {
  const { firestore } = initializeFirebaseServer();
  const userRef = doc(firestore, 'users', user.uid);

  const userData: any = {
    id: user.uid,
    email: user.email,
    username: user.displayName || user.email?.split('@')[0],
    // Do not set createdAt on every login, only on creation.
    // Let merge:true handle this. If the doc exists, this won't overwrite.
    // If it's a new doc, this will be set.
  };

  if (!user.metadata.creationTime || user.metadata.creationTime === user.metadata.lastSignInTime) {
    userData.createdAt = serverTimestamp();
  }


  // Check if the sign-in provider is Google to assign admin tag
  if (user.providerData.some(provider => provider.providerId === 'google.com')) {
    userData.tag = 'admin';
  }

  try {
    // Use { merge: true } to create the document if it doesn't exist,
    // or update it if it does, without overwriting existing fields.
    await setDoc(userRef, userData, { merge: true });
    console.log('User document written/updated for:', user.uid);
  } catch (error) {
    console.error('Error writing user document:', error);
    // You might want to throw the error or handle it in a specific way
    throw new Error('Failed to update user profile in Firestore.');
  }
}

    