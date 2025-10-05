export const world20Data = {
    name: 'World 20 - Grand Elder',
    powers: [
      {
        id: 'grand-elder-power',
        name: 'Grand Elder Power',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Sleeping Power', multiplier: '2x', rarity: 'Common' },
          { name: 'Stirring Spirit', multiplier: '3x', rarity: 'Uncommon' },
          { name: 'Hidden Potential', multiplier: '4.5x', rarity: 'Rare' },
          { name: 'Inner Strength', multiplier: '6x', rarity: 'Legendary' },
          { name: 'Power Unleashed', multiplier: '8x', rarity: 'Mythic' },
          { name: 'True Potential', multiplier: '10x', rarity: 'Phantom' },
          { name: 'Limitless Growth', multiplier: '12x', rarity: 'Phantom' },
          { name: 'Potential Unbound', multiplier: '15x', rarity: 'Supreme' },
        ],
      },
      {
        id: 'frost-demon-evolution',
        name: 'Frost Demon Evolution',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Second Form', multiplier: '1x', rarity: 'Common' },
          { name: 'Third Form', multiplier: '1.5x', rarity: 'Uncommon' },
          { name: 'Final Form', multiplier: '2x', rarity: 'Rare' },
          { name: '50% Power', multiplier: '3x', rarity: 'Legendary' },
          { name: '100% Full Power', multiplier: '5x', rarity: 'Mythic' },
          { name: 'Mecha Form', multiplier: '7x', rarity: 'Phantom' },
          { name: 'Golden Form', multiplier: '9x', rarity: 'Phantom' },
          { name: 'Black Form', multiplier: '12x', rarity: 'Supreme' },
        ],
      },
       {
        id: 'dragon-energy',
        name: 'Dragon Energy',
        type: 'progression',
        statType: 'energy',
        maxLevel: 50,
        maxBoost: '1x Energy'
      },
      {
        id: 'dragon-damage',
        name: 'Dragon Damage',
        type: 'progression',
        statType: 'damage',
        maxLevel: 500,
        maxBoost: '10x Damage'
      }
    ],
    npcs: [],
    pets: [],
    dungeons: [],
    shadows: [
        {
            id: 'goku-ssj-shadow',
            name: 'Goku SSJ',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '35% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '37.5% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ]
  };
  