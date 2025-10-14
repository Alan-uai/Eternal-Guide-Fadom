'use server';
/**
 * @fileOverview Um fluxo que analisa uma resposta negativa da IA e sugere melhorias.
 *
 * - analyzeNegativeFeedback - Uma função que analisa o feedback.
 * - AnalyzeNegativeFeedbackInput - O tipo de entrada para a função.
 * - AnalyzeNegativeFeedbackOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { prompt as generateSolutionPrompt } from './generate-solution';

const AnalyzeNegativeFeedbackInputSchema = z.object({
  question: z.string().describe('A pergunta original do usuário.'),
  negativeResponse: z.string().describe('A resposta da IA que foi marcada como negativa.'),
});
export type AnalyzeNegativeFeedbackInput = z.infer<typeof AnalyzeNegativeFeedbackInputSchema>;

const AnalyzeNegativeFeedbackOutputSchema = z.object({
  suggestion: z.string().describe('Uma sugestão para o administrador sobre como melhorar a resposta da IA.'),
});
export type AnalyzeNegativeFeedbackOutput = z.infer<typeof AnalyzeNegativeFeedbackOutputSchema>;

export async function analyzeNegativeFeedback(input: AnalyzeNegativeFeedbackInput): Promise<AnalyzeNegativeFeedbackOutput> {
  return analyzeNegativeFeedbackFlow(input);
}

// Re-utilizando o prompt principal como a "base de conhecimento" do que é uma boa resposta.
const mainPromptTemplate = generateSolutionPrompt.prompt;

const prompt = ai.definePrompt({
  name: 'analyzeNegativeFeedbackPrompt',
  input: {schema: AnalyzeNegativeFeedbackInputSchema},
  output: {schema: AnalyzeNegativeFeedbackOutputSchema},
  prompt: `Você é um engenheiro de IA especialista em análise de qualidade de respostas de LLMs para o jogo Anime Eternal. Sua tarefa é analisar uma resposta que foi marcada como negativa por um usuário e fornecer uma sugestão clara e acionável para um administrador sobre como melhorar o prompt ou os dados.

**Contexto:**
A IA tem acesso a um prompt principal com regras muito estritas. Analise a resposta negativa à luz dessas regras.

**Regras do Prompt Principal (Resumidas):**
${mainPromptTemplate}

---

**Sua Tarefa:**

1.  **Analise a Pergunta do Usuário e a Resposta Negativa abaixo.**
2.  **Compare a resposta com as regras do prompt principal.** A IA seguiu as regras? Ela usou as ferramentas? Ela foi específica? Ela fez os cálculos corretamente?
3.  **Identifique a Falha Principal.** Determine o motivo mais provável para a resposta ter sido marcada como negativa. (Ex: "Foi genérica", "Não listou itens específicos", "Faltou os cenários de tempo", "Cálculo incorreto").
4.  **Gere uma Sugestão Acionável.** Forneça uma sugestão clara para um administrador.

**Exemplo de Sugestão:**
"A IA deu uma resposta genérica sobre 'pegar poderes melhores'. Para a pergunta 'qual o melhor poder para o Mundo 4', a IA deveria ter usado a ferramenta 'getGameData' para buscar e listar os nomes dos poderes específicos do Mundo 4, como 'Curses' e 'Cursed Power', e comparar seus bônus."

---

**Pergunta do Usuário:**
"{{{question}}}"

**Resposta Negativa da IA:**
"{{{negativeResponse}}}"

Agora, forneça sua análise e sugestão.`,
});

const analyzeNegativeFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeNegativeFeedbackFlow',
    inputSchema: AnalyzeNegativeFeedbackInputSchema,
    outputSchema: AnalyzeNegativeFeedbackOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output || !output.suggestion) {
        return { suggestion: "Não foi possível gerar uma sugestão de melhoria." };
      }
      return output;
    } catch (error) {
      console.error("Erro no fluxo de análise de feedback negativo:", error);
      return { suggestion: "Ocorreu um erro ao analisar o feedback." };
    }
  }
);
