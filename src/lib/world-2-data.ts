
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
      {
        id: 'pirate-crew',
        name: 'Pirate Crew',
        type: 'gacha',
        statType: 'energy',
        stats: [
            { name: 'Whitebeard Pirates', multiplier: '2x' },
            { name: 'Cross Guild', multiplier: '3x' },
            { name: 'Big Mom Pirates', multiplier: '4x' },
            { name: 'Beast pirates', multiplier: '5x' },
            { name: 'Blackbeard Pirates', multiplier: '8x' },
            { name: 'Straw Hat Pirates', multiplier: '10x' },
            { name: 'Red-Haired Pirates', multiplier: '12x' }
        ]
      },
      {
        id: 'chef-power',
        name: 'Chef Power',
        type: 'gacha',
        statType: 'damage',
        stats: [
            { name: 'Common Chef', multiplier: '1x' },
            { name: 'Uncommon Chef', multiplier: '1.5x' },
            { name: 'Rare Chef', multiplier: '2x' },
            { name: 'Epic Chef', multiplier: '3x' },
            { name: 'Legendary Chef', multiplier: '5x' },
            { name: 'Mythical Chef', multiplier: '7x' },
            { name: 'Phantom Chef', multiplier: '10x' }
        ]
      },
      {
        id: 'demon-fruit',
        name: 'Demon Fruit',
        type: 'gacha',
        // statType is defined on individual stats because it's mixed
        stats: [
          { name: 'Bomb Fruit', multiplier: '2x', statType: 'coin' },
          { name: 'Rubber Fruit', multiplier: '3x', statType: 'energy' },
          { name: 'Sand Fruit', multiplier: '4x', statType: 'coin' },
          { name: 'Flame Fruit', multiplier: '5x', statType: 'energy' },
          { name: 'Smoke Fruit', multiplier: '6x', statType: 'energy' },
          { name: 'Magma Fruit', multiplier: '7x', statType: 'damage' },
          { name: 'Revive Fruit', multiplier: '8x', statType: 'energy' },
          { name: 'String Fruit', multiplier: '9x', statType: 'coin' },
          { name: 'Human Fruit', multiplier: '10x', statType: 'coin' },
          { name: 'Dark Fruit', multiplier: '11x', statType: 'coin' },
          { name_id: 'quake-fruit', name: 'Quake Fruit', multiplier: '12x', statType: 'damage' },
          { name: 'Money Fruit', multiplier: '1x', statType: 'coin' },
          { name: 'Phoenix Fruit', multiplier: '15x', statType: 'energy' },
          { name: 'Dough Fruit', multiplier: '10x', statType: 'energy' },
        ]
      },
      {
        id: 'haki-upgrade',
        name: 'Haki Upgrade',
        type: 'progression',
        statType: 'damage',
        maxLevel: 60,
        maxBoost: '0.6x Damage'
      }
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
  
