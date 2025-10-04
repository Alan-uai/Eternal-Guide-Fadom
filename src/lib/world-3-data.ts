export const world3Data = {
    name: 'World 3',
    powers: [
      {
        id: 'reiatsu-color',
        name: 'Reiatsu Color',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Gray Reiatsu', multiplier: '2x' },
          { name: 'Green Reiatsu', multiplier: '3x' },
          { name: 'Blue Reiatsu', multiplier: '4x' },
          { name: 'Pink Reiatsu', multiplier: '5x' },
          { name: 'Yellow Reiatsu', multiplier: '8x' },
          { name: 'Red Reiatsu', multiplier: '10x' },
          { name: 'Black Reiatsu', multiplier: '12x' },
        ],
      },
      {
        id: 'zanpakuto',
        name: 'Zanpakuto',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Common', multiplier: '2x' },
          { name: 'Uncommon', multiplier: '3x' },
          { name: 'Rare', multiplier: '4x' },
          { name: 'Epic', multiplier: '5x' },
          { name: 'Legendary', multiplier: '6x' },
          { name: 'Mythical', multiplier: '7.5x' },
          { name: 'Phantom', multiplier: '10x' },
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

    