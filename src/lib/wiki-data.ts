
import type { WikiArticle } from '@/lib/types';

// This file now exports individual articles to be seeded separately.
// It is kept for reference or for re-seeding if needed.

export const gettingStartedArticle: WikiArticle = {
    id: 'getting-started',
    title: 'Getting Started in Anime Eternal',
    summary: "A beginner's guide to starting your adventure in the world of Anime Eternal.",
    content: "Welcome to Anime Eternal! This guide will walk you through creating your character, understanding the basic controls, and completing your first quest.\n\nFirst, you need to choose your starting class: Warrior, Mage, or Rogue. Each class has unique abilities that cater to different playstyles. Warriors are durable front-liners, Mages control powerful elemental magic from a distance, and Rogues excel at quick, precise strikes and evasion.\n\nYour first quest will be given by the Village Elder in the starting town of Silverwind. Follow the on-screen instructions to learn about movement, combat, and interacting with the world. Good luck, adventurer!",
    tags: ['beginner', 'guide', 'new player', 'class'],
    imageId: 'wiki-1',
};

export const auraArticle: WikiArticle = {
    id: 'aura-system',
    title: 'Aura System',
    summary: 'Learn about Auras from SS-Bosses, how to unlock them, and how they enhance your abilities.',
    content: `Auras are powerful buffs dropped by SS-Rank Bosses in various worlds. Each Aura provides a unique stat boost. Here is a list of known Auras and their stats:\n\n*   **World 1:** Luck Aura (10% Starluck)
*   **World 2:** Red Emperor Aura (0.1x)
*   **World 3:** Purple Traitor Aura (0.25x)
*   **World 4:** Fire King Aura (25% Drops)
*   **World 5:** Flaming Aura (0.15x)
*   **World 6:** Statue Aura (0.75x)
*   **World 8:** Leafy Aura (25% Starluck)
*   **World 10:** Energetic Aura (1.5x)
*   **World 11:** Titanic Aura (0.5x)
*   **World 13:** Monster Aura (2.0x)
*   **World 15:** Virtual Aura (35% Drops)
*   **World 16:** Hamon Aura (10% Exp)
*   **World 17:** Ghoul Aura (1.0x)
*   **World 19:** Fire Captain Aura (1.5x)`,
    tags: ['aura', 'power', 'abilities', 'buffs', 'boss drop'],
    imageId: 'wiki-2',
};

export const legendaryWeaponsArticle: WikiArticle = {
    id: 'legendary-weapons',
    title: 'Crafting Legendary Weapons',
    summary: 'Discover the secrets to forging the most powerful weapons in the game.',
    content: 'Legendary weapons are the pinnacle of equipment in Anime Eternal. Crafting one is a long and arduous journey that requires rare materials, a high crafting level, and a special forge.\n\nThe required materials, known as "Celestial Fragments," are dropped by world bosses and can be found in the deepest dungeons. You will need 100 fragments, along with other rare components, to attempt a craft. The forge is located at the peak of Mount Celestia. Be warned, the path is treacherous.',
    tags: ['crafting', 'weapons', 'legendary', ' endgame'],
    imageId: 'wiki-3',
};

export const guildWarsArticle: WikiArticle = {
    id: 'guild-wars',
    title: 'An Introduction to Guild Wars',
    summary: 'Team up with your guild and battle for supremacy and rare rewards.',
    content: 'Guild Wars are weekly events where guilds compete against each other in large-scale PvP battles. To participate, you must be a member of a guild with at least 10 members.\n\nWars take place every Saturday. The objective is to capture and hold control points on a special map. The guild with the most points at the end of the event wins. Victorious guilds receive exclusive rewards, including rare cosmetics, powerful gear, and a significant amount of in-game currency.',
    tags: ['guild', 'pvp', 'event', 'team'],
    imageId: 'wiki-4',
};

export const prestigeArticle: WikiArticle = {
    id: 'prestige-system',
    title: 'Prestige System',
    summary: 'Understand how to prestige to increase your level cap and gain more power.',
    content: `The Prestige system allows players to reset their level in exchange for powerful permanent bonuses. Here's how it works:\n\n**Prestige Levels & Requirements:**\n\n*   **Prestige 1:**
    *   Required Level: 200
    *   New Level Cap: 210
    *   Statpoints per level: 2
    *   Exp Multi: 0.1x\n
*   **Prestige 2:**
    *   Required Level: 210
    *   New Level Cap: 220
    *   Statpoints per level: 3
    *   Exp Multi: 0.2x\n
*   **Prestige 3:**
    *   Required Level: 220
    *   New Level Cap: 230
    *   Statpoints per level: 4
    *   Exp Multi: 0.3x\n
*   **Prestige 4:**
    *   Required Level: 230
    *   New Level Cap: 250
    *   Statpoints per level: 5
    *   Exp Multi: 0.4x\n
*   **Prestige 5:**
    *   Required Level: 250
    *   New Level Cap: 270
    *   Statpoints per level: 6
    *   Exp Multi: 0.5x

Each time you prestige, you unlock a higher level cap and receive more stat points per level, allowing for greater character customization and power.`,
    tags: ['prestige', 'leveling', 'endgame', 'stats'],
    imageId: 'wiki-5',
};

