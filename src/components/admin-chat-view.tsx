'use client';

import { Bot, User, Send, Pencil, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

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
          <TabsTrigger value="wiki-management">
            Gerenciar Wiki
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm" side="top" align="center">
                        <h4 className="font-bold mb-2">Como Estruturar Informações para a IA</h4>
                        <p className="mb-2">Ao adicionar ou atualizar conteúdo, siga estas regras para garantir que a IA consiga entender e usar os dados:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>IDs Únicos:</strong> Cada item (poder, NPC, artigo) deve ter um `id` único em letras minúsculas e separado por hífen (ex: `grand-elder-power`).</li>
                            <li><strong>Tabelas Estruturadas:</strong> Para tabelas de dados (como ranks ou stats), use o formato `tables` com `headers` (uma lista de strings) e `rows` (uma lista de objetos).</li>
                            <li><strong>Notação do Jogo:</strong> Use as abreviações de números do jogo (k, M, B, T, qd, etc.) para valores de energia, HP e EXP.</li>
                            <li><strong>Consistência é Chave:</strong> Mantenha os nomes das propriedades (`statType`, `rarity`, `multiplier`) consistentes com os dados já existentes.</li>
                        </ul>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
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
                        Esta área será seu Sistema de Gerenciamento de Conteúdo (CMS) para a Wiki. Use-a como um atalho para me pedir para adicionar, atualizar ou remover informações que a IA utiliza.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                    <Pencil className="h-16 w-16 mb-4" />
                    <h2 className="text-2xl font-semibold">Em Desenvolvimento</h2>
                    <p className="mt-2 max-w-md mb-4">
                        Aqui você terá uma interface visual para gerenciar todos os artigos e dados da Wiki de forma interativa.
                    </p>
                    <div className='text-left bg-background/50 p-4 rounded-lg border max-w-lg w-full'>
                        <h3 className='font-semibold mb-2'>Próximos Passos:</h3>
                        <ul className='text-sm space-y-1 list-decimal list-inside'>
                            <li>Listar todos os arquivos de dados da Wiki (ex: `world-1-data.ts`, `wiki-data.ts`).</li>
                            <li>Permitir a visualização do conteúdo de cada arquivo.</li>
                            <li>Criar formulários para editar, adicionar e excluir itens (poderes, NPCs, artigos, etc.).</li>
                            <li>Conectar as ações de salvamento para atualizar o Firestore diretamente.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
