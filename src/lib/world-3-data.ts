export const world3Data = {
    name: 'World 3',
    powers: [
      {
        id: 'reiatsu-color',
        name: 'Reiatsu Color',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Gray Reiatsu', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { name: 'Green Reiatsu', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { name: 'Blue Reiatsu', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
          { name: 'Pink Reiatsu', multiplier: '5x', rarity: 'Legendary', probability: 5 },
          { name: 'Yellow Reiatsu', multiplier: '8x', rarity: 'Mythic', probability: 1 },
          { name: 'Red Reiatsu', multiplier: '10x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Black Reiatsu', multiplier: '12x', rarity: 'Supreme', probability: 0.05 },
        ],
      },
      {
        id: 'zanpakuto',
        name: 'Zanpakuto',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Common', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { name: 'Uncommon', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { name: 'Rare', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
          { name: 'Epic', multiplier: '5x', rarity: 'Legendary', probability: 5 },
          { name: 'Legendary', multiplier: '6x', rarity: 'Mythic', probability: 1 },
          { name: 'Mythical', multiplier: '7.5x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Phantom', multiplier: '10x', rarity: 'Supreme', probability: 0.05 },
        ],
      },
      {
        id: 'spiritual-pressure',
        name: 'Spiritual Pressure',
        type: 'progression',
        statType: 'mixed',
        maxLevel: 210,
        boosts: [
            { type: 'damage', value: '1.01x' },
            { type: 'energy', value: '1.11x' },
        ]
      },
    ],
    npcs: [],
    pets: [],
    dungeons: [],
  };

    
