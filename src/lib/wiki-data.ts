
import type { WikiArticle } from '@/lib/types';

export const gettingStartedArticle: WikiArticle = {
    id: 'getting-started',
    title: 'Começando no Anime Eternal',
    summary: "Um guia para iniciantes para começar sua aventura no mundo do Anime Eternal.",
    content: `Bem-vindo ao Anime Eternal! Este guia irá guiá-lo através das principais características do Mundo 1, o hub central do jogo.

**Criação de Personagem e Primeira Missão**
Primeiro, você precisa escolher sua classe inicial: Guerreiro, Mago ou Ladino. Cada classe tem habilidades únicas. Sua primeira missão será dada pelo Ancião da Vila em Vento Argênteo, que lhe ensinará a se mover, combater e interagir com o mundo.

**Principais Atividades no Mundo 1:**
*   **Placares de Líderes Globais:** Confira os melhores jogadores do mundo e veja sua posição.
*   **Subir de Rank e Nível de Avatar:** O Mundo 1 é onde você aumentará seu Rank e o nível de seus avatares.
*   **Baús e Missões Diárias:** Encontre e colete baús e complete missões diárias para obter recompensas valiosas.
*   **Dungeon do Mundo - Torneio:** Sua primeira dungeon específica do mundo é o Torneio, que vai até a Sala 550.
*   **Lobby de Dungeons:** Acesse uma variedade de dungeons especiais, que são diferentes das dungeons encontradas em cada mundo. As Dungeons do Lobby incluem: Fácil, Média, Difícil, Insana, Louca, Pesadelo e Folha. Outra está chegando em breve!`,
    tags: ['iniciante', 'guia', 'novo jogador', 'classe', 'mundo 1', 'geral', '1'],
    imageId: 'wiki-1',
};

export const auraArticle: WikiArticle = {
    id: 'aura-system',
    title: 'Sistema de Auras',
    summary: 'Aprenda sobre Auras de Chefes de Rank-SS, como desbloqueá-las e como elas melhoram suas habilidades.',
    content: `Auras são buffs poderosos dropados por Chefes de Rank-SS em vários mundos. Cada Aura fornece um bônus de status único. Aqui está uma lista de Auras conhecidas e seus status:

*   **Mundo 1 (Kid Kohan):** Aura da Sorte (10% de Sorte de Estrela)
*   **Mundo 2 (Shanks):** Aura do Imperador Vermelho (0.1x)
*   **Mundo 3 (Eizen):** Aura do Traidor Roxo (0.25x)
*   **Mundo 4 (Sakuni):** Aura do Rei do Fogo (25% de Drops)
*   **Mundo 5 (Rangoki):** Aura Flamejante (0.15x)
*   **Mundo 6 (Statue of God):** Aura da Estátua (0.75x)
*   **Mundo 8 (Itechi/Madera):** Aura da Folha (25% de Sorte de Estrela)
*   **Mundo 10 (Ken Turbo):** Aura Energética (1.5x)
*   **Mundo 13 (Esanor):** Aura Monstruosa (2.0x)
*   **Mundo 15 (The Paladin):** Aura Virtual (35% de Drops)
*   **Mundo 16 (Dio):** Aura de Hamon (10% de Exp)
*   **Mundo 17 (Arama):** Aura de Ghoul (1.0x)
*   **Mundo 19 (Leonardo):** Aura do Capitão de Fogo (1.5x)`,
    tags: ['aura', 'poder', 'habilidades', 'buffs', 'drop de chefe', 'sistema', 'geral'],
    imageId: 'wiki-2',
};

export const legendaryWeaponsArticle: WikiArticle = {
    id: 'legendary-weapons',
    title: 'Fabricação de Armas Lendárias',
    summary: 'Descubra os segredos para forjar as armas mais poderosas do jogo.',
    content: 'Armas lendárias são o auge do equipamento em Anime Eternal. Fabricar uma é uma jornada longa e árdua que requer materiais raros, um alto nível de fabricação e uma forja especial.\n\nOs materiais necessários, conhecidos como "Fragmentos Celestiais", são dropados por chefes de mundo e podem ser encontrados nas masmorras mais profundas. Você precisará de 100 fragmentos, juntamente com outros componentes raros, para tentar uma fabricação. A forja está localizada no pico do Monte Celestia. Cuidado, o caminho é traiçoeiro.',
    tags: ['fabricação', 'armas', 'lendário', 'endgame', 'guia', 'geral'],
    imageId: 'wiki-3',
};

export const guildWarsArticle: WikiArticle = {
    id: 'guild-wars',
    title: 'Uma Introdução às Guerras de Guildas',
    summary: 'Junte-se à sua guilda e lute pela supremacia e recompensas raras.',
    content: 'Guerras de Guildas são eventos semanais onde guildas competem entre si em batalhas PvP em grande escala. Para participar, você deve ser membro de uma guilda com pelo menos 10 membros.\n\nAs guerras ocorrem todo sábado. O objetivo é capturar e manter pontos de controle em um mapa especial. A guilda com mais pontos no final do evento vence. Guildas vitoriosas recebem recompensas exclusivas, incluindo cosméticos raros, equipamentos poderosos e uma quantidade significativa de moeda do jogo.',
    tags: ['guilda', 'pvp', 'evento', 'equipe', 'guia', 'geral'],
    imageId: 'wiki-4',
};

