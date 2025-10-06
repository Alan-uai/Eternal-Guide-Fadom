
export const world22Data = {
    name: 'World 22 - Shadow Garden',
    powers: [
      {
        id: 'shadow-garden',
        name: 'Shadow Garden',
        type: 'gacha',
        statType: 'energy',
        enchantment: {
          token: 'Garden Lvl Token',
          costPerLevel: 10,
          description: 'Pode ser evoluído para aumentar seu poder usando Garden Lvl Tokens.'
        },
        stats: [
          { name: 'Operative', multiplier: '1x', rarity: 'Common', probability: 40.55 },
          { name: 'Agent', multiplier: '2x', rarity: 'Uncommon', probability: 33 },
          { name: 'Enforcer', multiplier: '3x', rarity: 'Rare', probability: 19.9 },
          { name: 'Commander', multiplier: '4x', rarity: 'Epic', probability: 5 },
          { name: 'Division Head', multiplier: '5x', rarity: 'Legendary', probability: 1 },
          { name: 'Shadow Council Member', multiplier: '6x', rarity: 'Mythic', probability: 0.5 },
          { name: 'The First Shadow', multiplier: '8x', rarity: 'Phantom', probability: 0.05 },
          { name: 'The Eminence', multiplier: '10x', rarity: 'Supreme', probability: 0.01 },
        ],
      },
      {
        id: 'shadow-arts',
        name: 'Shadow Arts',
        type: 'gacha',
        statType: 'damage',
        enchantment: {
          token: 'Arts Lvl Token',
          costPerLevel: 10,
          description: 'Pode ser evoluído para aumentar seu poder usando Arts Lvl Tokens.'
        },
        stats: [
          { name: 'Silent Step', multiplier: '1x', rarity: 'Common', probability: 40.55 },
          { name: 'Shadow Bind', multiplier: '1.5x', rarity: 'Uncommon', probability: 33 },
          { name: 'Mirage Strike', multiplier: '2x', rarity: 'Rare', probability: 19.9 },
          { name: 'Eclipse Slash', multiplier: '2.5x', rarity: 'Epic', probability: 5 },
          { name: 'Abyssal Blade', multiplier: '3x', rarity: 'Legendary', probability: 1 },
          { name: 'Void Erasure', multiplier: '3.5x', rarity: 'Mythic', probability: 0.5 },
          { name: 'Eternal Shadow Waltz', multiplier: '4x', rarity: 'Phantom', probability: 0.05 },
          { name: 'I Am Atomic', multiplier: '5x', rarity: 'Supreme', probability: 0.01 },
        ],
      },
       {
        id: 'eminence-energy',
        name: 'Eminence Energy',
        type: 'progression',
        statType: 'energy',
        maxLevel: 50,
        maxBoost: '0.5x Energy'
      },
      {
        id: 'eminence-damage',
        name: 'Eminence Damage',
        type: 'progression',
        statType: 'damage',
        maxLevel: 50,
        maxBoost: '0.5x Damage'
      },
      {
        id: 'eminence-luck',
        name: 'Eminence Luck',
        type: 'progression',
        statType: 'luck',
        maxLevel: 50,
        maxBoost: '0.5x Luck'
      },
      {
        id: 'eminence-coins',
        name: 'Eminence Coins',
        type: 'progression',
        statType: 'coin',
        maxLevel: 50,
        maxBoost: '0.5x Coins'
      }
    ],
    npcs: [],
    pets: [],
    dungeons: [],
    shadows: [],
    stands: []
  };

