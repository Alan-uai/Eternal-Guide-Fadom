
import type { WikiArticle } from '@/lib/types';

// This file now exports individual articles to be seeded separately.
// It is kept for reference or for re-seeding if needed.

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
    content: `Auras são buffs poderosos dropados por Chefes de Rank-SS em vários mundos. Cada Aura fornece um bônus de status único. Aqui está uma lista de Auras conhecidas e seus status:\n\n*   **Mundo 2 (Shanks):** Aura da Sorte (10% de Sorte de Estrela)
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
    content: `O sistema de Prestígio permite que os jogadores resetem seu nível em troca de bônus permanentes poderosos. Veja como funciona:

### Níveis e Requisitos de Prestígio:

**Prestígio 1:**
*   Nível Requerido: 200
*   Novo Limite de Nível: 210
*   Pontos de Status por nível: 2
*   Multiplicador de Exp: 0.1x

**Prestígio 2:**
*   Nível Requerido: 210
*   Novo Limite de Nível: 220
*   Pontos de Status por nível: 3
*   Multiplicador de Exp: 0.2x

**Prestígio 3:**
*   Nível Requerido: 220
*   Novo Limite de Nível: 230
*   Pontos de Status por nível: 4
*   Multiplicador de Exp: 0.3x

**Prestígio 4:**
*   Nível Requerido: 230
*   Novo Limite de Nível: 250
*   Pontos de Status por nível: 5
*   Multiplicador de Exp: 0.4x

**Prestígio 5:**
*   Nível Requerido: 250
*   Novo Limite de Nível: 270
*   Pontos de Status por nível: 6
*   Multiplicador de Exp: 0.5x

Cada vez que você prestigia, você desbloqueia um limite de nível mais alto e recebe mais pontos de status por nível, permitindo maior personalização e poder do personagem.`,
    tags: ['prestígio', 'nível', 'endgame', 'status', 'sistema', 'geral'],
    imageId: 'wiki-5',
};

export const rankArticle: WikiArticle = {
    id: 'rank-system',
    title: 'Sistema de Ranks',
    summary: 'Uma referência para a energia necessária para alcançar cada rank no jogo.',
    content: `Subir de rank é uma parte central da progressão no Anime Eternal. Cada rank requer uma certa quantidade de energia para ser alcançado. Abaixo está uma tabela detalhando a energia necessária para cada rank.

| Rank | Energia | Rank | Energia | Rank | Energia | Rank | Energia |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | 9k | 31 | 7.05O | 61 | 4.90sxD | 91 | 2 QnV |
| 2 | 45k | 32 | 52.15O | 62 | 45.59sxD | 92 | 10 QnV |
| 3 | 243.03k | 33 | 407.01O | 63 | 319.31sxD | 93 | 50 QnV |
| 4 | 1.41M | 34 | 2.04N | 64 | 2.36 SpD | 94 | 500 QnV |
| 5 | 8.75M | 35 | 11.01N | 65 | 18.41 SpD | 95 | 5 SeV |
| 6 | 57.84M | 36 | 63.80N | 66 | 92.06 SpD | 96 | 500 SeV |
| 7 | 405.18M | 37 | 395.72N | 67 | 497.12SpD | 97 | 25 SPG |
| 8 | 3B | 38 | 2.61de | 68 | 2.89OcD | 98 | 250 SPG |
| 9 | 23.39B | 39 | 18.29de | 69 | 17.92OcD | 99 | 2.5 OVG |
| 10 | 116.96B | 40 | 135.46de | 70 | 118.360OcD | 100 | 100 OVG |
| 11 | 631.36B | 41 | 1.06Ud | 71 | 828.38OcD | 101 | 750 OVG |
| 12 | 1.07T | 42 | 5.28Ud | 72 | 6.13NvD | 102 | 3 NVG |
| 13 | 2.52T | 43 | 28.53Ud | 73 | 47.81NvD | 103 | 30 NVG |
| 14 | 14.99T | 44 | 165.50Ud | 74 | 239.06NvD | 104 | 250 NVG |
| 15 | 154.95T | 45 | 1.03DD | 75 | 1.29Vgn | 105 | 1 TGN |
| 16 | 776.49T | 46 | 6.77DD | 76 | 7.49Vgn | 106 | |
| 17 | 7.06qd | 47 | 47.40DD | 77 | 46.41Vgn | 107 | |
| 18 | 90.32qd | 48 | 351.06DD | 78 | 306.38Vgn | 108 | |
| 19 | 1.04Qn | 49 | 2.74tdD | 79 | 2.15Uvg | 109 | |
| 20 | 9.49Qn | 50 | 13.71tdD | 80 | 16.00Uvg | 110 | |
| 21 | 58.84Qn | 51 | 74.00tdD | 81 | 124.80 Uvg | 111 | |
| 22 | 388.50Qn | 52 | 429.34tdD | 82 | 748.80 Uvg | 112 | |
| 23 | 2.72sx | 53 | 2.66qdD | 83 | 4.79 DVg | 113 | |
| 24 | 20.14sx | 54 | 17.57qdD | 84 | 32.59 DVg | 114 | |
| 25 | 157.16sx | 55 | 85.29qdD | 85 | 234.63 DVg | 115 | |
| 26 | 785.79sx | 56 | 910.22qdD | 86 | 100 TVg | 116 | |
| 27 | 4.24Sp | 57 | 4.10QnD | 87 | 1 qtV | 117 | |
| 28 | 24.61Sp | 58 | 8.20QnD | 88 | 15 qtV | 118 | |
| 29 | 152.63Sp | 59 | 48.00QnD | 89 | 50 qtV | 119 | |
| 30 | 1.01O | 60 | 336.00QnD | 90 | 250 qtV | 120 | |`,
    tags: ['rank', 'progressão', 'energia', 'status', 'sistema', 'geral'],
    imageId: 'wiki-6',
};

export const worldBossesArticle: WikiArticle = {
  id: 'world-bosses',
  title: 'Guia de Chefes de Mundo',
  summary: 'Um guia completo para todos os chefes de mundo, seus status e o DPS recomendado para derrotá-los.',
  content: `Este guia fornece uma lista completa de todos os chefes de mundo de Rank-SS.

