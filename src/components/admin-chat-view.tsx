'use client';

import { Bot, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function AdminChatView() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-3.5rem)]">
       <header className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Canal Direto com a IA</h1>
          <p className="text-muted-foreground">Utilize este chat para solicitar atualizações, correções ou novas funcionalidades.</p>
        </header>

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
    </div>
  );
}
