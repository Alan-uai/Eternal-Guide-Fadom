
export const world8Data = {
    id: '008',
    name: 'World 8 - Leaf Village',
    powers: [
      {
        id: 'power-eye',
        name: 'Power Eye',
        type: 'gacha',
        statType: 'mixed', 
        unlockCost: 'N/A', 
        stats: [
          { name: 'Single Tomoe Eye', multiplier: '2.5x', statType: 'damage', rarity: 'Common' },
          { name: 'Double Tomoe Eye', multiplier: '3x', statType: 'damage', rarity: 'Uncommon' },
          { name: 'Triple Tomoe Eye', multiplier: '4x', statType: 'damage', rarity: 'Rare' },
          { name: 'Triad Insight Eye', multiplier: '5x', statType: 'damage', rarity: 'Epic' },
          { name: 'Cyclone Eye', multiplier: '0.5x', statType: 'damage', rarity: 'Legendary' },
          { name: 'Whirlpool\'s Depth Eye', multiplier: '6x', statType: 'damage', rarity: 'Legendary' },
          { name: 'Triad Nexus Eye', multiplier: '1x', statType: 'damage', rarity: 'Mythic' },
          { name: 'Eclipse Eye', multiplier: '8x', statType: 'damage', rarity: 'Mythic' },
          { name: 'Atomic Insight Eye', multiplier: '1x', statType: 'damage', rarity: 'Mythic' },
          { name: 'Eternal Eclipse Eye', multiplier: '2x', statType: 'damage', rarity: 'Mythic' },
          { name: 'Eternal Atomic Eye', multiplier: '12x', statType: 'damage', rarity: 'Phantom' },
          { name: 'Eye Of Six Paths', multiplier: '15x', statType: 'damage', rarity: 'Supreme' }
        ]
      },
      {
        id: 'chakra-progression',
        name: 'Chakra Progression',
        type: 'progression',
        statType: 'energy',
        unlockCost: 'N/A',
        maxLevel: 210,
        maxBoost: '2.10x Energy'
      },
      {
        id: 'damage-range',
        name: 'Damage Range',
        type: 'progression',
        statType: 'damage',
        unlockCost: 'N/A',
        maxLevel: 10,
        maxBoost: 'N/A' 
      }
    ],
    npcs: [
        { id: 'world8-e-rank', name: 'E Rank NPC', rank: 'E', exp: 483, hp: '54dD', world: 'World 8', drops: { coins: { amount: '5.4dD', probability: 0.8 } } },
        { id: 'world8-d-rank', name: 'D Rank NPC', rank: 'D', exp: 531, hp: '270dD', world: 'World 8', drops: { coins: { amount: '27dD', probability: 0.8 } } },
        { id: 'world8-c-rank', name: 'C Rank NPC', rank: 'C', exp: 584, hp: '1.3tD', world: 'World 8', drops: { coins: { amount: '130dD', probability: 0.8 } } },
        { id: 'world8-b-rank', name: 'B Rank NPC', rank: 'B', exp: 643, hp: '6.7tD', world: 'World 8', drops: { coins: { amount: '670dD', probability: 0.8 } } },
        { id: 'world8-a-rank', name: 'A Rank NPC', rank: 'A', exp: 707, hp: '33tD', world: 'World 8', drops: { coins: { amount: '3.3tD', probability: 0.8 } } },
        { id: 'world8-s-rank', name: 'S Rank NPC', rank: 'S', exp: 777, hp: '168tD', world: 'World 8', drops: { coins: { amount: '16tD', probability: 0.8 } } },
        { id: 'itechi-boss', name: 'Itechi', rank: 'SS', exp: 1920, hp: '844tD', world: 'World 8', drops: { coins: { amount: '84tD', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
        { id: 'madera-boss', name: 'Madera', rank: 'SS', exp: 2880, hp: '1.6qdD', world: 'World 8', drops: { coins: { amount: '160tD', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    pets: [
        { id: 'sekuri', name: 'Sekuri', energy_bonus: '1.83k' },
        { id: 'kid-norto', name: 'Kid Norto', energy_bonus: '3.66k' },
        { id: 'kid-seske', name: 'Kid Seske', energy_bonus: '5.49k' },
        { id: 'kakashki', name: 'Kakashki', energy_bonus: '7.32k' },
        { id: 'jiria', name: 'Jiria', energy_bonus: '9.15k' },
        { id: 'tsuni', name: 'Tsuni', energy_bonus: '12.2k' },
        { id: 'itechi-pet', name: 'Itechi', energy_bonus: '27.4k' }
    ],
    shadows: [
        {
            id: 'madara-shadow',
            name: 'Madara',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '11.2% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supreme',
                    bonus: '12% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ]
};