export const rankArticle: WikiArticle = {
    id: 'rank-system',
    title: 'Rank System',
    summary: 'A reference for the energy required to achieve each rank in the game.',
    content: `Ranking up is a core part of progressing in Anime Eternal. Each rank requires a certain amount of energy to achieve. Below is a table detailing the energy needed for ranks 81 through 120.\n\n| Rank Up | Stats          |    | Rank Up | Stats    |\n|:--------|:---------------|:---|:--------|:---------|\n| 81      | 124.80 Uvg     |    | 101     | 750 OVG  |\n| 82      | 748.80 Uvg     |    | 102     | 3 NVG    |\n| 83      | 4.79 DVg       |    | 103     | 30 NVG   |\n| 84      | 32.59 DVg      |    | 104     | 250 NVG  |\n| 85      | 234.63 DVg     |    | 105     | 1 TGN    |\n| 86      | 100 TVg        |    | 106     |          |\n| 87      | 1 qtV          |    | 107     |          |\n| 88      | 15 qtV         |    | 108     |          |\n| 89      | 50 qtV         |    | 109     |          |\n| 90      | 250 qtV        |    | 110     |          |\n| 91      | 2 QnV          |    | 111     |          |\n| 92      | 10 QnV         |    | 112     |          |\n| 93      | 50 QnV         |    | 113     |          |\n| 94      | 500 QnV        |    | 114     |          |\n| 95      | 5 SeV          |    | 115     |          |\n| 96      | 500 SeV        |    | 116     |          |\n| 97      | 25 SPG         |    | 117     |          |\n| 98      | 250 SPG        |    | 118     |          |\n| 99      | 2.5 OVG        |    | 119     |          |\n| 100     | 100 OVG        |    | 120     |          |`,
    tags: ['rank', 'progression', 'energy', 'stats'],
    imageId: 'wiki-6',
};

export const worldBossesArticle: WikiArticle = {
  id: 'world-bosses',
  title: 'World Boss Guide',
  summary: 'A complete guide to all the world bosses, their stats, and the recommended DPS to defeat them.',
  content: `This guide provides a comprehensive list of all SS-Rank world bosses.\n\n| World             | Boss Name         | HP          | Rank | Exp      | DPS Recom.   |\n|:------------------|:------------------|:------------|:-----|:---------|:-------------|\n| Earth City        | Kid Kohan         | 2.500 - Qd  | SS   | 15.0     | 50 - T       |\n| Windmill Island   | Shanks            | 5.00 - Sx   | SS   | 30.0     | 100 - QN     |\n| Soul Society      | Eizen             | 2.5 - Sp    | SS   | 60.0     | 50 - SX      |\n| Cursed School     | Sakuni            | 120.00 - Sp | SS   | 120.0    | 2.4 - SP     |\n| Slayer Village    | Rangoki           | 31.2 - De   | SS   | 240.0    | 624 - N      |\n| Solo Island       | Statue of God     | 195 - UD    | SS   | 480.0    | 3.90 - UD    |\n| Clover Village    | Novi Chroni       | 101 - TdD   | SS   | 960.0    | 2 - TDD      |\n| Leaf Village      | Itechi            | 2.82 - QnD  | SS   | 1.92K    | 56.4 - QDD   |\n| Leaf Village      | Madera            | 5.64 - QnD  | SS   | 2.88K    | 113 - QDD    |\n| Spirit Residence  | Ken Turbo         | 494 - SxD   | SS   | 5.76K    | 10 - SXD     |\n| Magic Hunter City | Killas Godspeed   | 296 - OcD   | SS   | 11.52K   | 6 - OCD      |\n| Titan City        | Eran              | 49.4 - VgN  | SS   | 23.04K   | 988 - NVD    |\n| Village of Sins   | Esanor            | 9.77 - DvG  | SS   | 46.08K   | 195 - UVG    |\n| Kaiju Base        | Number N°8        | 5.5 - QtV   | SS   | 92.16K   | 111 - TVG    |\n| Tempest Capital   | Valzora           | 4.79 - SeV  | SS   | 184.32K  | 98 - QNV     |\n| Virtual City      | The Paladin       | 967 - SpG   | SS   | 368.64K  | 20 - SPG     |\n| Cairo             | Dio               | 195 - NvG   | SS   | 737.28K  | 3.9 - NVG    |\n| Ghoul City        | Arama             | 686 - UtG   | SS   | 1.52M    | 15 - UTG     |\n| Chainsaw City     | Mr. Chainsaw      | 5.09 - TsTG | SS   | 2.55M    | 105 - DTG    |\n| Tokyo Empire      | Leonardo          | 1.76 - QnTG | SS   | 5.14M    | 100 - QTTG   |\n| Green Planet      | Goku SSJ          | 1.52 - NoTG | SS   | 16.1M    | 1 - OCTG     |\n| Hollow Word       | Cifer             | 87.2 - uQDR | SS   | 40.6M    | 16 - uQDR    |`,
  tags: ['bosses', 'guide', 'dps', 'hp', 'rewards'],
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
