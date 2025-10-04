
export const world2Data = {
    name: 'Windmill Island',
    powers: [
      {
        id: 'red-emperor-power',
        name: 'Red Emperor Power',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Conquerors Haki', multiplier: '1.1x' },
          { name: 'Red Hair', multiplier: '1.2x' },
          { name: 'Emperor', multiplier: '1.3x' },
          { name: 'Yonko', multiplier: '1.4x' },
        ],
      },
    ],
    npcs: [
        {
            id: 'zoro',
            name: 'Zoro',
            rank: 'SS',
            drops: ['Swords']
        }
    ],
    pets: [
        {
            id: 'tony',
            name: 'Tony',
            rarity: 'S-Rank',
            energy_bonus: '2.5x'
        },
        {
            id: 'laboon',
            name: 'Laboon',
            rarity: 'A-Rank',
            energy_bonus: '1.5x'
        },
        {
            id: 'blue-elephant',
            name: 'Blue Elephant',
            rarity: 'B-Rank',
            energy_bonus: '1.25x'
        }
    ],
    dungeons: [
        {
            id: 'restaurante',
            name: 'Restaurante',
            boss: 'Don Krieg',
            description: 'Goes up to level 1000. Drops 5 tokens, each with a 20% chance. Tokens are used for gacha/progression powers.'
        }
    ],
  };
  