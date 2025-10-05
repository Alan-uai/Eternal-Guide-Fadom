
export const world4Data = {
    name: 'World 4 - Curses',
    powers: [
      {
        id: 'curses',
        name: 'Curses',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Blazing Cataclysm', multiplier: '2x', rarity: 'Common' },
          { name: 'Nullborn Phantom', multiplier: '3x', rarity: 'Uncommon' },
          { name: 'Infernal Crater', multiplier: '4x', rarity: 'Rare' },
          { name: 'Abyssal Tide', multiplier: '5x', rarity: 'Legendary' },
          { name: 'Verdant Calamity', multiplier: '8x', rarity: 'Mythic' },
          { name: 'Soulbender', multiplier: '10x', rarity: 'Phantom' },
          { name: 'Wandered Mind', multiplier: '12x', rarity: 'Supreme' },
        ],
      },
      {
        id: 'swords-world4',
        name: 'Swords',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Bloodthorn', multiplier: '0.5x', rarity: 'Common' },
          { name: 'Eclipse Warden', multiplier: '0.9x', rarity: 'Uncommon' },
          { name: 'Obsidian Reaver', multiplier: '1.5x', rarity: 'Rare' },
          { name: 'Aquarius Edge', multiplier: '2x', rarity: 'Legendary' },
          { name: 'Doomsoul', multiplier: '2.5x', rarity: 'Mythic' },
          { name: 'Redmourne', multiplier: '3x', rarity: 'Phantom' },
          { name: 'Venomstrike', multiplier: '4x', rarity: 'Supreme' },
        ],
      },
      {
        id: 'cursed-progression',
        name: 'Cursed Progression',
        type: 'progression',
        statType: 'damage',
        maxLevel: 410,
        maxBoost: '4.10x Damage'
      },
      {
        id: 'cursed-power',
        name: 'Cursed Power',
        type: 'gacha',
        statType: 'mixed',
        stats: [
            { name: 'Common Curse', multiplier: '0.6x', statType: 'damage', rarity: 'Common' },
            { name: 'Uncommon Curse', multiplier: '0.8x', statType: 'damage', rarity: 'Uncommon' },
            { name: 'Rare Curse', multiplier: '1x', statType: 'damage', energy_crit_bonus: '1.00%', rarity: 'Rare' },
            { name: 'Epic Curse', multiplier: '2x', statType: 'damage', energy_crit_bonus: '2.00%', rarity: 'Legendary' },
            { name: 'Legendary Curse', multiplier: '3x', statType: 'damage', energy_crit_bonus: '3.00%', rarity: 'Mythic' },
            { name: 'Mythical Curse', multiplier: '4x', statType: 'damage', energy_crit_bonus: '4.00%', rarity: 'Phantom' },
            { name: 'Phantom Curse', multiplier: '5x', statType: 'damage', energy_crit_bonus: '5.00%', rarity: 'Supreme' }
        ]
      }
    ],
    npcs: [],
    pets: [],
    dungeons: [
        {
            id: 'cursed-dungeon',
            name: 'Cursed Dungeon',
            description: 'The Cursed Raid is located in World 4.'
        }
    ],
  };

    
