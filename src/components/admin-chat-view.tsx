'use client';

import { Bot, User, Send, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminChatView() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-3.5rem)]">
      <header className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Canal Direto com a IA</h1>
        <p className="text-muted-foreground">Utilize este painel para direcionar o desenvolvimento e gerenciar o conteúdo da Wiki.</p>
      </header>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 max-w-md self-start">
          <TabsTrigger value="chat">Conversar com a IA</TabsTrigger>
          <TabsTrigger value="wiki-management">Gerenciar Wiki</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
            <div className="flex-1 overflow-hidden relative">
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
                                    Use o campo abaixo para me dizer o que você precisa. Por exemplo:
                                </p>
                                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>"Adicione uma nova propriedade 'cooldown' à entidade 'PowerStat' no backend.json."</li>
                                    <li>"Corrija o cálculo de DPS na página da calculadora para incluir o bônus do pet."</li>
                                    <li>"Crie um novo artigo na wiki sobre o sistema de 'Rebirth'."</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="border-t p-4 bg-background">
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
        </TabsContent>

        <TabsContent value="wiki-management" className="flex-1 flex flex-col mt-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Gerenciador de Conteúdo da Wiki</CardTitle>
                    <CardDescription>
                        Esta área permitirá a edição, adição e remoção de conteúdo diretamente no banco de dados da Wiki.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                    <Pencil className="h-16 w-16 mb-4" />
                    <h2 className="text-2xl font-semibold">Em Desenvolvimento</h2>
                    <p className="mt-2 max-w-md">
                        Em breve, esta interface permitirá que você gerencie todos os artigos e dados da Wiki de forma visual e interativa.
                    </p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
