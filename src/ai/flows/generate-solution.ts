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
      itemName: z.string().optional().describe('The specific name of the item to look for (e.g., "Grand Elder Power").'),
    }),
    outputSchema: z.unknown(),
  },
  async ({ worldName, category, itemName }) => {
    return await getGameData(worldName, category, itemName);
  }
);


const GenerateSolutionInputSchema = z.object({
  problemDescription: z.string().describe('A description of the player is encountering in Anime Eternal.'),
  wikiContext: z.string().describe('The entire content of the game wiki to be used as a knowledge base.'),
});
export type GenerateSolutionInput = z.infer<typeof GenerateSolutionInputSchema>;

const GenerateSolutionOutputSchema = z.object({
  potentialSolution: z.string().describe('A potential solution to the described problem.'),
});
export type GenerateSolutionOutput = z.infer<typeof GenerateSolutionOutputSchema>;

export async function generateSolution(input: GenerateSolutionInput): Promise<GenerateSolutionOutput> {
  return generateSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionPrompt',
  input: {schema: GenerateSolutionInputSchema},
  output: {schema: GenerateSolutionOutputSchema},
  tools: [getGameDataTool],
  prompt: `Você é um assistente especialista no jogo Anime Eternal e também uma calculadora. Sua resposta DEVE ser em Português-BR.

Você DEVE usar a ferramenta 'getGameData' para encontrar informações sobre itens do jogo, como poderes, NPCs, pets e acessórios. Não confie no contexto do wiki para obter estatísticas de itens específicos, como multiplicadores.

Ao listar poderes, você DEVE especificar qual status eles multiplicam.
- Para poderes de 'gacha', especifique o status de cada nível (por exemplo, "energia" ou "dano").
- Para poderes de 'progression', se for 'mixed', liste todos os bônus (ex: '1.01x Damage, 1.11x Energy'). Para outros, apenas o 'maxBoost'.
Formate a resposta como uma lista clara e legível.

O jogo tem 21 mundos, cada um com conteúdo exclusivo. Você deve entender e usar as seguintes mecânicas de jogo para seus cálculos:
- O dano base de um jogador é igual à sua energia total. Isso pode ser modificado por poderes.
- A gamepass "fast click" dá ao jogador 4 cliques por segundo. O DPS total deve ser calculado como (Dano * 4).
- Para responder a perguntas de cálculo (por exemplo, "quanto tempo para derrotar um chefe"), você deve detalhar o problema:
  1. Encontre a energia do jogador para o rank fornecido no artigo do wiki 'Rank System'.
  2. Encontre o HP total do chefe no artigo do wiki 'World Boss Guide'.
  3. Calcule o Dano Total por Segundo (DPS) do jogador, levando em conta gamepasses como 'fast click'.
  4. Calcule o tempo para derrotar o chefe (HP do Chefe / DPS do Jogador).
  5. Explique seu cálculo ao usuário.

Use as ferramentas disponíveis primeiro para encontrar as informações. Se a ferramenta não fornecer a resposta, você pode usar as informações do contexto do wiki abaixo. Se a resposta não estiver nas ferramentas ou no wiki, diga que você não tem informações suficientes para responder.

INÍCIO DO CONTEÚDO DO WIKI
{{{wikiContext}}}
FIM DO CONTEÚDO DO WIKI

Descrição do Problema: {{{problemDescription}}}`,
});

const generateSolutionFlow = ai.defineFlow(
  {
    name: 'generateSolutionFlow',
    inputSchema: GenerateSolutionInputSchema,
    outputSchema: GenerateSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { potentialSolution: "Desculpe, não consegui encontrar uma resposta para sua pergunta. Por favor, tente reformular a pergunta ou verifique se as informações existem no wiki ou nos dados do jogo." };
    }
    return output;
  }
);

    