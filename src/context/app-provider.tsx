'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState, useEffect, useMemo } from 'react';
import type { Message, SavedAnswer, WikiArticle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FirebaseClientProvider, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { Loader2 } from 'lucide-react';


interface AppContextType {
  savedAnswers: SavedAnswer[];
  toggleSaveAnswer: (answer: Message) => void;
  isAnswerSaved: (answerId: string) => boolean;
  wikiArticles: WikiArticle[];
  isWikiLoading: boolean;
  isAuthDialogOpen: boolean;
  setAuthDialogOpen: (open: boolean) => void;
  gameDataVersion: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const WIKI_CACHE_STORAGE_KEY = 'eternal-guide-wiki-cache';
const LAST_VISITED_ROUTE_KEY = 'eternal-guide-last-route';

function AppStateProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>([]);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  
  const [isInitialAppLoad, setIsInitialAppLoad] = useState(true);

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin')) {
      localStorage.setItem(LAST_VISITED_ROUTE_KEY, pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isAdminLoading && isInitialAppLoad) {
      const lastRoute = localStorage.getItem(LAST_VISITED_ROUTE_KEY);
      if (lastRoute && pathname !== lastRoute && !pathname.startsWith('/admin')) {
        router.replace(lastRoute);
      }
      setIsInitialAppLoad(false);
    }
  }, [isAdmin, isAdminLoading, isInitialAppLoad, router, pathname]);


  const wikiCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'wikiContent') : null;
  }, [firestore]);

  const savedAnswersCollectionRef = useMemoFirebase(() => {
    return firestore && user && !user.isAnonymous ? collection(firestore, `users/${user.uid}/savedAnswers`) : null;
  }, [firestore, user]);

  const gameDataRef = useMemoFirebase(() => {
    return firestore ? doc(firestore, 'metadata', 'gameData') : null;
  }, [firestore]);


  const { data: firestoreWikiArticles, isLoading: isFirestoreWikiLoading } = useCollection<WikiArticle>(wikiCollectionRef as any);
  const { data: savedAnswers, isLoading: areSavedAnswersLoading } = useCollection<SavedAnswer>(savedAnswersCollectionRef as any);
  const { data: gameMetadata, isLoading: isMetadataLoading } = useDoc(gameDataRef);
  
  const gameDataVersion = useMemo(() => gameMetadata?.version || '1.0.0', [gameMetadata]);

  useEffect(() => {
    try {
      const wikiCacheItem = window.localStorage.getItem(WIKI_CACHE_STORAGE_KEY);
      if (wikiCacheItem) {
        setWikiArticles(JSON.parse(wikiCacheItem));
      }
    } catch (error) {
      console.error("Falha ao carregar wiki do armazenamento local", error);
    }
  }, []);
  
  useEffect(() => {
    if (firestoreWikiArticles && firestoreWikiArticles.length > 0) {
       const hasChanged = JSON.stringify(firestoreWikiArticles) !== JSON.stringify(wikiArticles);
       if (hasChanged) {
         setWikiArticles(firestoreWikiArticles);
         try {
            window.localStorage.setItem(WIKI_CACHE_STORAGE_KEY, JSON.stringify(firestoreWikiArticles));
         } catch(error) {
            console.error("Falha ao salvar wiki no armazenamento local", error);
         }
       }
    }
  }, [firestoreWikiArticles, wikiArticles]);

  const isAnswerSaved = useCallback((answerId: string) => {
    return !!savedAnswers && savedAnswers.some((saved) => saved.id === answerId);
  }, [savedAnswers]);

  const toggleSaveAnswer = useCallback(async (answer: Message) => {
    if (!user || user.isAnonymous) {
      toast({
        variant: 'destructive',
        title: 'Ação necessária',
        description: 'Você precisa estar logado para salvar respostas.',
      });
      setAuthDialogOpen(true);
      return;
    }
    if (!firestore) return;

    const answerRef = doc(firestore, `users/${user.uid}/savedAnswers`, answer.id);

    if (isAnswerSaved(answer.id)) {
      await deleteDoc(answerRef);
      toast({
        variant: 'default',
        title: "Resposta Removida",
        description: "A resposta foi removida da sua lista salva.",
      });
    } else {
      await setDoc(answerRef, {
        id: answer.id,
        userId: user.uid,
        question: answer.question || '',
        answer: answer.content,
        createdAt: serverTimestamp(),
      });
      toast({
        variant: 'default',
        title: "Resposta Salva!",
        description: "Encontre-a na seção 'Respostas Salvas'.",
      });
    }
  }, [user, firestore, isAnswerSaved, toast, setAuthDialogOpen]);
  
  const value = { 
    savedAnswers: savedAnswers || [], 
    toggleSaveAnswer, 
    isAnswerSaved,
    wikiArticles: wikiArticles || [],
    isWikiLoading: (isFirestoreWikiLoading || areSavedAnswersLoading || isMetadataLoading) && wikiArticles.length === 0,
    isAuthDialogOpen,
    setAuthDialogOpen,
    gameDataVersion,
  };
  
  if (isInitialAppLoad || isAdminLoading) {
      return (
          <div className="flex h-screen w-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </FirebaseClientProvider>
  )
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}

    