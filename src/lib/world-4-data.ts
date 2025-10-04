
export const world4Data = {
    name: 'World 4 - Curses',
    powers: [
      {
        id: 'curses',
        name: 'Curses',
        type: 'gacha',
        statType: 'energy',
        stats: [
          { name: 'Blazing Cataclysm', multiplier: '2x' },
          { name: 'Nullborn Phantom', multiplier: '3x' },
          { name: 'Infernal Crater', multiplier: '4x' },
          { name: 'Abyssal Tide', multiplier: '5x' },
          { name: 'Verdant Calamity', multiplier: '8x' },
          { name: 'Soulbender', multiplier: '10x' },
          { name: 'Wandered Mind', multiplier: '12x' },
        ],
      },
      {
        id: 'swords-world4',
        name: 'Swords',
        type: 'gacha',
        statType: 'damage',
        stats: [
          { name: 'Bloodthorn', multiplier: '0.5x' },
          { name: 'Eclipse Warden', multiplier: '0.9x' },
          { name: 'Obsidian Reaver', multiplier: '1.5x' },
          { name: 'Aquarius Edge', multiplier: '2x' },
          { name: 'Doomsoul', multiplier: '2.5x' },
          { name: 'Redmourne', multiplier: '3x' },
          { name: 'Venomstrike', multiplier: '4x' },
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
            { name: 'Common Curse', multiplier: '0.6x', statType: 'damage' },
            { name: 'Uncommon Curse', multiplier: '0.8x', statType: 'damage' },
            { name: 'Rare Curse', multiplier: '1x', statType: 'damage', energy_crit_bonus: '1.00%' },
            { name: 'Epic Curse', multiplier: '2x', statType: 'damage', energy_crit_bonus: '2.00%' },
            { name: 'Legendary Curse', multiplier: '3x', statType: 'damage', energy_crit_bonus: '3.00%' },
            { name: 'Mythical Curse', multiplier: '4x', statType: 'damage', energy_crit_bonus: '4.00%' },
            { name: 'Phantom Curse', multiplier: '5x', statType: 'damage', energy_crit_bonus: '5.00%' }
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

    