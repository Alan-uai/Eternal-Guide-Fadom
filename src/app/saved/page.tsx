'use client';

import { useApp } from '@/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Trash2, Inbox } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Metadata } from 'next';
import Head from 'next/head';


export default function SavedAnswersPage() {
  const { savedAnswers, toggleSaveAnswer } = useApp();

  return (
    <>
      <Head>
        <title>Saved Answers - Eternal Guide</title>
      </Head>
      <div className="space-y-6">
         <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Saved Answers</h1>
            <p className="text-muted-foreground">Your collection of useful solutions from the AI assistant.</p>
        </header>
        
        {savedAnswers.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              {savedAnswers.map((answer) => (
                <Card key={answer.id}>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      <Bot className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">AI Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{answer.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toggleSaveAnswer(answer)}
                      className="bg-accent/80 text-accent-foreground hover:bg-accent"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Unsave
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12 h-96">
            <Inbox className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-semibold">No Saved Answers Yet</h2>
            <p className="mt-2">Use the bookmark icon in the chat to save useful answers for later.</p>
          </div>
        )}
      </div>
    </>
  );
}
