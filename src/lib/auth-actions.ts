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
  };

  // Set createdAt only if the user is new.
  if (user.metadata.creationTime === user.metadata.lastSignInTime) {
    userData.createdAt = serverTimestamp();
  }

  try {
    // Use { merge: true } to create the document if it doesn't exist,
    // or update it if it does, without overwriting existing fields like 'tag'.
    await setDoc(userRef, userData, { merge: true });
    console.log('User document written/updated for:', user.uid);
  } catch (error) {
    console.error('Error writing user document:', error);
    // You might want to throw the error or handle it in a specific way
    throw new Error('Failed to update user profile in Firestore.');
  }
}
