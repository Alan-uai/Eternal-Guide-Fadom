'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  savedAnswers: Message[];
  toggleSaveAnswer: (answer: Message) => void;
  isAnswerSaved: (answerId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'eternal-guide-saved-answers';

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedAnswers, setSavedAnswers] = useState<Message[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        setSavedAnswers(JSON.parse(item));
      }
    } catch (error) {
      console.error("Failed to load saved answers from local storage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedAnswers));
      } catch (error) {
        console.error("Failed to save answers to local storage", error);
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
          title: "Answer Unsaved",
          description: "Removed from your saved list.",
        });
        return prev.filter((saved) => saved.id !== answer.id);
      } else {
        toast({
          variant: 'default',
          title: "Answer Saved!",
          description: "Find it in the 'Saved Answers' section.",
        });
        return [...prev, answer];
      }
    });
  }, [toast]);
  
  const value = { savedAnswers, toggleSaveAnswer, isAnswerSaved };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
