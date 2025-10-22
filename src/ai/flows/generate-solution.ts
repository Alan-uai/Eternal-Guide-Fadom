// src/ai/flows/generate-solution.ts
'use server';
/**
 * @fileOverview A flow that generates solutions to Anime Eternal game problems.
 *
 * - generateSolution - A function that generates a potential solution to a described problem.
 * - GenerateSolutionInput - The input type for the generateSolution function.
 * - GenerateSolutionOutput - The return type for the generateSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getGameData } from '@/firebase/firestore/data';


const getGameDataTool = ai.defineTool(
  {
    name: 'getGameData',
    description: 'Get information about game content like powers, NPCs, pets, accessories, or dungeons from a specific world.',
    inputSchema: z.object({
      worldName: z.string().describe('The name of the world to search in (e.g., "World 1", "Windmill Island").'),
      category: z.string().describe('The category of information to get (e.g., "powers", "npcs", "pets", "accessories", "dungeons").'),
      itemName: z.string().optional().describe('The specific name of the item to look for (e.g., "Grand Elder Power"). Be flexible; if an exact match fails, try a partial name.'),
    }),
    outputSchema: z.unknown(),
  },
  async ({ worldName, category, itemName }) => {
    return await getGameData(worldName, category, itemName);
  }
);

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const UserProfileSchema = z.object({
    stats: z.any().optional().describe("Estatísticas gerais do usuário, como rank, dano, etc."),
    powers: z.array(z.any()).optional().describe("Poderes que o usuário possui."),
    auras: z.array(z.any()).optional().describe("Auras que o usuário possui."),
    pets: z.array(z.any()).optional().describe("Pets que o usuário possui."),
    weapons: z.array(z.any()).optional().describe("Armas que o usuário possui."),
    fighters: z.array(z.any()).optional().describe("Lutadores (Titãs, Stands, etc.) que o usuário possui."),
    accessories: z.array(z.any()).optional().describe("Acessórios que o usuário possui."),
    gamepasses: z.array(z.any()).optional().describe("Gamepasses que o usuário possui."),
}).optional();


const GenerateSolutionInputSchema = z.object({
  problemDescription: z.string().describe('A description of the player is encountering in Anime Eternal.'),
  wikiContext: z.string().describe('The entire content of the game wiki to be used as a knowledge base.'),
  userProfile: UserProfileSchema.describe("O perfil do usuário, contendo suas estatísticas e itens equipados. Use isso para personalizar as respostas."),
  history: z.array(MessageSchema).optional().describe('The previous messages in the conversation.'),
});
export type GenerateSolutionInput = z.infer<typeof GenerateSolutionInputSchema>;

const GenerateSolutionOutputSchema = z.object({
  structuredResponse: z
    .string()
    .describe(
      'Uma string JSON de um array de objetos. Cada objeto deve ter: `marcador` ("texto_introdutorio", "inicio", "meio", "fim"), `titulo` (string), e `conteudo` (string, formatado em Markdown).'
    ),
});

export type GenerateSolutionOutput = z.infer<typeof GenerateSolutionOutputSchema>;

export async function generateSolution(input: GenerateSolutionInput): Promise<GenerateSolutionOutput> {
  return generateSolutionFlow(input);
}

export async function generateSolutionStream(input: GenerateSolutionInput) {
    try {
        const { stream } = await prompt.stream(input);
        
        return new ReadableStream({
            async start(controller) {
                let previousText = '';
                for await (const chunk of stream) {
                    const currentText = chunk.output?.structuredResponse;
                    if (currentText) {
                        // Compare the current text with the previous one to find the new part.
                        const newText = currentText.substring(previousText.length);
                        if (newText) {
                            controller.enqueue(new TextEncoder().encode(newText));
                        }
                        previousText = currentText; // Update the previous text
                    }
                }
                controller.close();
            }
        });
    } catch (error) {
        console.error("Erro no fluxo de geração de solução (stream):", error);
        return new ReadableStream({
            start(controller) {
                const errorObject = {
                    structuredResponse: JSON.stringify([{
                        marcador: 'texto_introdutorio',
                        titulo: 'Erro',
                        conteudo: 'Desculpe, não consegui processar sua pergunta. Tente reformulá-la.'
                    }])
                };
                controller.enqueue(new TextEncoder().encode(JSON.stringify(errorObject)));
                controller.close();
            }
        });
    }
}

export const prompt = ai.definePrompt({
  name: 'generateSolutionPrompt',
  input: {schema: GenerateSolutionInputSchema},
  output: {schema: GenerateSolutionOutputSchema},
  tools: [getGameDataTool],
  prompt: `Você é um assistente especialista no jogo Anime Eternal e também uma calculadora estratégica. Sua resposta DEVE ser em Português-BR.

**ESTRUTURA DA RESPOSTA (JSON OBRIGATÓRIO):**
Sua resposta DEVE ser uma string JSON de um array de objetos. Cada objeto representa uma seção da resposta.

**Estrutura de cada objeto JSON:**
- \`marcador\`: Use "texto_introdutorio", "inicio", "meio", ou "fim".
- \`titulo\`: O título da seção (ex: "Resposta Direta", "Justificativa e Detalhes", "Dicas Adicionais").
- \`conteudo\`: O conteúdo da seção em formato Markdown.

**REGRAS DE ESTRUTURAÇÃO DO JSON:**
1.  **SEMPRE** comece com um objeto com \`marcador: "texto_introdutorio"\`. O conteúdo deste objeto é a resposta direta e a solução para a pergunta do usuário. O título pode ser "Solução Direta".
2.  A seguir, crie um ou mais objetos com \`marcador: "meio"\`. Use estes para a justificativa, os detalhes, os cálculos e as explicações. Dê a eles títulos claros como "Justificativa e Detalhes" ou "Cálculo de Tempo".
3.  Se aplicável, termine com um ou mais objetos com \`marcador: "fim"\`. Use para dicas extras, estratégias de longo prazo, etc. Dê a eles títulos como "Dicas Adicionais".
4.  **NÃO USE "INICIO" COMO MARCADOR.** A resposta direta agora está no "texto_introdutorio".
5.  **A SAÍDA FINAL DEVE SER UM ÚNICO OBJETO JSON**, com uma única chave "structuredResponse" contendo a string JSON do array. **EXEMPLO DE SAÍDA FINAL:** {"structuredResponse": "[{\\"marcador\\":\\"texto_introdutorio\\",\\"titulo\\":\\"Solução Direta\\",\\"conteudo\\":\\"Conteúdo...\\"}]"}


### Estratégia Principal de Raciocínio
1.  **INTEGRE OS DADOS DO PERFIL DO USUÁRIO:** Se o \`userProfile\` for fornecido, use-o como a principal fonte de verdade sobre o progresso do jogador.
    *   **Para Cálculos:** Se a pergunta envolver tempo ou dano (ex: "quanto tempo para derrotar X?"), use o \`userProfile.stats.totalDamage\` como base para seus cálculos.
    *   **Para Estratégias:** Se a pergunta for sobre "como melhorar", "o que pegar", etc., **compare** os itens que o usuário já possui (\`userProfile.powers\`, \`userProfile.auras\`, etc.) com os itens disponíveis no mundo dele (usando a ferramenta \`getGameData\`). Sua sugestão DEVE focar nos itens que ele **ainda não tem**.
    *   Se o perfil do usuário não for fornecido, dê conselhos gerais e sugira que ele preencha o perfil para obter ajuda personalizada.

2.  **ANALISE O WIKI:** Use o \`wikiContext\` para entender o vocabulário do jogador e os conceitos do jogo. Faça conexões entre os termos do usuário e os nomes oficiais no jogo (ex: "Raid Green" é a "Green Planet Raid", "mundo de nanatsu" é o Mundo 13).

3.  **USE A FERRAMENTA 'getGameData' SEMPRE QUE POSSÍVEL.** Após ter uma compreensão do tópico, use a ferramenta para buscar estatísticas detalhadas de itens do mundo relevante. Não dê sugestões genéricas como "pegue poderes melhores". Em vez disso, use a ferramenta para listar OS NOMES ESPECÍFICOS dos poderes, acessórios, pets, etc., que podem ajudar, especialmente aqueles que o usuário não possui, de acordo com o \`userProfile\`.

4.  **SEJA PRECISO SOBRE CHEFES:** Se a pergunta for sobre um "chefe", PRIORIZE buscar por um NPC com rank 'SS' ou 'SSS'. Só considere um chefe de uma 'dungeon' ou 'raid' se o usuário mencionar explicitamente essas palavras. Se um item tiver um \`videoUrl\`, inclua-o na resposta como um link Markdown, por exemplo: \`[Ver Localização em Vídeo](url_do_video)\`.

5.  **Use o histórico da conversa (history) para entender o contexto principal (como o mundo em que o jogador está) e para resolver pronomes (como "ela" ou "isso").** No entanto, sua resposta deve focar-se estritamente na pergunta mais recente do usuário. Não repita dicas de perguntas anteriores, a menos que sejam diretamente relevantes para a nova pergunta.

6.  **Regra da Comunidade para Avançar de Mundo:** Se o usuário perguntar sobre o "DPS para sair do mundo", a regra da comunidade é: **pegar a vida (HP) do NPC de Rank S do mundo atual e dividir por 10**. Como você não tem o HP dos NPCs em sua base de dados, instrua o usuário a encontrar o NPC de Rank S no jogo, verificar o HP dele e fazer o cálculo.

### REGRAS DE CÁLCULO E FORMATAÇÃO (OBRIGATÓRIO)
- O dano base de um jogador é igual à sua energia total. Isso pode ser modificado por poderes.
- **DANO DE LUTADORES (Titans, Stands, Shadows):** O dano desses lutadores **JÁ ESTÁ INCLUÍDO** no DPS que o jogador vê no jogo. **NUNCA** calcule o dano de um lutador e o adicione ao DPS total do jogador.
- A gamepass "fast click" dá ao jogador 4 cliques por segundo. O DPS total deve ser calculado como (Dano * 4).
- Ao apresentar números de energia ou dano, você DEVE usar a notação científica do jogo. Consulte o artigo "Abreviações de Notação Científica" para usar as abreviações corretas.
- Ao listar poderes ou itens, você DEVE especificar seus bônus.

Se a resposta não estiver nas ferramentas ou no wiki, gere um JSON com um único objeto de erro.

{{#if userProfile}}
INÍCIO DO PERFIL DO USUÁRIO
\`\`\`json
{{{jsonStringify userProfile}}}
\`\`\`
FIM DO PERFIL DO USUÁRIO
{{/if}}

INÍCIO DO CONTEÚDO DO WIKI
{{{wikiContext}}}
FIM DO CONTEÚDO DO WIKI

{{#if history}}
HISTÓRICO DA CONVERSA:
{{#each history}}
- {{role}}: {{content}}
{{/each}}
{{/if}}

Descrição do Problema: {{{problemDescription}}}`,
});


const generateSolutionFlow = ai.defineFlow(
  {
    name: 'generateSolutionFlow',
    inputSchema: GenerateSolutionInputSchema,
    outputSchema: GenerateSolutionOutputSchema,
  },
  async input => {
    // Helper para registrar a função jsonStringify se não existir
    ai.handlebars.registerHelper('jsonStringify', function(context) {
        return JSON.stringify(context);
    });
    
    const fallbackResponse = {
        structuredResponse: JSON.stringify([{
            marcador: 'texto_introdutorio',
            titulo: 'Sem Resposta',
            conteudo: 'Desculpe, não consegui gerar uma resposta. Por favor, tente reformular sua pergunta.'
        }])
    };

    try {
      const {output} = await prompt(input);
      if (!output || !output.structuredResponse) {
        return fallbackResponse;
      }
      return output;
    } catch (error) {
      console.error("Erro no fluxo de geração de solução:", error);
      return fallbackResponse;
    }
  }
);
