
export const world2Data = {
    name: 'Windmill Island',
    powers: [
      {
        id: 'red-emperor-power',
        name: 'Red Emperor Power',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Conquerors Haki', multiplier: '1.1x', rarity: 'Rare' },
          { name: 'Red Hair', multiplier: '1.2x', rarity: 'Legendary' },
          { name: 'Emperor', multiplier: '1.3x', rarity: 'Mythic' },
          { name: 'Yonko', multiplier: '1.4x', rarity: 'Phantom' },
        ],
      },
      {
        id: 'pirate-crew',
        name: 'Pirate Crew',
        type: 'gacha',
        statType: 'energy',
        stats: [
            { name: 'Whitebeard Pirates', multiplier: '2x', rarity: 'Common' },
            { name: 'Cross Guild', multiplier: '3x', rarity: 'Uncommon' },
            { name: 'Big Mom Pirates', multiplier: '4x', rarity: 'Rare' },
            { name: 'Beast pirates', multiplier: '5x', rarity: 'Legendary' },
            { name: 'Blackbeard Pirates', multiplier: '8x', rarity: 'Mythic' },
            { name: 'Straw Hat Pirates', multiplier: '10x', rarity: 'Phantom' },
            { name: 'Red-Haired Pirates', multiplier: '12x', rarity: 'Supreme' }
        ]
      },
      {
        id: 'chef-power',
        name: 'Chef Power',
        type: 'gacha',
        statType: 'damage',
        stats: [
            { name: 'Common Chef', multiplier: '1x', rarity: 'Common' },
            { name: 'Uncommon Chef', multiplier: '1.5x', rarity: 'Uncommon' },
            { name: 'Rare Chef', multiplier: '2x', rarity: 'Rare' },
            { name: 'Epic Chef', multiplier: '3x', rarity: 'Legendary' },
            { name: 'Legendary Chef', multiplier: '5x', rarity: 'Mythic' },
            { name: 'Mythical Chef', multiplier: '7x', rarity: 'Phantom' },
            { name: 'Phantom Chef', multiplier: '10x', rarity: 'Supreme' }
        ]
      },
      {
        id: 'demon-fruit',
        name: 'Demon Fruit',
        type: 'gacha',
        // statType is defined on individual stats because it's mixed
        stats: [
          { name: 'Bomb Fruit', multiplier: '2x', statType: 'coin', rarity: 'Common' },
          { name: 'Rubber Fruit', multiplier: '3x', statType: 'energy', rarity: 'Uncommon' },
          { name: 'Sand Fruit', multiplier: '4x', statType: 'coin', rarity: 'Rare' },
          { name: 'Flame Fruit', multiplier: '5x', statType: 'energy', rarity: 'Legendary' },
          { name: 'Smoke Fruit', multiplier: '6x', statType: 'energy', rarity: 'Legendary' },
          { name: 'Magma Fruit', multiplier: '7x', statType: 'damage', rarity: 'Mythic' },
          { name: 'Revive Fruit', multiplier: '8x', statType: 'energy', rarity: 'Mythic' },
          { name: 'String Fruit', multiplier: '9x', statType: 'coin', rarity: 'Phantom' },
          { name: 'Human Fruit', multiplier: '10x', statType: 'coin', rarity: 'Phantom' },
          { name: 'Dark Fruit', multiplier: '11x', statType: 'coin', rarity: 'Phantom' },
          { name_id: 'quake-fruit', name: 'Quake Fruit', multiplier: '12x', statType: 'damage', rarity: 'Supreme' },
          { name: 'Money Fruit', multiplier: '1x', statType: 'coin', rarity: 'Uncommon' },
          { name: 'Phoenix Fruit', multiplier: '15x', statType: 'energy', rarity: 'Supreme' },
          { name: 'Dough Fruit', multiplier: '10x', statType: 'energy', rarity: 'Phantom' },
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
            description: 'Goes up to level 1000. Drops 5 tokens for early world powers, each with a 20% chance of dropping.'
        }
    ],
  };
  
