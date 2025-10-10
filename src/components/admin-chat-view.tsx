'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Bot, Send, BookOpen } from 'lucide-react';
import { micromark } from 'micromark';
import { useMemo } from 'react';
import { ScrollArea } from './ui/scroll-area';

const userGuide = `
# Guia de Comandos para a IA

Este guia fornece exemplos de como me instruir para realizar tarefas de desenvolvimento no seu projeto. Use estes padrões para garantir que eu entenda suas solicitações com clareza.

---

### 1. Modificando a Estrutura de Dados (\`backend.json\`)

Para alterar as entidades de dados do seu aplicativo, seja específico sobre a entidade e as propriedades.

**Exemplo para adicionar um campo:**
> "Adicione uma nova propriedade 'cooldown' à entidade 'PowerStat' no backend.json. Ela deve ser do tipo 'string' e a descrição deve ser 'O cooldown do ataque'."

**Exemplo para criar uma nova entidade:**
> "Crie uma nova entidade chamada 'Guild' em \`backend.json\`. Ela deve ter as propriedades 'id' (string), 'name' (string) e 'memberCount' (number)."

---

### 2. Trabalhando com Componentes React

Para criar ou modificar componentes, especifique o caminho do arquivo e os detalhes da implementação.

**Exemplo para criar um componente:**
> "Crie um novo componente de botão em \`src/components/ui/special-button.tsx\`. Ele deve usar Radix e ter uma variante de cor roxa."

**Exemplo para modificar um componente:**
> "Na página \`src/app/page.tsx\`, altere o título principal de 'Bem-vindo' para 'Bem-vindo ao Guia Eterno'."

---

### 3. Editando o Conteúdo da Wiki

Você pode me pedir para criar, modificar ou popular os dados estáticos que são usados para preencher o Firestore.

**Exemplo para criar um novo artigo estático:**
> "Crie um novo arquivo de dados em \`src/lib/world-23-data.ts\`. Ele deve exportar um objeto chamado \`world23Data\` com a propriedade \`name\` definida como 'World 23 - Chaos Realm'."

**Exemplo para adicionar dados a um artigo existente:**
> "No arquivo \`src/lib/world-1-data.ts\`, adicione um novo NPC à lista de \`npcs\`. O nome deve ser 'Mystic Trader', rank 'A', e exp 10."

---

### 4. Corrigindo Bugs

Ao relatar um bug, descreva o comportamento inesperado e, se possível, o comportamento esperado. Mencionar o arquivo relevante ajuda muito.

**Exemplo de correção de bug:**
> "Na página da calculadora em \`src/app/calculator/page.tsx\`, o cálculo de DPS não está incluindo o bônus do pet. Corrija a fórmula para multiplicar o dano final pelo bônus de energia do pet selecionado."

---

### 5. Termos Técnicos Comuns

*   **Entidade:** Refere-se a uma definição de objeto em \`backend.json\` (ex: "entidade User").
*   **Propriedade:** Um campo dentro de uma entidade (ex: "propriedade \`email\`").
*   **Componente:** Um arquivo React (\`.tsx\`) que renderiza uma parte da UI.
*   **Página:** Um arquivo \`page.tsx\` dentro do diretório \`src/app\`.
*   **Fluxo (Flow):** Uma função de IA definida com Genkit (ex: "o fluxo \`generateSolution\`").
*   **Coleção / Sub-coleção:** Refere-se a um caminho no Firestore.
`;


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
