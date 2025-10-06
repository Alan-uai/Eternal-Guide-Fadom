'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

interface AdminState {
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAdmin(): AdminState {
  const { user, isUserLoading } = useUser();
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    // If the main user object is still loading, we are also loading.
    if (isUserLoading) {
      setAdminState({ isAdmin: false, isLoading: true });
      return;
    }

    // If there's no user, they can't be an admin.
    if (!user) {
      setAdminState({ isAdmin: false, isLoading: false });
      return;
    }

    // User is available, check their custom claims.
    user.getIdTokenResult(true) // Force refresh to get latest claims
      .then((idTokenResult) => {
        const isAdmin = idTokenResult.claims.admin === true;
        setAdminState({ isAdmin, isLoading: false });
      })
      .catch((error) => {
        console.error("Error getting user admin status:", error);
        setAdminState({ isAdmin: false, isLoading: false });
      });

  }, [user, isUserLoading]);

  return adminState;
}