export const prestigeArticle: WikiArticle = {
    id: 'prestige-system',
    title: 'Sistema de Prestígio',
    summary: 'Entenda como prestigiar para aumentar seu limite de nível e ganhar mais poder.',
    content: `O sistema de Prestígio permite que os jogadores resetem seu nível em troca de bônus permanentes poderosos. Veja como funciona:`,
    tags: ['prestígio', 'nível', 'endgame', 'status', 'sistema', 'geral'],
    imageId: 'wiki-5',
    tables: {
      prestigeLevels: {
        headers: ['Prestígio', 'Nível Requerido', 'Novo Limite de Nível', 'Pontos de Status por Nível', 'Multiplicador de Exp'],
        rows: [
          { 'Prestígio': 1, 'Nível Requerido': 200, 'Novo Limite de Nível': 210, 'Pontos de Status por Nível': 2, 'Multiplicador de Exp': '0.1x' },
          { 'Prestígio': 2, 'Nível Requerido': 210, 'Novo Limite de Nível': 220, 'Pontos de Status por Nível': 3, 'Multiplicador de Exp': '0.2x' },
          { 'Prestígio': 3, 'Nível Requerido': 220, 'Novo Limite de Nível': 230, 'Pontos de Status por Nível': 4, 'Multiplicador de Exp': '0.3x' },
          { 'Prestígio': 4, 'Nível Requerido': 230, 'Novo Limite de Nível': 250, 'Pontos de Status por Nível': 5, 'Multiplicador de Exp': '0.4x' },
          { 'Prestígio': 5, 'Nível Requerido': 250, 'Novo Limite de Nível': 270, 'Pontos de Status por Nível': 6, 'Multiplicador de Exp': '0.5x' },
        ]
      }
    }
};

export const rankArticle: WikiArticle = {
    id: 'rank-system',
    title: 'Sistema de Ranks',
    summary: 'Uma referência para a energia necessária para alcançar cada rank no jogo.',
    content: `Subir de rank é uma parte central da progressão no Anime Eternal. Cada rank requer uma certa quantidade de energia para ser alcançado. Abaixo está uma tabela detalhando a energia necessária para cada rank.`,
    tags: ['rank', 'progressão', 'energia', 'status', 'sistema', 'geral'],
    imageId: 'wiki-6',
    tables: {
      ranks: {
        headers: ['Rank', 'Energia'],
        rows: [
            { Rank: 1, Energia: '9k' }, { Rank: 2, Energia: '45k' }, { Rank: 3, Energia: '243.03k' },
            { Rank: 4, Energia: '1.41M' }, { Rank: 5, Energia: '8.75M' }, { Rank: 6, Energia: '57.84M' },
            { Rank: 7, Energia: '405.18M' }, { Rank: 8, Energia: '3B' }, { Rank: 9, Energia: '23.39B' },
            { Rank: 10, Energia: '116.96B' }, { Rank: 11, Energia: '631.36B' }, { Rank: 12, Energia: '1.07T' },
            { Rank: 13, Energia: '2.52T' }, { Rank: 14, Energia: '14.99T' }, { Rank: 15, Energia: '154.95T' },
            { Rank: 16, Energia: '776.49T' }, { Rank: 17, Energia: '7.06qd' }, { Rank: 18, Energia: '90.32qd' },
            { Rank: 19, Energia: '1.04Qn' }, { Rank: 20, Energia: '9.49Qn' }, { Rank: 21, Energia: '58.84Qn' },
            { Rank: 22, Energia: '388.50Qn' }, { Rank: 23, Energia: '2.72sx' }, { Rank: 24, Energia: '20.14sx' },
            { Rank: 25, Energia: '157.16sx' }, { Rank: 26, Energia: '785.79sx' }, { Rank: 27, Energia: '4.24Sp' },
            { Rank: 28, Energia: '24.61Sp' }, { Rank: 29, Energia: '152.63Sp' }, { Rank: 30, Energia: '1.01O' },
            { Rank: 31, Energia: '7.05O' }, { Rank: 32, Energia: '52.15O' }, { Rank: 33, Energia: '407.01O' },
            { Rank: 34, Energia: '2.04N' }, { Rank: 35, Energia: '11.01N' }, { Rank: 36, Energia: '63.80N' },
            { Rank: 37, Energia: '395.72N' }, { Rank: 38, Energia: '2.61de' }, { Rank: 39, Energia: '18.29de' },
            { Rank: 40, Energia: '135.46de' }, { Rank: 41, Energia: '1.06Ud' }, { Rank: 42, Energia: '5.28Ud' },
            { Rank: 43, Energia: '28.53Ud' }, { Rank: 44, Energia: '165.50Ud' }, { Rank: 45, Energia: '1.03DD' },
            { Rank: 46, Energia: '6.77DD' }, { Rank: 47, Energia: '47.40DD' }, { Rank: 48, Energia: '351.06DD' },
            { Rank: 49, Energia: '2.74tdD' }, { Rank: 50, Energia: '13.71tdD' }, { Rank: 51, Energia: '74.00tdD' },
            { Rank: 52, Energia: '429.34tdD' }, { Rank: 53, Energia: '2.66qdD' }, { Rank: 54, Energia: '17.57qdD' },
            { Rank: 55, Energia: '85.29qdD' }, { Rank: 56, Energia: '910.22qdD' }, { Rank: 57, Energia: '4.10QnD' },
            { Rank: 58, Energia: '8.20QnD' }, { Rank: 59, Energia: '48.00QnD' }, { Rank: 60, Energia: '336.00QnD' },
            { Rank: 61, Energia: '4.90sxD' }, { Rank: 62, Energia: '45.59sxD' }, { Rank: 63, Energia: '319.31sxD' },
            { Rank: 64, Energia: '2.36 SpD' }, { Rank: 65, Energia: '18.41 SpD' }, { Rank: 66, Energia: '92.06 SpD' },
            { Rank: 67, Energia: '497.12SpD' }, { Rank: 68, Energia: '2.89OcD' }, { Rank: 69, Energia: '17.92OcD' },
            { Rank: 70, Energia: '118.360OcD' }, { Rank: 71, Energia: '828.38OcD' }, { Rank: 72, Energia: '6.13NvD' },
            { Rank: 73, Energia: '47.81NvD' }, { Rank: 74, Energia: '239.06NvD' }, { Rank: 75, Energia: '1.29Vgn' },
            { Rank: 76, Energia: '7.49Vgn' }, { Rank: 77, Energia: '46.41Vgn' }, { Rank: 78, Energia: '306.38Vgn' },
            { Rank: 79, Energia: '2.15Uvg' }, { Rank: 80, Energia: '16.00Uvg' }, { Rank: 81, Energia: '124.80 Uvg' },
            { Rank: 82, Energia: '748.80 Uvg' }, { Rank: 83, Energia: '4.79 DVg' }, { Rank: 84, Energia: '32.59 DVg' },
            { Rank: 85, Energia: '234.63 DVg' }, { Rank: 86, Energia: '100 TVg' }, { Rank: 87, Energia: '1 qtV' },
            { Rank: 88, Energia: '15 qtV' }, { Rank: 89, Energia: '50 qtV' }, { Rank: 90, Energia: '250 qtV' },
            { Rank: 91, Energia: '2 QnV' }, { Rank: 92, Energia: '10 QnV' }, { Rank: 93, Energia: '50 QnV' },
            { Rank: 94, Energia: '500 QnV' }, { Rank: 95, Energia: '5 SeV' }, { Rank: 96, Energia: '500 SeV' },
            { Rank: 97, Energia: '25 SPG' }, { Rank: 98, Energia: '250 SPG' }, { Rank: 99, Energia: '2.5 OVG' },
            { Rank: 100, Energia: '100 OVG' }, { Rank: 101, Energia: '750 OVG' }, { Rank: 102, Energia: '3 NVG' },
            { Rank: 103, Energia: '30 NVG' }, { Rank: 104, Energia: '250 NVG' }, { Rank: 105, Energia: '1 TGN' },
        ],
      },
    },
};

