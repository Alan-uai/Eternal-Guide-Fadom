'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSolution } from '@/ai/flows/generate-solution';
import { Bot, User, Send, Loader2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-provider';
import type { Message } from '@/lib/types';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

const chatSchema = z.object({
  prompt: z.string().min(1, 'A mensagem não pode estar vazia.'),
});

function AssistantMessage({ content }: { content: string }) {
  // Split the content into lines to handle multiple lists properly
  const lines = content.split('\n').filter(line => line.trim() !== '');

  const renderedLines = lines.map((line, index) => {
    // Check if the line is a list item (starts with * or -)
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      // Remove the list marker for display
      const itemContent = trimmedLine.substring(2).trim();
      return <li key={index}>{itemContent}</li>;
    }
    // Check if the line is a header (ends with a colon)
    if (trimmedLine.endsWith(':') && !trimmedLine.startsWith('*') && !trimmedLine.startsWith('-')) {
        return <strong key={index} className="block mt-2">{trimmedLine}</strong>;
    }
    // Otherwise, it's a regular paragraph or sentence
    return <p key={index}>{line}</p>;
  });
  
  const groupedElements = [];
  let currentList = [];
  
  for (let i = 0; i < renderedLines.length; i++) {
      const line = renderedLines[i];
      if (line.type === 'li') {
          currentList.push(line);
      } else {
          if (currentList.length > 0) {
              groupedElements.push(<ul key={`ul-${i - currentList.length}`} className="list-disc pl-5 space-y-1">{currentList}</ul>);
              currentList = [];
          }
          groupedElements.push(line);
      }
  }

  if (currentList.length > 0) {
      groupedElements.push(<ul key={`ul-${renderedLines.length - currentList.length}`} className="list-disc pl-5 space-y-1">{currentList}</ul>);
  }

  return <div className="space-y-2">{groupedElements}</div>;
}


export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { toggleSaveAnswer, isAnswerSaved, wikiArticles, isWikiLoading } = useApp();
  const scrollAreaViewport = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { prompt: '' },
  });

  const scrollToBottom = () => {
    if (scrollAreaViewport.current) {
      scrollAreaViewport.current.scrollTop = scrollAreaViewport.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSubmit(values: z.infer<typeof chatSchema>) {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: values.prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    try {
      // Pass the wiki articles as context to the AI
      const wikiContext = wikiArticles.map(article => `Title: ${article.title}\nContent: ${article.content}`).join('\n\n---\n\n');
      const result = await generateSolution({ problemDescription: values.prompt, wikiContext });
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.potentialSolution,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao gerar solução:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao obter uma resposta da IA. Por favor, tente novamente.',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  }

  const isSendDisabled = isLoading || isWikiLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6 space-y-6" ref={scrollAreaViewport}>
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground pt-16">
                <Bot className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-2xl font-semibold">Bem-vindo ao Guia Eterno</h2>
                <p className="mt-2">Pergunte-me qualquer coisa sobre o Anime Eternal! A wiki é minha base de conhecimento.</p>
                {isWikiLoading && <p className="mt-2 text-sm flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Carregando a wiki...</p>}
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-9 w-9 border border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xl rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <AssistantMessage content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}

                  {message.role === 'assistant' && (
                     <Button
                        variant="ghost"
                        size="icon"
                        className="mt-2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => toggleSaveAnswer(message)}
                      >
                        <Bookmark className={cn('h-4 w-4', isAnswerSaved(message.id) && 'fill-primary text-primary')} />
                      </Button>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border border-primary/50">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg bg-card p-3 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 bg-background">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={isWikiLoading ? "Por favor espere, aprendendo com a wiki..." : "ex: Como eu derroto o Titã Sombrio?"}
                      className="resize-none"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !isSendDisabled) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      disabled={isSendDisabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isSendDisabled} className="bg-primary hover:bg-primary/90">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