| Mundo | Chefe | HP | Rank | Exp | DPS Recom. |
|:---|:---|:---|:---|:---|:---|
| Earth City | Kid Kohan | 2.500 - Qd | SS | 15.0 | 50 - T |
| Windmill Island | Shanks | 5.00 - Sx | SS | 30.0 | 100 - QN |
| Soul Society | Eizen | 2.5 - Sp | SS | 60.0 | 50 - SX |
| Cursed School | Sakuni | 120.00 - Sp | SS | 120.0 | 2.4 - SP |
| Slayer Village | Rangoki | 31.2 - De | SS | 240.0 | 624 - N |
| Solo Island | Statue of God | 195 - UD | SS | 480.0 | 3.90 - UD |
| Clover Village | Novi Chroni | 101 - TdD | SS | 960.0 | 2 - TDD |
| Leaf Village | Itechi | 2.82 - QnD | SS | 1.92K | 56.4 - QDD |
| Leaf Village | Madera | 5.64 - QnD | SS | 2.88K | 113 - QDD |
| Spirit Residence | Ken Turbo | 494 - SxD | SS | 5.76K | 10 - SXD |
| Magic Hunter City | Killas Godspeed | 296 - OcD | SS | 11.52K | 6 - OCD |
| Titan City | Eran | 49.4 - VgN | SS | 23.04K | 988 - NVD |
| Village of Sins | Esanor | 9.77 - DvG | SS | 46.08K | 195 - UVG |
| Kaiju Base | Number N°8 | 5.5 - QtV | SS | 92.16K | 111 - TVG |
| Tempest Capital | Valzora | 4.79 - SeV | SS | 184.32K | 98 - QNV |
| Virtual City | The Paladin | 967 - SpG | SS | 368.64K | 20 - SPG |
| Cairo | Dio | 195 - NvG | SS | 737.28K | 3.9 - NVG |
| Ghoul City | Arama | 686 - UtG | SS | 1.52M | 15 - UTG |
| Chainsaw City | Mr. Chainsaw | 5.09 - TsTG | SS | 2.55M | 105 - DTG |
| Tokyo Empire | Leonardo | 1.76 - QnTG | SS | 5.14M | 100 - QTTG |
| Green Planet | Goku SSJ | 1.52 - NoTG | SS | 16.1M | 1 - OCTG |
| Hollow Word | Cifer | 87.2 - uQDR | SS | 40.6M | 16 - uQDR |`,
  tags: ['chefes', 'guia', 'dps', 'hp', 'recompensas', 'geral', '1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '13', '15', '16', '17', '19', '20'],
  imageId: 'wiki-7',
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
];