export const worldBossesArticle: WikiArticle = {
  id: 'world-bosses',
  title: 'Guia de Chefes de Mundo',
  summary: 'Um guia completo para todos os chefes de mundo, seus status e o HP necessário para derrotá-los.',
  content: `Este guia fornece uma lista de chefes de Rank-SS e SSS, detalhando o HP necessário para um "one-hit kill".`,
  tags: ['chefes', 'guia', 'dps', 'hp', 'recompensas', 'geral', '1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '13', '15', '16', '17', '19', '20'],
  imageId: 'wiki-7',
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


export const swordsArticle: WikiArticle = {
  id: 'energy-swords',
  title: 'Espadas de Energia',
  summary: 'Um guia para as espadas que fornecem um multiplicador de energia, onde encontrá-las e seus status.',
  content: 'Espadas de energia são armas especiais que aumentam sua energia total com base em seu nível. Elas são encontradas em diferentes mundos.',
  tags: ['espadas', 'energia', 'arma', 'guia', 'geral', '3', '5', '15', '19'],
  imageId: 'wiki-8',
  tables: {
    world3: {
      headers: ['Espada (Mundo 3 - Ichige)', 'Stats'],
      rows: [
        { 'Espada (Mundo 3 - Ichige)': 'Zangetsu', 'Stats': '0.05x' },
        { 'Espada (Mundo 3 - Ichige)': 'Zangetsu (1 Estrela)', 'Stats': '0.1x' },
        { 'Espada (Mundo 3 - Ichige)': 'Zangetsu (2 Estrelas)', 'Stats': '0.15x' },
        { 'Espada (Mundo 3 - Ichige)': 'Zangetsu (3 Estrelas)', 'Stats': '0.25x' },
      ],
    },
    world5: {
      headers: ['Espada (Mundo 5 - Zentsu)', 'Stats'],
      rows: [
        { 'Espada (Mundo 5 - Zentsu)': 'Yellow Nichirin', 'Stats': '0.075x' },
        { 'Espada (Mundo 5 - Zentsu)': 'Yellow Nichirin (1 Estrela)', 'Stats': '0.15x' },
        { 'Espada (Mundo 5 - Zentsu)': 'Yellow Nichirin (2 Estrelas)', 'Stats': '0.225x' },
        { 'Espada (Mundo 5 - Zentsu)': 'Yellow Nichirin (3 Estrelas)', 'Stats': '0.375x' },
      ],
    },
    world15: {
        headers: ['Espada (Mundo 15 - Beater)', 'Stats'],
        rows: [
            { 'Espada (Mundo 15 - Beater)': 'Lucidator', 'Stats': '0.125x' },
            { 'Espada (Mundo 15 - Beater)': 'Lucidator (1 Estrela)', 'Stats': '0.250x' },
            { 'Espada (Mundo 15 - Beater)': 'Lucidator (2 Estrelas)', 'Stats': '0.375x' },
            { 'Espada (Mundo 15 - Beater)': 'Lucidator (3 Estrelas)', 'Stats': '0.625x' },
        ],
    },
    world19: {
        headers: ['Espada (Mundo 19 - Arter)', 'Stats'],
        rows: [
            { 'Espada (Mundo 19 - Arter)': 'Excalibur', 'Stats': '0.2x' },
            { 'Espada (Mundo 19 - Arter)': 'Excalibur (1 Estrela)', 'Stats': '0.4x' },
            { 'Espada (Mundo 19 - Arter)': 'Excalibur (2 Estrelas)', 'Stats': '0.6x' },
            { 'Espada (Mundo 19 - Arter)': 'Excalibur (3 Estrelas)', 'Stats': '1x' },
        ],
    }
  },
};

export const damageSwordsArticle: WikiArticle = {
  id: 'damage-swords',
  title: 'Espadas de Dano (Evolução)',
  summary: 'Um guia para as espadas de dano e seus multiplicadores em cada nível de evolução (estrela).',
  content: 'Espadas de dano aumentam seu poder de ataque. A cada evolução (nível de estrela), o multiplicador de dano aumenta significativamente.',
  tags: ['espadas', 'dano', 'arma', 'guia', 'geral', 'evolução'],
  imageId: 'wiki-9',
  tables: {
    damageSwords: {
      headers: ['Espada', 'Stats (Base)', 'Stats (1 Estrela)', 'Stats (2 Estrelas)', 'Stats (3 Estrelas)'],
      rows: [
        { 'Espada': 'Bloodthorn', 'Stats (Base)': '0.25x', 'Stats (1 Estrela)': '0.5x', 'Stats (2 Estrelas)': '0.75x', 'Stats (3 Estrelas)': '1.25x' },
        { 'Espada': 'Eclipse Warden', 'Stats (Base)': '0.45x', 'Stats (1 Estrela)': '0.9x', 'Stats (2 Estrelas)': '1.35x', 'Stats (3 Estrelas)': '2.25x' },
        { 'Espada': 'Obsidian Reaver', 'Stats (Base)': '0.75x', 'Stats (1 Estrela)': '1.5x', 'Stats (2 Estrelas)': '2.25x', 'Stats (3 Estrelas)': '3.75x' },
        { 'Espada': 'Aquarius Edge', 'Stats (Base)': '1x', 'Stats (1 Estrela)': '2x', 'Stats (2 Estrelas)': '3x', 'Stats (3 Estrelas)': '5x' },
        { 'Espada': 'Doomsoul', 'Stats (Base)': '1.25x', 'Stats (1 Estrela)': '2.5x', 'Stats (2 Estrelas)': '3.75x', 'Stats (3 Estrelas)': '6.25x' },
        { 'Espada': 'Redmourne', 'Stats (Base)': '1.5x', 'Stats (1 Estrela)': '3x', 'Stats (2 Estrelas)': '4.5x', 'Stats (3 Estrelas)': '7.5x' },
        { 'Espada': 'Venomstrike', 'Stats (Base)': '2x', 'Stats (1 Estrela)': '4x', 'Stats (2 Estrelas)': '6x', 'Stats (3 Estrelas)': '10x' },
      ],
    },
  },
};

export const world20RaidsArticle: WikiArticle = {
  id: 'world-20-raids',
  title: 'Raids do Mundo 20',
  summary: 'Requisitos de energia para as raids "Green Planet" e "Suffering" no Mundo 20.',
  content: 'Este guia detalha a quantidade de energia necessária para passar por ondas específicas nas raids do Mundo 20.',
  tags: ['raid', 'guia', 'mundo 20', 'energia', '20', 'geral'],
  imageId: 'wiki-10',
  tables: {
    raids: {
      headers: ['Wave', 'Green Planet Raid', 'Suffering Raid'],
      rows: [
        { 'Wave': '10', 'Green Planet Raid': '494 - qnTG', 'Suffering Raid': '200 - OcTG' },
        { 'Wave': '20', 'Green Planet Raid': '1.19 - ssTG', 'Suffering Raid': '600 - NoTG' },
        { 'Wave': '30', 'Green Planet Raid': '3.12 - ssTG', 'Suffering Raid': '---' },
        { 'Wave': '40', 'Green Planet Raid': '7.53 - ssTG', 'Suffering Raid': '---' },
        { 'Wave': '50', 'Green Planet Raid': '21.4 - ssTG', 'Suffering Raid': '---' },
        { 'Wave': '100', 'Green Planet Raid': '2.5 - spTG', 'Suffering Raid': '---' },
        { 'Wave': '115', 'Green Planet Raid': '10.1 - spTG', 'Suffering Raid': '---' },
        { 'Wave': '130', 'Green Planet Raid': '45.1 - spTG', 'Suffering Raid': '---' },
        { 'Wave': '150', 'Green Planet Raid': '286 - spTG', 'Suffering Raid': '---' },
        { 'Wave': '175', 'Green Planet Raid': '2.94 - OcTG', 'Suffering Raid': '---' },
        { 'Wave': '200', 'Green Planet Raid': '35.9 - OcTG', 'Suffering Raid': '---' },
      ]
    }
  }
};

export const raidRequirementsArticle: WikiArticle = {
  id: 'raid-requirements',
  title: 'Requisitos de Energia para Raids',
  summary: 'Um guia completo com os requisitos de energia para passar por diferentes ondas em várias raids e dungeons do jogo.',
  content: 'Este guia consolida a energia necessária para progredir nas principais raids e dungeons do Anime Eternal.',
  tags: ['raid', 'dungeon', 'energia', 'guia', 'geral'],
  imageId: 'wiki-11',
  tables: {
    requirements: {
      headers: ['Wave', 'Tournament Raid', 'Restaurant Raid', 'Cursed Raid', 'Leaf Raid', 'Progression Raid', 'Titan Defense', 'Raid Sins', 'Kaiju Dungeon', 'Progression Raid 2', 'Ghoul Raid', 'Chainsaw Defense', 'Nether World Raid', 'Green Planet Raid'],
      rows: [
        { 'Wave': 50, 'Tournament Raid': '10 QD', 'Restaurant Raid': '750 T', 'Cursed Raid': '500 QN', 'Leaf Raid': '500 UD', 'Progression Raid': '500 DD', 'Titan Defense': '300 SXD', 'Raid Sins': '111 OCD', 'Kaiju Dungeon': '500 UVG', 'Progression Raid 2': '200 QNV', 'Ghoul Raid': '600 SPG', 'Chainsaw Defense': '230 TGN', 'Nether World Raid': '6 TSTG', 'Green Planet Raid': '21.4 - ssTG' },
        { 'Wave': 100, 'Tournament Raid': '11 N', 'Restaurant Raid': '140 QD', 'Cursed Raid': '140 QD', 'Leaf Raid': '5 DD', 'Progression Raid': '62 TDD', 'Titan Defense': '20 SPD', 'Raid Sins': '13 NVD', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '24 SEV', 'Ghoul Raid': '70 OVG', 'Chainsaw Defense': '27 UTG', 'Nether World Raid': '40 QTTG', 'Green Planet Raid': '2.5 - spTG' },
        { 'Wave': 200, 'Tournament Raid': '14 NVD', 'Restaurant Raid': '2 SX', 'Cursed Raid': '860 SP', 'Leaf Raid': '75 TDD', 'Progression Raid': '900 QDD', 'Titan Defense': '250 OCD', 'Raid Sins': '200 VGN', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '333 SPG', 'Ghoul Raid': '1 TGN', 'Chainsaw Defense': '375 DTG', 'Nether World Raid': '//////', 'Green Planet Raid': '35.9 - OcTG' },
        { 'Wave': 300, 'Tournament Raid': '17 NVG', 'Restaurant Raid': '27,5 SP', 'Cursed Raid': '12 N', 'Leaf Raid': '1 QND', 'Progression Raid': '12 SXD', 'Titan Defense': '10 VGN', 'Raid Sins': '2 DVG', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '5 NVG', 'Ghoul Raid': '13 UTG', 'Chainsaw Defense': '5 QTTG', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 500, 'Tournament Raid': '????', 'Restaurant Raid': '5 DE', 'Cursed Raid': '2,25 DD', 'Leaf Raid': '200 SPG', 'Progression Raid': '2,25 NVD', 'Titan Defense': '650 DVG', 'Raid Sins': '10 OVG', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '900 UTG', 'Ghoul Raid': '2,5 QTTG', 'Chainsaw Defense': '1 SPTG', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 750, 'Tournament Raid': '//////', 'Restaurant Raid': '110 TDD', 'Cursed Raid': '500 QND', 'Leaf Raid': '4,5 UVG', 'Progression Raid': '50 DVG', 'Titan Defense': '15 SEV', 'Raid Sins': '200 UTG', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '20 QNTG', 'Ghoul Raid': '55 SPTG', 'Chainsaw Defense': '22 QDDR', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 1000, 'Tournament Raid': '//////', 'Restaurant Raid': '2,5 SPD', 'Cursed Raid': '1,1 NVD', 'Leaf Raid': '95 QTV', 'Progression Raid': '1 SEV', 'Titan Defense': '350 NVG', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '500 OCTG', 'Ghoul Raid': '2 UQDR', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 1200, 'Tournament Raid': '//////', 'Restaurant Raid': '//////', 'Cursed Raid': '//////', 'Leaf Raid': '18 SPG', 'Progression Raid': '//////', 'Titan Defense': '//////', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '//////', 'Ghoul Raid': '//////', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 1400, 'Tournament Raid': '//////', 'Restaurant Raid': '//////', 'Cursed Raid': '//////', 'Leaf Raid': '3,5 TGN', 'Progression Raid': '//////', 'Titan Defense': '//////', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '//////', 'Ghoul Raid': '//////', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 1600, 'Tournament Raid': '//////', 'Restaurant Raid': '//////', 'Cursed Raid': '//////', 'Leaf Raid': '650 DTG', 'Progression Raid': '//////', 'Titan Defense': '//////', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '//////', 'Ghoul Raid': '//////', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 1800, 'Tournament Raid': '//////', 'Restaurant Raid': '//////', 'Cursed Raid': '//////', 'Leaf Raid': '100 QNTG', 'Progression Raid': '//////', 'Titan Defense': '//////', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '//////', 'Ghoul Raid': '//////', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
        { 'Wave': 2000, 'Tournament Raid': '//////', 'Restaurant Raid': '//////', 'Cursed Raid': '//////', 'Leaf Raid': '35 OCTG', 'Progression Raid': '//////', 'Titan Defense': '//////', 'Raid Sins': '//////', 'Kaiju Dungeon': '//////', 'Progression Raid 2': '//////', 'Ghoul Raid': '//////', 'Chainsaw Defense': '//////', 'Nether World Raid': '//////', 'Green Planet Raid': '?????' },
      ]
    }
  }
};

export const gamepassTierListArticle: WikiArticle = {
  id: 'gamepass-tier-list',
  title: 'Tier List de Gamepasses',
  summary: 'Uma tier list da comunidade para as gamepasses, classificando-as da mais para a menos útil para jogadores novos e de endgame.',
  content: `Esta tier list classifica as gamepasses disponíveis no jogo com base em sua utilidade geral e impacto. A lista é dividida em duas partes: uma para novos jogadores e outra para jogadores de endgame.

### Sugestões para Novos Jogadores

Estas são sugestões, não uma lista imposta a seguir.

### Se você está no Endgame

Estas são as gamepasses que você deve ter no endgame.`,
  tags: ['gamepass', 'tier list', 'endgame', 'compra', 'guia', 'geral'],
  imageId: 'wiki-12',
  tables: {
    newPlayerTiers: {
      headers: ['Tier', 'Gamepass', 'Recomendação'],
      rows: [
        { Tier: 'S', Gamepass: 'Fast Click, Fast Roll, Fast Star, 2x Damage', Recomendação: 'Estes são os passes mais importantes. Você deve comprá-los primeiro.' },
        { Tier: 'A', Gamepass: '+3 Champions Equip, +2 Champions Equip, Double Weapon Equip', Recomendação: 'Depois de ter os primeiros passes, compre estes a seguir.' },
        { Tier: 'B', Gamepass: '2x EXP, VIP, Extra Stand, Remote Gacha', Recomendação: 'Você precisará desses passes para progredir mais rápido no futuro.' },
        { Tier: 'C', Gamepass: '2x Soul, +2 Gacha, +5 Star Open, 2x Coin, Super Luck, Extra Luck, Lucky', Recomendação: 'Esses passes não são necessários, mas dão um bom bônus. Compre-os somente depois de todos os outros.' },
        { Tier: 'D', Gamepass: '+10 Backpack Space, +20 Backpack Space', Recomendação: 'Não vale a pena. Compre por último se realmente quiser.' },
        { Tier: '!', Gamepass: 'Extra Titan, Extra Shadow', Recomendação: 'Não compre esses passes até desbloquear os Titan Fighters no Mundo 11 e os Stand Fighters no Mundo 16.' },
      ],
    },
    endgameTiers: {
      headers: ['Tier', 'Gamepass', 'Recomendação'],
      rows: [
        { Tier: 'S', Gamepass: 'Fast Click, Fast Roll, Fast Star, 2x Damage, 2x Energy, Triple Weapon Equip, Extra Titan, Extra Shadow', Recomendação: 'Deve ter no endgame.' },
        { Tier: 'A', Gamepass: '+3 Champions Equip, +2 Champions Equip, 2x EXP, VIP, Extra Stand, Remote Gacha, 2x Coin', Recomendação: 'Deveria ter para um progresso mais rápido.' },
        { Tier: 'B', Gamepass: '2x Soul, +2 Gacha, +5 Star Open, Super Luck, Extra Luck, Lucky', Recomendação: 'Principalmente Qualidade de Vida e economia de tempo.' },
        { Tier: 'C', Gamepass: '+10 Backpack Space, +20 Backpack Space', Recomendação: 'Não é realmente necessário, mas é bom ter no endgame.' },
      ],
    }
  },
};

export const scientificNotationArticle: WikiArticle = {
  id: 'scientific-notation',
  title: 'Abreviações de Notação Científica',
  summary: 'Um guia de referência para as abreviações de números grandes usadas no jogo.',
  content: 'Entender as abreviações para números grandes é crucial para medir seu poder e o HP dos inimigos. Aqui está um guia completo.',
  tags: ['notação', 'abreviação', 'números', 'guia', 'geral'],
  imageId: 'wiki-13',
  tables: {
    notation1: {
      headers: ['Abreviação', 'Nome', 'Notação Científica'],
      rows: [
        { Abreviação: 'k', Nome: 'Thousand', 'Notação Científica': '1.00E+003' },
        { Abreviação: 'M', Nome: 'Million', 'Notação Científica': '1.00E+006' },
        { Abreviação: 'B', Nome: 'Billion', 'Notação Científica': '1.00E+009' },
        { Abreviação: 'T', Nome: 'Trillion', 'Notação Científica': '1.00E+012' },
        { Abreviação: 'qd', Nome: 'Quadrillion', 'Notação Científica': '1.00E+015' },
        { Abreviação: 'Qn', Nome: 'Quintillion', 'Notação Científica': '1.00E+018' },
        { Abreviação: 'sx', Nome: 'Sextillion', 'Notação Científica': '1.00E+021' },
        { Abreviação: 'Sp', Nome: 'Septillion', 'Notação Científica': '1.00E+024' },
        { Abreviação: 'O', Nome: 'Octillion', 'Notação Científica': '1.00E+027' },
        { Abreviação: 'N', Nome: 'Nonillion', 'Notação Científica': '1.00E+030' },
      ],
    },
    notation2: {
        headers: ['Abreviação', 'Nome (Decillion)', 'Notação Científica'],
        rows: [
            { Abreviação: 'de', Nome: 'Decillion', 'Notação Científica': '1.00E+033' },
            { Abreviação: 'Ud', Nome: 'Undecillion', 'Notação Científica': '1.00E+036' },
            { Abreviação: 'dD', Nome: 'Duodecillion', 'Notação Científica': '1.00E+039' },
            { Abreviação: 'tD', Nome: 'Tredecillion', 'Notação Científica': '1.00E+042' },
            { Abreviação: 'qdD', Nome: 'Quattuordecillion', 'Notação Científica': '1.00E+045' },
            { Abreviação: 'QnD', Nome: 'Quindecillion', 'Notação Científica': '1.00E+048' },
            { Abreviação: 'sxD', Nome: 'Sexdecillion', 'Notação Científica': '1.00E+051' },
            { Abreviação: 'SpD', Nome: 'Septendecillion', 'Notação Científica': '1.00E+054' },
            { Abreviação: 'OcD', Nome: 'Octodecillion', 'Notação Científica': '1.00E+057' },
            { Abreviação: 'NvD', Nome: 'Novemdecillion', 'Notação Científica': '1.00E+060' },
        ]
    },
    notation3: {
        headers: ['Abreviação', 'Nome (Vigintillion)', 'Notação Científica'],
        rows: [
            { Abreviação: 'Vgn', Nome: 'Vigintillion', 'Notação Científica': '1.00E+063' },
            { Abreviação: 'UVg', Nome: 'Unvigintillion', 'Notação Científica': '1.00E+066' },
            { Abreviação: 'DVg', Nome: 'Duovigintillion', 'Notação Científica': '1.00E+069' },
            { Abreviação: 'TVg', Nome: 'Tresvigintillion', 'Notação Científica': '1.00E+072' },
            { Abreviação: 'qtV', Nome: 'Quattuorvigintillion', 'Notação Científica': '1.00E+075' },
            { Abreviação: 'QnV', Nome: 'Quinvigintillion', 'Notação Científica': '1.00E+078' },
            { Abreviação: 'SeV', Nome: 'Sesvigintillion', 'Notação Científica': '1.00E+081' },
            { Abreviação: 'SPG', Nome: 'Septenvigintillion', 'Notação Científica': '1.00E+084' },
            { Abreviação: 'OVG', Nome: 'Octovigintillion', 'Notação Científica': '1.00E+087' },
            { Abreviação: 'NVG', Nome: 'Novemvigintillion', 'Notação Científica': '1.00E+090' },
        ]
    },
    notation4: {
        headers: ['Abreviação', 'Nome (Trigintillion)', 'Notação Científica'],
        rows: [
            { Abreviação: 'TGN', Nome: 'Trigintillion', 'Notação Científica': '1.00E+093' },
            { Abreviação: 'UTG', Nome: 'Untrigintillion', 'Notação Científica': '1.00E+096' },
            { Abreviação: 'DTG', Nome: 'Duotrigintillion', 'Notação Científica': '1.00E+099' },
            { Abreviação: 'tsTG', Nome: 'Trestrigintillion', 'Notação Científica': '1.00E+102' },
            { Abreviação: 'qTG', Nome: 'Quattuortrigintillion', 'Notação Científica': '1.00E+105' },
            { Abreviação: 'QnTG', Nome: 'Quintrigintillion', 'Notação Científica': '1.00E+108' },
            { Abreviação: 'ssTG', Nome: 'Sestrigintillion', 'Notação Científica': '1.00E+111' },
            { Abreviação: 'SpTG', Nome: 'Septentrigintillion', 'Notação Científica': '1.00E+114' },
            { Abreviação: 'OcTG', Nome: 'Octotrigintillion', 'Notação Científica': '1.00E+117' },
            { Abreviação: 'NoTG', Nome: 'Noventrigintillion', 'Notação Científica': '1.00E+120' },
        ]
    },
    notation5: {
        headers: ['Abreviação', 'Nome (Quadragintillion)', 'Notação Científica'],
        rows: [
            { Abreviação: 'QDR', Nome: 'Quadragintillion', 'Notação Científica': '1.00E+123' },
            { Abreviação: 'uQDR', Nome: 'Unquadragintillion', 'Notação Científica': '1.00E+126' },
            { Abreviação: 'dQDR', Nome: 'Duoquadragintillion', 'Notação Científica': '1.00E+129' },
            { Abreviação: 'tQDR', Nome: 'Tresquadragintillion', 'Notação Científica': '1.00E+132' },
            { Abreviação: 'qdQDR', Nome: 'Quattuorquadragintillion', 'Notação Científica': '1.00E+135' },
            { Abreviação: 'QnQDR', Nome: 'Quinquadragintillion', 'Notação Científica': '1.00E+138' },
            { Abreviação: 'sxQDR', Nome: 'Sesquadragintillion', 'Notação Científica': '1.00E+141' },
            { Abreviação: 'SpQDR', Nome: 'Septenquadragintillion', 'Notação Científica': '1.00E+144' },
            { Abreviação: 'OQQDR', Nome: 'Octoquadragintillion', 'Notação Científica': '1.00E+147' },
            { Abreviação: 'NQQDR', Nome: 'Novemquadragintillion', 'Notação Científica': '1.00E+150' },
        ]
    }
  }
};

export const scythesArticle: WikiArticle = {
  id: 'scythes-world-21',
  title: 'Foices (Mundo 21)',
  summary: 'Um guia para as foices do Mundo 21, as armas mais recentes do jogo, e seus multiplicadores de dano.',
  content: 'As foices são as armas introduzidas no Mundo 21. Elas oferecem multiplicadores de dano significativos que aumentam com a evolução (estrelas).',
  tags: ['foice', 'arma', 'mundo 21', '21', 'guia', 'geral'],
  imageId: 'wiki-14',
  tables: {
    scythes: {
      headers: ['Foice', 'Stats (Base)', 'Stats (1 Estrela)', 'Stats (2 Estrelas)', 'Stats (3 Estrelas)'],
      rows: [
        { 'Foice': 'Venomleaf', 'Stats (Base)': '0.75x', 'Stats (1 Estrela)': '1.5x', 'Stats (2 Estrelas)': '2.25x', 'Stats (3 Estrelas)': '3.75x' },
        { 'Foice': 'Cryoscythe', 'Stats (Base)': '1x', 'Stats (1 Estrela)': '2x', 'Stats (2 Estrelas)': '3x', 'Stats (3 Estrelas)': '5x' },
        { 'Foice': 'Toxinfang', 'Stats (Base)': '1.75x', 'Stats (1 Estrela)': '3.5x', 'Stats (2 Estrelas)': '5.25x', 'Stats (3 Estrelas)': '8.75x' },
        { 'Foice': 'Crimson Thorn', 'Stats (Base)': '2.2x', 'Stats (1 Estrela)': '4.4x', 'Stats (2 Estrelas)': '6.6x', 'Stats (3 Estrelas)': '11x' },
        { 'Foice': 'Bonehowl', 'Stats (Base)': '2.75x', 'Stats (1 Estrela)': '5.5x', 'Stats (2 Estrelas)': '8.25x', 'Stats (3 Estrelas)': '13.75x' },
        { 'Foice': 'Ashfang', 'Stats (Base)': '3.5x', 'Stats (1 Estrela)': '7x', 'Stats (2 Estrelas)': '10.5x', 'Stats (3 Estrelas)': '17.5x' },
        { 'Foice': 'Phantom Requiem', 'Stats (Base)': '4.25x', 'Stats (1 Estrela)': '8.5x', 'Stats (2 Estrelas)': '12.75x', 'Stats (3 Estrelas)': '21.25x' },
        { 'Foice': 'Stormreaver', 'Stats (Base)': '5x', 'Stats (1 Estrela)': '10x', 'Stats (2 Estrelas)': '15x', 'Stats (3 Estrelas)': '25x' },
      ]
    }
  }
};

export const titansArticle: WikiArticle = {
  id: 'titans-world-11',
  title: 'Guia de Titãs (Mundo 11)',
  summary: 'Um guia sobre os Titãs, um tipo de "lutador" do Mundo 11, e o dano que eles causam em cada nível de estrela.',
  content: 'Titãs são lutadores especiais encontrados no Mundo 11. O dano deles é uma porcentagem do seu próprio dano total, tornando-os aliados poderosos. O dano aumenta significativamente com a evolução (estrelas).',
  tags: ['titã', 'lutador', 'dano', 'mundo 11', '11', 'guia', 'geral'],
  imageId: 'wiki-15',
  tables: {
    baseTitans: {
      headers: ['Titã (0 Estrelas)', 'Tempo de Ataque', 'Dano de Ataque'],
      rows: [
        { 'Titã (0 Estrelas)': 'Jaw Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '5%' },
        { 'Titã (0 Estrelas)': 'Female Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '10%' },
        { 'Titã (0 Estrelas)': 'Beast Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '15%' },
        { 'Titã (0 Estrelas)': 'Armored Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '20%' },
        { 'Titã (0 Estrelas)': 'Warhammer Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '25%' },
        { 'Titã (0 Estrelas)': 'Attack Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '30%' },
        { 'Titã (0 Estrelas)': 'Colossal Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '40%' },
      ],
    },
    oneStarTitans: {
      headers: ['Titã (1 Estrela)', 'Tempo de Ataque', 'Dano de Ataque'],
      rows: [
        { 'Titã (1 Estrela)': 'Jaw Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '7.5%' },
        { 'Titã (1 Estrela)': 'Female Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '15%' },
        { 'Titã (1 Estrela)': 'Beast Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '22.5%' },
        { 'Titã (1 Estrela)': 'Armored Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '30%' },
        { 'Titã (1 Estrela)': 'Warhammer Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '37.5%' },
        { 'Titã (1 Estrela)': 'Attack Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '45.0%' },
        { 'Titã (1 Estrela)': 'Colossal Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '60%' },
      ],
    },
    twoStarTitans: {
      headers: ['Titã (2 Estrelas)', 'Tempo de Ataque', 'Dano de Ataque'],
      rows: [
        { 'Titã (2 Estrelas)': 'Jaw Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '10%' },
        { 'Titã (2 Estrelas)': 'Female Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '20%' },
        { 'Titã (2 Estrelas)': 'Beast Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '30%' },
        { 'Titã (2 Estrelas)': 'Armored Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '40%' },
        { 'Titã (2 Estrelas)': 'Warhammer Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '50%' },
        { 'Titã (2 Estrelas)': 'Attack Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '60%' },
        { 'Titã (2 Estrelas)': 'Colossal Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '80%' },
      ],
    },
    threeStarTitans: {
      headers: ['Titã (3 Estrelas)', 'Tempo de Ataque', 'Dano de Ataque'],
      rows: [
        { 'Titã (3 Estrelas)': 'Jaw Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '15%' },
        { 'Titã (3 Estrelas)': 'Female Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '30%' },
        { 'Titã (3 Estrelas)': 'Beast Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '45%' },
        { 'Titã (3 Estrelas)': 'Armored Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '60%' },
        { 'Titã (3 Estrelas)': 'Warhammer Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '75%' },
        { 'Titã (3 Estrelas)': 'Attack Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '90%' },
        { 'Titã (3 Estrelas)': 'Colossal Titan', 'Tempo de Ataque': '1s', 'Dano de Ataque': '120%' },
      ],
    },
  },
};


// A comprehensive list for seeding all articles at once if needed.
export const allWikiArticles = [
  gettingStartedArticle,
  auraArticle,
  legendaryWeaponsArticle,
  guildWarsArticle,
  prestigeArticle,
  rankArticle,
  worldBossesArticle,
  swordsArticle,
  damageSwordsArticle,
  world20RaidsArticle,
  raidRequirementsArticle,
  gamepassTierListArticle,
  scientificNotationArticle,
  scythesArticle,
  titansArticle,
];

    

    



