
export const world3Data = {
    id: '003',
    name: 'World 3 - Soul Society',
    powers: [
      {
        id: 'reiatsu-color',
        name: 'Reiatsu Color',
        type: 'gacha',
        statType: 'energy',
        unlockCost: '110k',
        leveling: {
            token: "Reiatsu Lvl Token",
            costPerLevel: 10,
            unlockWorld: 21,
            description: "Pode ser evoluído no Mundo 21 usando Reiatsu Lvl Tokens."
        },
        stats: [
          { id: 'gray-reiatsu', name: 'Gray Reiatsu', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { id: 'green-reiatsu', name: 'Green Reiatsu', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { id: 'blue-reiatsu', name: 'Blue Reiatsu', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
          { id: 'pink-reiatsu', name: 'Pink Reiatsu', multiplier: '5x', rarity: 'Epic', probability: 5 },
          { id: 'yellow-reiatsu', name: 'Yellow Reiatsu', multiplier: '6x', rarity: 'Legendary', probability: 1 },
          { id: 'red-reiatsu', name: 'Red Reiatsu', multiplier: '8x', rarity: 'Mythic', probability: 0.5 },
          { id: 'black-reiatsu', name: 'Black Reiatsu', multiplier: '10x', rarity: 'Phantom', probability: 0.05 },
        ],
      },
      {
        id: 'zanpakuto',
        name: 'Zanpakuto',
        type: 'gacha',
        statType: 'damage',
        unlockCost: '190k',
        leveling: {
            token: "Zanpakuto Lvl Token",
            costPerLevel: 10,
            unlockWorld: 21,
            description: "Pode ser evoluído no Mundo 21 usando Zanpakuto Lvl Tokens."
        },
        stats: [
          { id: 'common-zanpakuto', name: 'Common', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { id: 'uncommon-zanpakuto', name: 'Uncommon', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { id: 'rare-zanpakuto', name: 'Rare', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
          { id: 'epic-zanpakuto', name: 'Epic', multiplier: '5x', rarity: 'Epic', probability: 5 },
          { id: 'legendary-zanpakuto', name: 'Legendary', multiplier: '6x', rarity: 'Legendary', probability: 1 },
          { id: 'mythical-zanpakuto', name: 'Mythical', multiplier: '7.5x', rarity: 'Mythic', probability: 0.5 },
          { id: 'phantom-zanpakuto', name: 'Phantom', multiplier: '10x', rarity: 'Phantom', probability: 0.05 },
        ],
      },
      {
        id: 'spiritual-pressure',
        name: 'Spiritual Pressure',
        type: 'progression',
        unlockCost: '250k',
        statType: 'mixed',
        maxLevel: 210,
        boosts: [
            { type: 'damage', value: '1.01x' },
            { type: 'energy', value: '1.11x' },
        ]
      },
    ],
    npcs: [
      { id: 'world3-e-rank', name: 'E Rank NPC', rank: 'E', exp: 21, hp: '1.1qd', world: 'World 3', drops: { coins: { amount: '110T', probability: 0.8 } } },
      { id: 'world3-d-rank', name: 'D Rank NPC', rank: 'D', exp: 22, hp: '5.8qd', world: 'World 3', drops: { coins: { amount: '580T', probability: 0.8 } } },
      { id: 'world3-c-rank', name: 'C Rank NPC', rank: 'C', exp: 23, hp: '29qd', world: 'World 3', drops: { coins: { amount: '2.9qd', probability: 0.8 } } },
      { id: 'world3-b-rank', name: 'B Rank NPC', rank: 'B', exp: 24, hp: '146qd', world: 'World 3', drops: { coins: { amount: '14qd', probability: 0.8 } } },
      { id: 'world3-a-rank', name: 'A Rank NPC', rank: 'A', exp: 25, hp: '734qd', world: 'World 3', drops: { coins: { amount: '73qd', probability: 0.8 } } },
      { id: 'world3-s-rank', name: 'S Rank NPC', rank: 'S', exp: 26, hp: '3.6Qn', world: 'World 3', drops: { coins: { amount: '360qd', probability: 0.8 } } },
      { id: 'eizen-boss', name: 'Eizen', rank: 'SS', exp: 60, hp: '18Qn', world: 'World 3', drops: { coins: { amount: '1.8Qn', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    pets: [
        { id: 'hime', name: 'Hime', energy_bonus: '19' },
        { id: 'ichige', name: 'Ichige', energy_bonus: '38' },
        { id: 'uryua', name: 'Uryua', energy_bonus: '56' },
        { id: 'rakiu', name: 'Rakiu', energy_bonus: '75' },
        { id: 'yoichi', name: 'Yoichi', energy_bonus: '94' },
        { id: 'kahara', name: 'Kahara', energy_bonus: '125' },
        { id: 'eizen-pet', name: 'Eizen', energy_bonus: '281' }
    ],
    dungeons: [],
  };
