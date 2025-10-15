export const world17Data = {
    name: 'World 17 - Ghoul City',
    powers: [
      {
        id: 'investigators-power',
        name: 'Investigators',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A',
        stats: [
          { name: 'Bureau', multiplier: '2x', rarity: 'Common' },
          { name: 'Assistants', multiplier: '3x', rarity: 'Uncommon' },
          { name: 'Rank 3', multiplier: '4.5x', rarity: 'Rare' },
          { name: 'Rank 2', multiplier: '6x', rarity: 'Epic' },
          { name: 'Rank 1', multiplier: '8x', rarity: 'Legendary' },
          { name: 'First Class', multiplier: '10x', rarity: 'Mythic' },
          { name: 'Associate Special Class', multiplier: '12x', rarity: 'Phantom' },
          { name: 'Special Class', multiplier: '15x', rarity: 'Supreme' }
        ]
      },
      {
        id: 'kagune-power',
        name: 'Kagune',
        type: 'gacha',
        statType: 'damage',
        unlockCost: 'N/A',
        stats: [
          { name: 'Retto', multiplier: '1x', rarity: 'Common' },
          { name: 'Hakuro', multiplier: '1.5x', rarity: 'Uncommon' },
          { name: 'Shinku', multiplier: '2x', rarity: 'Rare' },
          { name: 'Tetsuba', multiplier: '3x', rarity: 'Epic' },
          { name: 'Shidare', multiplier: '5x', rarity: 'Legendary' },
          { name: 'Hakuja', multiplier: '7x', rarity: 'Mythic' },
          { name: 'Mukade', multiplier: '9x', rarity: 'Phantom' },
          { name: 'Koumyaku', multiplier: '12x', rarity: 'Supreme' }
        ]
      },
      {
        id: 'damage-cells-progression',
        name: 'Damage Cells',
        type: 'progression',
        statType: 'damage',
        unlockCost: 'N/A',
        maxLevel: 110,
        maxBoost: '1.10x Damage'
      }
    ],
    npcs: [
        { id: 'world17-e-rank', name: 'E Rank NPC', rank: 'E', exp: 629512, hp: '6.2SPG', world: 'World 17', drops: { coins: { amount: '620SeV', probability: 0.8 } } },
        { id: 'world17-d-rank', name: 'D Rank NPC', rank: 'D', exp: 692464, hp: '31SPG', world: 'World 17', drops: { coins: { amount: '3.1SPG', probability: 0.8 } } },
        { id: 'world17-c-rank', name: 'C Rank NPC', rank: 'C', exp: 761710, hp: '156SPG', world: 'World 17', drops: { coins: { amount: '15SPG', probability: 0.8 } } },
        { id: 'world17-b-rank', name: 'B Rank NPC', rank: 'B', exp: 837881, hp: '782SPG', world: 'World 17', drops: { coins: { amount: '78SPG', probability: 0.8 } } },
        { id: 'world17-a-rank', name: 'A Rank NPC', rank: 'A', exp: 921669, hp: '3.9OVG', world: 'World 17', drops: { coins: { amount: '390SPG', probability: 0.8 } } },
        { id: 'world17-s-rank', name: 'S Rank NPC', rank: 'S', exp: 1013836, hp: '19OVG', world: 'World 17', drops: { coins: { amount: '1.9OVG', probability: 0.8 } } },
        { id: 'arama-boss', name: 'Arama', rank: 'SS', exp: 1520754, hp: '97OVG', world: 'World 17', drops: { coins: { amount: '9.7OVG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'arama-shadow',
            name: 'Arama',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '26.6% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '28.5% Energy',
                }
            ]
        }
    ],
    dungeons: [
        {
            id: 'ghoul-raid',
            name: 'Ghoul Raid',
            description: 'Vai até a wave 1000 (w1k).'
        }
    ]
};
