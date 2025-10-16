
export const world4Data = {
    id: '004',
    name: 'World 4 - Cursed School',
    powers: [
      {
        id: 'curses',
        name: 'Curses',
        type: 'gacha',
        statType: 'energy',
        unlockCost: '500k',
        stats: [
          { id: 'blazing-cataclysm', name: 'Blazing Cataclysm', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { id: 'nullborn-phantom', name: 'Nullborn Phantom', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { id: 'infernal-crater', name: 'Infernal Crater', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
          { id: 'abyssal-tide', name: 'Abyssal Tide', multiplier: '5x', rarity: 'Epic', probability: 5 },
          { id: 'verdant-calamity', name: 'Verdant Calamity', multiplier: '6x', rarity: 'Legendary', probability: 1 },
          { id: 'soulbender', name: 'Soulbender', multiplier: '8x', rarity: 'Mythic', probability: 0.5 },
          { id: 'wandered-mind', name: 'Wandered Mind', multiplier: '10x', rarity: 'Phantom', probability: 0.05 },
        ],
      },
      {
        id: 'swords-world4',
        name: 'Swords',
        type: 'gacha',
        statType: 'damage',
        unlockCost: '1M',
        stats: [
          { id: 'bloodthorn-sword', name: 'Bloodthorn', multiplier: '0.5x', rarity: 'Common', probability: 40.55 },
          { id: 'eclipse-warden-sword', name: 'Eclipse Warden', multiplier: '0.9x', rarity: 'Uncommon', probability: 33 },
          { id: 'obsidian-reaver-sword', name: 'Obsidian Reaver', multiplier: '1.5x', rarity: 'Rare', probability: 19.9 },
          { id: 'aquarius-edge-sword', name: 'Aquarius Edge', multiplier: '2x', rarity: 'Epic', probability: 5 },
          { id: 'doomsoul-sword', name: 'Doomsoul', multiplier: '2.5x', rarity: 'Legendary', probability: 1 },
          { id: 'redmourne-sword', name: 'Redmourne', multiplier: '3x', rarity: 'Mythic', probability: 0.5 },
          { id: 'venomstrike-sword', name: 'Venomstrike', multiplier: '4x', rarity: 'Phantom', probability: 0.05 },
        ],
      },
      {
        id: 'cursed-progression',
        name: 'Cursed Progression',
        type: 'progression',
        unlockCost: '2.5M',
        statType: 'damage',
        maxLevel: 410,
        maxBoost: '4.10x Damage'
      },
      {
        id: 'cursed-power',
        name: 'Cursed Power',
        type: 'gacha',
        unlockCost: '1.5M',
        statType: 'mixed',
        stats: [
            { id: 'common-curse', name: 'Common Curse', multiplier: '0.6x', statType: 'damage', rarity: 'Common', probability: 40.55 },
            { id: 'uncommon-curse', name: 'Uncommon Curse', multiplier: '0.8x', statType: 'damage', rarity: 'Uncommon', probability: 33 },
            { id: 'rare-curse', name: 'Rare Curse', multiplier: '1x', statType: 'damage', energy_crit_bonus: '1.00%', rarity: 'Rare', probability: 19.9 },
            { id: 'epic-curse', name: 'Epic Curse', multiplier: '2x', statType: 'damage', energy_crit_bonus: '2.00%', rarity: 'Epic', probability: 5 },
            { id: 'legendary-curse', name: 'Legendary Curse', multiplier: '3x', statType: 'damage', energy_crit_bonus: '3.00%', rarity: 'Legendary', probability: 1 },
            { id: 'mythical-curse', name: 'Mythical Curse', multiplier: '4x', statType: 'damage', energy_crit_bonus: '4.00%', rarity: 'Mythic', probability: 0.5 },
            { id: 'phantom-curse', name: 'Phantom Curse', multiplier: '5x', statType: 'damage', energy_crit_bonus: '5.00%', rarity: 'Phantom', probability: 0.05 }
        ]
      }
    ],
    npcs: [
        { id: 'world4-e-rank', name: 'E Rank NPC', rank: 'E', exp: 39, hp: '91Qn', world: 'World 4', drops: { coins: { amount: '9.1Qn', probability: 0.8 } } },
        { id: 'world4-d-rank', name: 'D Rank NPC', rank: 'D', exp: 41, hp: '455Qn', world: 'World 4', drops: { coins: { amount: '45Qn', probability: 0.8 } } },
        { id: 'world4-c-rank', name: 'C Rank NPC', rank: 'C', exp: 43, hp: '2.2sx', world: 'World 4', drops: { coins: { amount: '220Qn', probability: 0.8 } } },
        { id: 'world4-b-rank', name: 'B Rank NPC', rank: 'B', exp: 45, hp: '11.3sx', world: 'World 4', drops: { coins: { amount: '1.1sx', probability: 0.8 } } },
        { id: 'world4-a-rank', name: 'A Rank NPC', rank: 'A', exp: 47, hp: '56sx', world: 'World 4', drops: { coins: { amount: '5.6sx', probability: 0.8 } } },
        { id: 'world4-s-rank', name: 'S Rank NPC', rank: 'S', exp: 50, hp: '284sx', world: 'World 4', drops: { coins: { amount: '28sx', probability: 0.8 } } },
        { id: 'sakuni-boss', name: 'Sakuni', rank: 'SS', exp: 120, hp: '1.4Sp', world: 'World 4', drops: { coins: { amount: '140sx', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    pets: [
        { id: 'itodo', name: 'Itodo', energy_bonus: '47' },
        { id: 'nebara', name: 'Nebara', energy_bonus: '94' },
        { id: 'magum', name: 'Magum', energy_bonus: '141' },
        { id: 'meki', name: 'Meki', energy_bonus: '188' },
        { id: 'tage', name: 'Tage', energy_bonus: '234' },
        { id: 'gajo', name: 'Gajo', energy_bonus: '313' },
        { id: 'sakuni-pet', name: 'Sakuni', energy_bonus: '703' }
    ],
    dungeons: [
        {
            id: 'cursed-dungeon',
            name: 'Cursed Raid',
            description: 'A Cursed Raid está localizada no Mundo 4. Ela vai até a wave 1000 (w1k) e dropa 11 tokens para poderes de mundos iniciais, cada um com 9% de chance de drop.'
        }
    ],
  };
