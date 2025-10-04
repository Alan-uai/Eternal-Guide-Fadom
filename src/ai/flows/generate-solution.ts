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
import { getRaceStats } from '@/firebase/firestore/data';


const getRaceStatsTool = ai.defineTool(
  {
    name: 'getRaceStats',
    description: 'Get the stats for a specific race in the game.',
    inputSchema: z.object({
      raceName: z.string().describe('The name of the race to get stats for.'),
    }),
    outputSchema: z.unknown(),
  },
  async ({ raceName }) => {
    return await getRaceStats(raceName);
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
  tools: [getRaceStatsTool],
  prompt: `You are an expert Anime Eternal game assistant. Your knowledge base is the official game wiki provided below. A player is encountering a problem, and you will generate a potential solution. Use ONLY the information from the wiki to answer the question. If the information is not in the provided wiki context, use the available tools to find the information. If the answer is not in the wiki or available via tools, say that you do not have enough information to answer.

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
