export const world6Data = {
    id: '006',
    name: 'World 6 - Solo Island',
    powers: [
      {
        id: 'solo-hunter-rank',
        name: 'Solo Hunter Rank',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A', // O custo não foi especificado
        stats: [
          { name: 'E-Rank', multiplier: '2x', rarity: 'Common' },
          { name: 'D-Rank', multiplier: '3x', rarity: 'Uncommon' },
          { name: 'C-Rank', multiplier: '4x', rarity: 'Rare' },
          { name: 'B-Rank', multiplier: '5x', rarity: 'Epic' },
          { name: 'A-Rank', multiplier: '8x', rarity: 'Legendary' },
          { name: 'S-Rank', multiplier: '10x', rarity: 'Mythic' },
          { name: 'National Level Hunter', multiplier: '12x', rarity: 'Phantom' }
        ]
      },
      {
        id: 'reawakening-progression',
        name: 'ReAwakening Progression',
        type: 'progression',
        statType: 'energy',
        unlockCost: 'N/A',
        maxLevel: 210,
        maxBoost: '2.10x Energy'
      },
      {
        id: 'monarch-progression',
        name: 'Monarch Progression',
        type: 'progression',
        statType: 'mixed',
        unlockCost: 'N/A',
        maxLevel: 200,
        boosts: [
            { type: 'damage', value: '2.00x Damage' },
            { type: 'crit_damage', value: '50% Crit Damage' }
        ]
      }
    ],
    npcs: [
        { id: 'world6-e-rank', name: 'E Rank NPC', rank: 'E', exp: 119, hp: '2.2N', world: 'World 6', drops: { coins: { amount: '220O', probability: 0.8 } } },
        { id: 'world6-d-rank', name: 'D Rank NPC', rank: 'D', exp: 131, hp: '11.2N', world: 'World 6', drops: { coins: { amount: '1.1N', probability: 0.8 } } },
        { id: 'world6-c-rank', name: 'C Rank NPC', rank: 'C', exp: 144, hp: '56N', world: 'World 6', drops: { coins: { amount: '5.6N', probability: 0.8 } } },
        { id: 'world6-b-rank', name: 'B Rank NPC', rank: 'B', exp: 159, hp: '280N', world: 'World 6', drops: { coins: { amount: '28N', probability: 0.8 } } },
        { id: 'world6-a-rank', name: 'A Rank NPC', rank: 'A', exp: 174, hp: '1.4de', world: 'World 6', drops: { coins: { amount: '140N', probability: 0.8 } } },
        { id: 'world6-s-rank', name: 'S Rank NPC', rank: 'S', exp: 192, hp: '7de', world: 'World 6', drops: { coins: { amount: '700N', probability: 0.8 } } },
        { id: 'statue-of-god-boss', name: 'Statue of God', rank: 'SS', exp: 480, hp: '35de', world: 'World 6', drops: { coins: { amount: '3.5de', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'statue-of-god-shadow',
            name: 'Statue of God',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '7% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '7.5% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ]
};
