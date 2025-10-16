
export const world7Data = {
    id: '007',
    name: 'World 7 - Clover Village',
    powers: [
      {
        id: 'grimoire-1',
        name: 'Grimoire 1',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A', // Custo não especificado
        stats: [
          { id: 'water-grimoire', name: 'Water Grimoire', multiplier: '2x', rarity: 'Common' },
          { id: 'fire-grimoire', name: 'Fire Grimoire', multiplier: '3x', rarity: 'Uncommon' },
          { id: 'wind-grimoire', name: 'Wind Grimoire', multiplier: '4x', rarity: 'Rare' },
          { id: 'dark-grimoire', name: 'Dark Grimoire', multiplier: '5x', rarity: 'Epic' },
          { id: 'light-grimoire', name: 'Light Grimoire', multiplier: '8x', rarity: 'Legendary' },
          { id: 'anti-magic-grimoire', name: 'Anti-Magic Grimoire', multiplier: '10x', rarity: 'Mythic' },
          { id: 'time-magic-grimoire', name: 'Time Magic Grimoire', multiplier: '12x', rarity: 'Phantom' }
        ]
      },
      {
        id: 'water-spirit-progression',
        name: 'Water Spirit Progression',
        type: 'progression',
        statType: 'energy',
        unlockCost: 'N/A',
        maxLevel: 100,
        maxBoost: '1.00x Energy'
      },
      {
        id: 'wind-spirit-progression',
        name: 'Wind Spirit Progression',
        type: 'progression',
        statType: 'luck', // Assuming crit chance falls under luck
        unlockCost: 'N/A',
        maxLevel: 10,
        maxBoost: '5% Crit Chance'
      },
      {
        id: 'fire-spirit-progression',
        name: 'Fire Spirit Progression',
        type: 'progression',
        statType: 'damage',
        unlockCost: 'N/A',
        maxLevel: 100,
        maxBoost: '1.00x Damage'
      }
    ],
    npcs: [
        { id: 'world7-e-rank', name: 'E Rank NPC', rank: 'E', exp: 240, hp: '350de', world: 'World 7', drops: { coins: { amount: '35de', probability: 0.8 } } },
        { id: 'world7-d-rank', name: 'D Rank NPC', rank: 'D', exp: 264, hp: '1.7Ud', world: 'World 7', drops: { coins: { amount: '170de', probability: 0.8 } } },
        { id: 'world7-c-rank', name: 'C Rank NPC', rank: 'C', exp: 290, hp: '8.7Ud', world: 'World 7', drops: { coins: { amount: '870de', probability: 0.8 } } },
        { id: 'world7-b-rank', name: 'B Rank NPC', rank: 'B', exp: 319, hp: '43Ud', world: 'World 7', drops: { coins: { amount: '4.3Ud', probability: 0.8 } } },
        { id: 'world7-a-rank', name: 'A Rank NPC', rank: 'A', exp: 351, hp: '218Ud', world: 'World 7', drops: { coins: { amount: '21Ud', probability: 0.8 } } },
        { id: 'world7-s-rank', name: 'S Rank NPC', rank: 'S', exp: 386, hp: '1dD', world: 'World 7', drops: { coins: { amount: '100Ud', probability: 0.8 } } },
        { id: 'novi-chrone-boss', name: 'Novi Chroni', rank: 'SS', exp: 960, hp: '5.4dD', world: 'World 7', drops: { coins: { amount: '540Ud', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'novi-chrone-shadow',
            name: 'Novi Chrone',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '7% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '7.5% Energy',
                }
            ]
        }
    ]
};

    
