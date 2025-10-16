import type { WikiArticle } from '@/lib/types';

export const worldBossesArticle: Omit<WikiArticle, 'createdAt'> = {
  id: 'world-bosses',
  title: 'Guia de Chefes de Mundo',
  summary: 'Um guia completo para todos os chefes de mundo, seus status e o HP necessário para derrotá-los.',
  content: `Este guia fornece uma lista de chefes de Rank-SS e SSS, detalhando o HP necessário para um "one-hit kill".`,
  tags: ['chefes', 'guia', 'dps', 'hp', 'recompensas', 'geral', '1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '13', '15', '16', '17', '19', '20'],
  imageUrl: 'wiki-7',
  tables: {
    ssBosses: {
      headers: ['Mundo', 'Chefe (Rank SS)', 'HP para Hit Kill'],
      rows: [
        { 'Mundo': 1, 'Chefe (Rank SS)': 'Kid Kohan', 'HP para Hit Kill': '2.5qd' },
        { 'Mundo': 2, 'Chefe (Rank SS)': 'Shanks', 'HP para Hit Kill': '5sx' },
        { 'Mundo': 3, 'Chefe (Rank SS)': 'Eizen', 'HP para Hit Kill': '2.5Sp' },
        { 'Mundo': 4, 'Chefe (Rank SS)': 'Sakuni', 'HP para Hit Kill': '120Sp' },
        { 'Mundo': 5, 'Chefe (Rank SS)': 'Rangaki', 'HP para Hit Kill': '31.2de' },
        { 'Mundo': 6, 'Chefe (Rank SS)': 'Statue of God', 'HP para Hit Kill': '195Ud' },
        { 'Mundo': 7, 'Chefe (Rank SS)': 'Novi Chroni', 'HP para Hit Kill': '101tdD' },
        { 'Mundo': 8, 'Chefe (Rank SS)': 'Itechi', 'HP para Hit Kill': '2.82QnD' },
        { 'Mundo': 8, 'Chefe (Rank SS)': 'Madera', 'HP para Hit Kill': '5.64QnD' },
        { 'Mundo': 9, 'Chefe (Rank SS)': 'Ken Turbo', 'HP para Hit Kill': '494sxD' },
        { 'Mundo': 10, 'Chefe (Rank SS)': 'Killas Godspeed', 'HP para Hit Kill': '296OcD' },
        { 'Mundo': 11, 'Chefe (Rank SS)': 'Eran', 'HP para Hit Kill': '49.4Vgn' },
        { 'Mundo': 12, 'Chefe (Rank SS)': 'Esanor', 'HP para Hit Kill': '9.77DVg' },
        { 'Mundo': 13, 'Chefe (Rank SS)': 'Number 8', 'HP para Hit Kill': '5.55qtV' },
        { 'Mundo': 14, 'Chefe (Rank SS)': 'Valzora', 'HP para Hit Kill': '4.79SeV' },
        { 'Mundo': 15, 'Chefe (Rank SS)': 'The Paladin', 'HP para Hit Kill': '967SPG' },
        { 'Mundo': 16, 'Chefe (Rank SS)': 'Dio', 'HP para Hit Kill': '195NVG' },
        { 'Mundo': 17, 'Chefe (Rank SS)': 'Arama', 'HP para Hit Kill': '686UTG' },
        { 'Mundo': 18, 'Chefe (Rank SS)': 'Mr. Chainsaw', 'HP para Hit Kill': '5.09tsTG' },
        { 'Mundo': 19, 'Chefe (Rank SS)': 'Hero of Hell', 'HP para Hit Kill': '50.9qTG' },
        { 'Mundo': 19, 'Chefe (Rank SS)': 'Leonardo', 'HP para Hit Kill': '1.76QnTG' },
        { 'Mundo': '19', 'Chefe (Rank SS)': 'Bansho', 'HP para Hit Kill': '17.6ssTG' },
        { 'Mundo': 20, 'Chefe (Rank SS)': 'Koku SSJ', 'HP para Hit Kill': '1.52NoTG' },
        { 'Mundo': 20, 'Chefe (Rank SSS)': 'Frezi Final Form', 'HP para Hit Kill': '15.2QdDR' },
        { 'Mundo': 21, 'Chefe (Rank SSS)': 'Cifer', 'HP para Hit Kill': '871uQDR' },
        { 'Mundo': 21, 'Chefe (Rank SSS)': 'Vasto Ichge', 'HP para Hit Kill': '8.72tQDR' }
      ]
    }
  }
};
