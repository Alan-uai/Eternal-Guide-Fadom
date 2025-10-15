export const world20Data = {
    name: 'World 20 - Green Planet',
    powers: [
      {
        id: 'grand-elder-power',
        name: 'Grand Elder Power',
        type: 'gacha',
        statType: 'energy',
        unlockCost: '1.50OcTG',
        stats: [
          { name: 'Sleeping Power', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { name: 'Stirring Spirit', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { name: 'Hidden Potential', multiplier: '4.5x', rarity: 'Rare', probability: 19.9 },
          { name: 'Inner Strength', multiplier: '6x', rarity: 'Legendary', probability: 5 },
          { name: 'Power Unleashed', multiplier: '8x', rarity: 'Mythic', probability: 1 },
          { name: 'True Potential', multiplier: '10x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Limitless Growth', multiplier: '12x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Potential Unbound', multiplier: '15x', rarity: 'Supreme', probability: 0.05 },
        ],
      },
      {
        id: 'frost-demon-evolution',
        name: 'Frost Demon Evolution',
        type: 'gacha',
        statType: 'damage',
        unlockCost: '2.00OcTG',
        stats: [
          { name: 'Second Form', multiplier: '1x', rarity: 'Common', probability: 40.55 },
          { name: 'Third Form', multiplier: '1.5x', rarity: 'Uncommon', probability: 33 },
          { name: 'Final Form', multiplier: '2x', rarity: 'Rare', probability: 19.9 },
          { name: '50% Power', multiplier: '3x', rarity: 'Legendary', probability: 5 },
          { name: '100% Full Power', multiplier: '5x', rarity: 'Mythic', probability: 1 },
          { name: 'Mecha Form', multiplier: '7x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Golden Form', multiplier: '9x', rarity: 'Phantom', probability: 0.5 },
          { name: 'Black Form', multiplier: '12x', rarity: 'Supreme', probability: 0.05 },
        ],
      },
       {
        id: 'dragon-energy',
        name: 'Dragon Energy',
        type: 'progression',
        unlockCost: '2.5OcTG',
        statType: 'energy',
        maxLevel: 50,
        maxBoost: '1x Energy'
      },
      {
        id: 'dragon-damage',
        name: 'Dragon Damage',
        type: 'progression',
        unlockCost: '3.0OcTG',
        statType: 'damage',
        maxLevel: 500,
        maxBoost: '10x Damage'
      }
    ],
    npcs: [
      { id: 'world20-e-rank', name: 'E Rank NPC', rank: 'E', exp: 8024882, hp: '605UTG', world: 'World 20', drops: { coins: { amount: '60UTG', probability: 0.8 } } },
      { id: 'world20-d-rank', name: 'D Rank NPC', rank: 'D', exp: 8827370, hp: '3DTG', world: 'World 20', drops: { coins: { amount: '300UTG', probability: 0.8 } } },
      { id: 'world20-c-rank', name: 'C Rank NPC', rank: 'C', exp: 9710107, hp: '15DTG', world: 'World 20', drops: { coins: { amount: '1.5DTG', probability: 0.8 } } },
      { id: 'world20-b-rank', name: 'B Rank NPC', rank: 'B', exp: 10681118, hp: '75DTG', world: 'World 20', drops: { coins: { amount: '7.5DTG', probability: 0.8 } } },
      { id: 'world20-a-rank', name: 'A Rank NPC', rank: 'A', exp: 11749230, hp: '378DTG', world: 'World 20', drops: { coins: { amount: '37DTG', probability: 0.8 } } },
      { id: 'world20-s-rank', name: 'S Rank NPC', rank: 'S', exp: 12924153, hp: '1.8tsTG', world: 'World 20', drops: { coins: { amount: '180DTG', probability: 0.8 } } },
      { id: 'koku-ssj-boss', name: 'Koku SSJ', rank: 'SS', exp: 16155191, hp: '9.4tsTG', world: 'World 20', drops: { coins: { amount: '940DTG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
      { id: 'frezi-final-form-boss', name: 'Frezi Final Form', rank: 'SSS', exp: 24232787, hp: '47qTG', world: 'World 20', drops: { coins: { amount: '4.7qTG', probability: 1 } } },
    ],
    pets: [],
    dungeons: [
        {
            id: 'dungeon-lobby-2',
            name: 'Lobby de Dungeons 2',
            description: 'Um novo lobby de dungeons desbloqueado no Mundo 20. Usa Exchange Tokens 2 e contém as raids: Green, Suffering, Mundo e Hollow.'
        }
    ],
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
    ],
    obelisks: [
        {
            id: 'luck-obelisk',
            name: 'Obelisco da Sorte',
            statType: 'luck',
            maxLevel: 10
        }
    ]
  };

    