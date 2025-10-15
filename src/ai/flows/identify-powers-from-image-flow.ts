
'use server';
/**
 * @fileOverview Um fluxo que identifica poderes do jogo a partir de um screenshot.
 *
 * - identifyPowersFromImage - A função principal que lida com a identificação.
 * - IdentifyPowersInput - O tipo de entrada para a função.
 * - IdentifyPowersOutput - O tipo de retorno para a função.
 * - IdentifiedPower - O tipo para um único poder identificado.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { allGameData } from '@/lib/game-data-context';


// Gera um contexto de string com todos os poderes conhecidos para a IA para que ela possa associar o mundo.
const powerKnowledgeContext = allGameData.map(world => 
    `Mundo: ${world.name}\nPoderes:\n${(world.powers || []).map((power: any) => {
        const statsString = (power.stats && Array.isArray(power.stats))
            ? `\n  Status:\n${power.stats.map((stat: any) => 
                `  - ${stat.name} (Raridade: ${stat.rarity})`
              ).join('\n')}`
            : '';
        return `- Nome: ${power.name}${statsString}`;
    }).join('\n')}`
).join('\n\n');

const IdentifiedPowerSchema = z.object({
  name: z.string().describe('O nome exato do poder identificado na imagem.'),
  // A raridade foi removida pois a IA só precisa fornecer o nome.
  // rarity: z.string().describe('A raridade do poder, inferida pela cor da borda ou pelo nome (ex: "Phantom", "Supreme").'),
});
export type IdentifiedPower = z.infer<typeof IdentifiedPowerSchema>;

const IdentifyPowersInputSchema = z.object({
  images: z.array(z.string()).describe("Uma lista de screenshots da tela de poderes, como data URIs."),
});
export type IdentifyPowersInput = z.infer<typeof IdentifyPowersInputSchema>;

const IdentifyPowersOutputSchema = z.object({
  powers: z.array(IdentifiedPowerSchema).describe('Uma lista de todos os nomes de poderes únicos identificados nas imagens.'),
});
export type IdentifyPowersOutput = z.infer<typeof IdentifyPowersOutputSchema>;


export async function identifyPowersFromImage(input: IdentifyPowersInput): Promise<IdentifyPowersOutput> {
  return identifyPowersFlow(input);
}


export const prompt = ai.definePrompt({
  name: 'identifyPowersPrompt',
  input: { schema: IdentifyPowersInputSchema },
  output: { schema: IdentifyPowersOutputSchema },
  prompt: `Você é um especialista em análise de imagem para o jogo Anime Eternal. Sua tarefa é analisar um ou mais screenshots da tela de "Poderes" do jogador e identificar o NOME de cada poder.

**PROCESSO:**

1.  Para cada poder na imagem, extraia apenas o nome exato do poder.
2.  Ignore a raridade, a cor da borda ou qualquer outra informação. Foque APENAS no nome.
3.  Use o **CONHECIMENTO DE PODERES** abaixo como referência para garantir que os nomes extraídos estão corretos e correspondem aos nomes oficiais do jogo.
4.  Retorne uma lista JSON de objetos, onde cada objeto contém apenas a chave "name". Não inclua duplicatas na lista final.

---
INÍCIO DO CONHECIMENTO DE PODERES
${powerKnowledgeContext}
---
FIM DO CONHECIMENTO DE PODERES

Agora, analise as seguintes imagens e extraia apenas os nomes dos poderes:
{{#each images}}
{{media url=this}}
{{/each}}
`,
});


const identifyPowersFlow = ai.defineFlow(
  {
    name: 'identifyPowersFlow',
    inputSchema: IdentifyPowersInputSchema,
    outputSchema: IdentifyPowersOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output || !output.powers) {
        return { powers: [] };
      }
      // Simples filtro de duplicatas para garantir
      const uniquePowers = output.powers.filter(
        (power, index, self) => index === self.findIndex((p) => p.name === power.name)
      );
      return { powers: uniquePowers };
    } catch (error) {
      console.error("Erro no fluxo de identificação de poderes:", error);
      return { powers: [] };
    }
  }
);
