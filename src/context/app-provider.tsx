'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type { Message, WikiArticle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FirebaseClientProvider, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

interface AppContextType {
  savedAnswers: Message[];
  toggleSaveAnswer: (answer: Message) => void;
  isAnswerSaved: (answerId: string) => boolean;
  wikiArticles: WikiArticle[];
  isWikiLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAVED_ANSWERS_STORAGE_KEY = 'eternal-guide-saved-answers';
const WIKI_CACHE_STORAGE_KEY = 'eternal-guide-wiki-cache';

function AppStateProvider({ children }: { children: ReactNode }) {
  const [savedAnswers, setSavedAnswers] = useState<Message[]>([]);
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();
  
  const wikiCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'wikiContent') : null;
  }, [firestore]);

  const { data: firestoreWikiArticles, isLoading: isFirestoreWikiLoading } = useCollection<WikiArticle>(wikiCollectionRef as any);

  useEffect(() => {
    // Load from local storage on mount
    try {
      const savedAnswersItem = window.localStorage.getItem(SAVED_ANSWERS_STORAGE_KEY);
      if (savedAnswersItem) {
        setSavedAnswers(JSON.parse(savedAnswersItem));
      }
      
      const wikiCacheItem = window.localStorage.getItem(WIKI_CACHE_STORAGE_KEY);
      if (wikiCacheItem) {
        setWikiArticles(JSON.parse(wikiCacheItem));
      }
    } catch (error) {
      console.error("Falha ao carregar dados do armazenamento local", error);
    }
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // When firestore data loads, update state and cache if it's different
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

  useEffect(() => {
    // Persist saved answers to local storage
    if (isMounted) {
      try {
        window.localStorage.setItem(SAVED_ANSWERS_STORAGE_KEY, JSON.stringify(savedAnswers));
      } catch (error) {
        console.error("Falha ao salvar respostas no armazenamento local", error);
      }
    }
  }, [savedAnswers, isMounted]);

  const isAnswerSaved = useCallback((answerId: string) => {
    return savedAnswers.some((saved) => saved.id === answerId);
  }, [savedAnswers]);

  const toggleSaveAnswer = useCallback((answer: Message) => {
    setSavedAnswers((prev) => {
      const isSaved = prev.some((saved) => saved.id === answer.id);
      if (isSaved) {
        toast({
          variant: 'default',
          title: "Resposta Removida",
          description: "A resposta foi removida da sua lista salva.",
        });
        return prev.filter((saved) => saved.id !== answer.id);
      } else {
        toast({
          variant: 'default',
          title: "Resposta Salva!",
          description: "Encontre-a na seção 'Respostas Salvas'.",
        });
        return [...prev, answer];
      }
    });
  }, [toast]);
  
  const value = { 
    savedAnswers, 
    toggleSaveAnswer, 
    isAnswerSaved,
    wikiArticles: wikiArticles || [],
    isWikiLoading: isFirestoreWikiLoading && wikiArticles.length === 0, // Only show loading if there's no cache
  };

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

    