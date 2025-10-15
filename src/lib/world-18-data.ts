
export const world18Data = {
    name: 'World 18 - Debiru Hunter',
    powers: [
      {
        id: 'debiru-hunter',
        name: 'Debiru Hunter',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A',
        stats: [
          { name: 'Rookie Hunter', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { name: 'Field Hunter', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { name: 'Contract Hunter', multiplier: '4.5x', rarity: 'Rare', probability: 19.9 },
          { name: 'Fiend Hunter', multiplier: '6x', rarity: 'Epic', probability: 5 },
          { name: 'Hybrid Hunter', multiplier: '8x', rarity: 'Legendary', probability: 1 },
          { name: 'Veteran Hunter', multiplier: '10x', rarity: 'Mythic', probability: 0.5 },
          { name: 'Special Division Hunter', multiplier: '12x', rarity: 'Phantom', probability: 0.05 },
          { name: 'Primal Threat Hunter', multiplier: '15x', rarity: 'Supreme', probability: 0.01 },
        ]
      },
      {
        id: 'akuma-powers',
        name: 'Akuma Powers',
        type: 'gacha',
        statType: 'damage',
        unlockCost: 'N/A',
        stats: [
          { name: 'Akuma: Ghost', multiplier: '1x', rarity: 'Common', probability: 40.55 },
          { name: 'Akuma: Fox', multiplier: '1.5x', rarity: 'Uncommon', probability: 33 },
          { name: 'Akuma: Future', multiplier: '2x', rarity: 'Rare', probability: 19.9 },
          { name: 'Akuma: Curse', multiplier: '3x', rarity: 'Epic', probability: 5 },
          { name: 'Akuma: Angel', multiplier: '5x', rarity: 'Legendary', probability: 1 },
          { name: 'Akuma: Crossbow', multiplier: '7x', rarity: 'Mythic', probability: 0.5 },
          { name: 'Akuma: Pokita', multiplier: '9x', rarity: 'Phantom', probability: 0.05 },
          { name: 'Akuma: Control', multiplier: '12x', rarity: 'Supreme', probability: 0.01 },
        ]
      },
      {
        id: 'akuma-energy',
        name: 'Akuma Energy',
        type: 'progression',
        statType: 'energy',
        unlockCost: 'N/A',
        maxLevel: 160,
        maxBoost: '1.60x Energy'
      },
      {
        id: 'akuma-damage',
        name: 'Akuma Damage',
        type: 'progression',
        statType: 'damage',
        unlockCost: 'N/A',
        maxLevel: 110,
        maxBoost: '1.10x Damage'
      },
      {
        id: 'pokita-leveling',
        name: 'Pokita Leveling',
        type: 'progression',
        statType: 'mixed',
        unlockCost: 'N/A',
        description: 'Evolua o pet Pokita até o nível 50 usando Pokita Tokens.'
      }
    ],
    npcs: [
        { id: 'world18-e-rank', name: 'E Rank NPC', rank: 'E', exp: 1267295, hp: '97OVG', world: 'World 18', drops: { coins: { amount: '9.7OVG', probability: 0.8 } } },
        { id: 'world18-d-rank', name: 'D Rank NPC', rank: 'D', exp: 1394024, hp: '488OVG', world: 'World 18', drops: { coins: { amount: '48OVG', probability: 0.8 } } },
        { id: 'world18-c-rank', name: 'C Rank NPC', rank: 'C', exp: 1533427, hp: '2.4NVG', world: 'World 18', drops: { coins: { amount: '240OVG', probability: 0.8 } } },
        { id: 'world18-b-rank', name: 'B Rank NPC', rank: 'B', exp: 1686770, hp: '12NVG', world: 'World 18', drops: { coins: { amount: '1.2NVG', probability: 0.8 } } },
        { id: 'world18-a-rank', name: 'A Rank NPC', rank: 'A', exp: 1855446, hp: '61NVG', world: 'World 18', drops: { coins: { amount: '6.1NVG', probability: 0.8 } } },
        { id: 'world18-s-rank', name: 'S Rank NPC', rank: 'S', exp: 2040991, hp: '305NVG', world: 'World 18', drops: { coins: { amount: '30NVG', probability: 0.8 } } },
        { id: 'mr-chainsaw-boss', name: 'Mr Chainsaw', rank: 'SS', exp: 2551204, hp: '1.5TGN', world: 'World 18', drops: { coins: { amount: '150NVG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
        { id: 'world18-sss-rank', name: 'SSS Rank NPC', rank: 'SSS', exp: 3189005, hp: '7.7TGN', world: 'World 18', drops: { coins: { amount: '770NVG', probability: 1 } } },
    ],
    shadows: [
        {
            id: 'mr-chainsaw-shadow',
            name: 'Mr Chainsaw',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '30.8% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '33% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ],
    dungeons: [
        {
            id: 'chainsaw-defense',
            name: 'Chainsaw Defense',
            description: 'Vai até a wave 1000 (w1k). Tem chance de dropar o pet Pokita.'
        }
    ],
    pets: [
        { id: 'pokita-common', name: 'Pokita Pet', rank: 'Common', rarity: 'Common', energy_bonus: '1x' },
        { id: 'pokita-uncommon', name: 'Pokita Pet', rank: 'Uncommon', rarity: 'Uncommon', energy_bonus: '1.2x' },
        { id: 'pokita-rare', name: 'Pokita Pet', rank: 'Rare', rarity: 'Rare', energy_bonus: '1.4x' },
        { id: 'pokita-epic', name: 'Pokita Pet', rank: 'Epic', rarity: 'Epic', energy_bonus: '1.6x' },
        { id: 'pokita-legendary', name: 'Pokita Pet', rank: 'Legendary', rarity: 'Legendary', energy_bonus: '1.8x' },
        { id: 'pokita-mythical', name: 'Pokita Pet', rank: 'Mythical', rarity: 'Mythic', energy_bonus: '2.0x' },
        { id: 'pokita-phantom', name: 'Pokita Pet', rank: 'Phantom', rarity: 'Phantom', energy_bonus: '2.4x' },
        { id: 'pokita-supreme', name: 'Pokita Pet', rank: 'Supreme', rarity: 'Supreme', energy_bonus: '3.0x' },
    ]
};
