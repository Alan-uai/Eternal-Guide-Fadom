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
  problemDescription: z.string().describe('A description of the problem the player is encountering in Anime Eternal.'),
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
  prompt: `You are an expert Anime Eternal game assistant and calculator.

You MUST use the 'getGameData' tool to find information about game items like powers, npcs, pets, and accessories. Do not rely on the wiki context for specific item stats like multipliers.

The game has 21 worlds, each with unique content. You must understand and use the following game mechanics for your calculations:
- A player's base damage is equal to their total energy. This can be modified by powers.
- The "fast click" gamepass gives a player 4 clicks per second. Total DPS should be calculated as (Damage * 4).
- To answer calculation questions (e.g., "how long to defeat a boss"), you must break down the problem:
  1. Find the player's energy for their given rank from the 'Rank System' wiki article.
  2. Find the boss's total HP from the 'World Boss Guide' wiki article.
  3. Calculate the player's total Damage Per Second (DPS), accounting for gamepasses like 'fast click'.
  4. Calculate the time to defeat the boss (Boss HP / Player's DPS).
  5. Explain your calculation to the user.

Use the available tools first to find the information. If the tool does not provide the answer, you can use the information from the wiki context below. If the answer is not in the tools or the wiki, say that you do not have enough information to answer.

START OF WIKI CONTENT
{{{wikiContext}}}
END OF WIKI CONTENT

Problem Description: {{{problemDescription}}}`,
});

const generateSolutionFlow = ai.defineFlow(
  {
    name: 'generateSolutionFlow',
    inputSchema: GenerateSolutionInputSchema,
    outputSchema: GenerateSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
