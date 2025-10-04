
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

*   **Mundo 2 (Shanks):** Aura da Sorte (10% de Sorte de Estrela)
*   **Mundo 11 (Eran):** Aura do Imperador Vermelho (0.1x)
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
  summary: 'Um guia completo para todos os chefes de mundo, seus status e o DPS recomendado para derrotá-los.',
  content: `Este guia fornece uma lista completa de todos os chefes de mundo de Rank-SS.`,
  tags: ['chefes', 'guia', 'dps', 'hp', 'recompensas', 'geral', '1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '13', '15', '16', '17', '19', '20'],
  imageId: 'wiki-7',
  tables: {
    bosses: {
      headers: ['Mundo', 'Chefe', 'HP', 'Rank', 'Exp', 'DPS Recom.'],
      rows: [
        { 'Mundo': 'Earth City', 'Chefe': 'Kid Kohan', 'HP': '2.500 - Qd', 'Rank': 'SS', 'Exp': '15.0', 'DPS Recom.': '50 - T' },
        { 'Mundo': 'Windmill Island', 'Chefe': 'Shanks', 'HP': '5.00 - Sx', 'Rank': 'SS', 'Exp': '30.0', 'DPS Recom.': '100 - QN' },
        { 'Mundo': 'Soul Society', 'Chefe': 'Eizen', 'HP': '2.5 - Sp', 'Rank': 'SS', 'Exp': '60.0', 'DPS Recom.': '50 - SX' },
        { 'Mundo': 'Cursed School', 'Chefe': 'Sakuni', 'HP': '120.00 - Sp', 'Rank': 'SS', 'Exp': '120.0', 'DPS Recom.': '2.4 - SP' },
        { 'Mundo': 'Slayer Village', 'Chefe': 'Rangoki', 'HP': '31.2 - De', 'Rank': 'SS', 'Exp': '240.0', 'DPS Recom.': '624 - N' },
        { 'Mundo': 'Solo Island', 'Chefe': 'Statue of God', 'HP': '195 - UD', 'Rank': 'SS', 'Exp': '480.0', 'DPS Recom.': '3.90 - UD' },
        { 'Mundo': 'Clover Village', 'Chefe': 'Novi Chroni', 'HP': '101 - TdD', 'Rank': 'SS', 'Exp': '960.0', 'DPS Recom.': '2 - TDD' },
        { 'Mundo': 'Leaf Village', 'Chefe': 'Itechi', 'HP': '2.82 - QnD', 'Rank': 'SS', 'Exp': '1.92K', 'DPS Recom.': '56.4 - QDD' },
        { 'Mundo': 'Leaf Village', 'Chefe': 'Madera', 'HP': '5.64 - QnD', 'Rank': 'SS', 'Exp': '2.88K', 'DPS Recom.': '113 - QDD' },
        { 'Mundo': 'Spirit Residence', 'Chefe': 'Ken Turbo', 'HP': '494 - SxD', 'Rank': 'SS', 'Exp': '5.76K', 'DPS Recom.': '10 - SXD' },
        { 'Mundo': 'Magic Hunter City', 'Chefe': 'Killas Godspeed', 'HP': '296 - OcD', 'Rank': 'SS', 'Exp': '11.52K', 'DPS Recom.': '6 - OCD' },
        { 'Mundo': 'Titan City', 'Chefe': 'Eran', 'HP': '49.4 - VgN', 'Rank': 'SS', 'Exp': '23.04K', 'DPS Recom.': '988 - NVD' },
        { 'Mundo': 'Village of Sins', 'Chefe': 'Esanor', 'HP': '9.77 - DvG', 'Rank': 'SS', 'Exp': '46.08K', 'DPS Recom.': '195 - UVG' },
        { 'Mundo': 'Kaiju Base', 'Chefe': 'Number N°8', 'HP': '5.5 - QtV', 'Rank': 'SS', 'Exp': '92.16K', 'DPS Recom.': '111 - TVG' },
        { 'Mundo': 'Tempest Capital', 'Chefe': 'Valzora', 'HP': '4.79 - SeV', 'Rank': 'SS', 'Exp': '184.32K', 'DPS Recom.': '98 - QNV' },
        { 'Mundo': 'Virtual City', 'Chefe': 'The Paladin', 'HP': '967 - SpG', 'Rank': 'SS', 'Exp': '368.64K', 'DPS Recom.': '20 - SPG' },
        { 'Mundo': 'Cairo', 'Chefe': 'Dio', 'HP': '195 - NvG', 'Rank': 'SS', 'Exp': '737.28K', 'DPS Recom.': '3.9 - NVG' },
        { 'Mundo': 'Ghoul City', 'Chefe': 'Arama', 'HP': '686 - UtG', 'Rank': 'SS', 'Exp': '1.52M', 'DPS Recom.': '15 - UTG' },
        { 'Mundo': 'Chainsaw City', 'Chefe': 'Mr. Chainsaw', 'HP': '5.09 - TsTG', 'Rank': 'SS', 'Exp': '2.55M', 'DPS Recom.': '105 - DTG' },
        { 'Mundo': 'Tokyo Empire', 'Chefe': 'Leonardo', 'HP': '1.76 - QnTG', 'Rank': 'SS', 'Exp': '5.14M', 'DPS Recom.': '100 - QTTG' },
        { 'Mundo': 'Green Planet', 'Chefe': 'Goku SSJ', 'HP': '1.52 - NoTG', 'Rank': 'SS', 'Exp': '16.1M', 'DPS Recom.': '1 - OCTG' },
        { 'Mundo': 'Hollow Word', 'Chefe': 'Cifer', 'HP': '87.2 - uQDR', 'Rank': 'SS', 'Exp': '40.6M', 'DPS Recom.': '16 - uQDR' },
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
];
