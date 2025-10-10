'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Bot, Send, BookOpen } from 'lucide-react';
import { micromark } from 'micromark';
import userGuide from '@/../docs/user-guide.md';
import { useMemo } from 'react';
import { ScrollArea } from './ui/scroll-area';

function RulesGuide() {
    const htmlContent = useMemo(() => micromark(userGuide), []);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen />
                    Guia de Comandos da IA
                </CardTitle>
                <CardDescription>
                    Use estes exemplos para me dar instruções.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </ScrollArea>
            </CardContent>
        </Card>
    )
}


export function AdminChatView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className='lg:col-span-1 h-full min-h-0'>
                <RulesGuide />
            </div>

            <div className="lg:col-span-1 flex flex-col h-full border rounded-xl overflow-hidden">
                <header className="p-4 border-b">
                    <h1 className="text-lg font-semibold tracking-tight font-headline">Canal Direto com a IA</h1>
                    <p className="text-sm text-muted-foreground">Utilize este painel para me dar instruções e direcionar o desenvolvimento.</p>
                </header>

                 <div className="flex-1 overflow-auto relative">
                    <div className="p-4 md:p-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/20 text-primary p-2 rounded-full border border-primary/50">
                                <Bot size={20} />
                            </div>
                            <Card className="max-w-2xl">
                                <CardHeader>
                                    <CardTitle className='text-lg'>Assistente de Desenvolvimento</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Olá! Sou seu parceiro de codificação AI. Estou pronto para ajudar.</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Use o campo abaixo para me dizer o que você precisa. Consulte o guia ao lado para exemplos.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="border-t p-4 bg-background/50">
                    <div className="flex items-center gap-4">
                        <div className='flex-1 relative'>
                            <Textarea
                                placeholder="Digite sua solicitação aqui..."
                                className="resize-none pr-12"
                            />
                            <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90">
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Enviar</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
