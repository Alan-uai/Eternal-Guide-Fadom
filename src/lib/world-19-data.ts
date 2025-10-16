
export const world19Data = {
    id: '019',
    name: 'World 19 - Tokyo Empire',
    powers: [
      {
        id: 'special-fire-force',
        name: 'Special Fire Force',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A',
        stats: [
          { id: 'company-1', name: 'Company 1', multiplier: '2x', rarity: 'Common' },
          { id: 'company-2', name: 'Company 2', multiplier: '3x', rarity: 'Uncommon' },
          { id: 'company-3', name: 'Company 3', multiplier: '4.5x', rarity: 'Rare' },
          { id: 'company-4', name: 'Company 4', multiplier: '6x', rarity: 'Epic' },
          { id: 'company-5', name: 'Company 5', multiplier: '8x', rarity: 'Legendary' },
          { id: 'company-6', name: 'Company 6', multiplier: '10x', rarity: 'Mythic' },
          { id: 'company-7', name: 'Company 7', multiplier: '12x', rarity: 'Phantom' },
          { id: 'company-8', name: 'Company 8', multiplier: '15x', rarity: 'Supreme' }
        ]
      },
      {
        id: 'pyrokinetics',
        name: 'Pyrokinetics',
        type: 'gacha',
        statType: 'mixed',
        unlockCost: 'N/A',
        stats: [
          { id: '1st-gen', name: '1st Generation', multiplier: '1x', rarity: 'Common' },
          { id: '1st-gen-lv20', name: '1st Generation (lv.20)', multiplier: '1.2x', rarity: 'Common' },
          { id: '2nd-gen', name: '2nd Generation', multiplier: '2x', rarity: 'Uncommon', damage_bonus: '0.2x' },
          { id: '2nd-gen-lv40', name: '2nd Generation (lv.40)', multiplier: '2.8x', rarity: 'Uncommon', damage_bonus: '0.28x' },
          { id: '3rd-gen', name: '3rd Generation', multiplier: '3x', rarity: 'Rare', damage_bonus: '0.4x' },
          { id: '3rd-gen-lv60', name: '3rd Generation (Lv.60)', multiplier: '4.8x', rarity: 'Rare', damage_bonus: '0.64x' },
          { id: 'hybrid-pyro', name: 'Hybrid', multiplier: '4x', rarity: 'Epic', damage_bonus: '1x' },
          { id: 'hybrid-pyro-lv80', name: 'Hybrid (Lv.80)', multiplier: '7.2x', rarity: 'Epic', damage_bonus: '1.8x' },
          { id: 'adolla-user', name: 'Adolla User', multiplier: '5x', rarity: 'Legendary', damage_bonus: '1.5x' },
          { id: 'adolla-user-lv100', name: 'Adolla User (Lv.100)', multiplier: '10x', rarity: 'Legendary', damage_bonus: '3x' }
        ]
      },
      {
        id: 'adolla-generation',
        name: 'Adolla Generation',
        type: 'progression',
        statType: 'mixed',
        unlockCost: 'N/A',
        description: 'Evolua o poder Adolla. Geração 1->2 (lvl 20), 2->3 (lvl 40), 3->4 (lvl 60), 4->5 (lvl 80). Nível máximo é 100.'
      }
    ],
    dungeons: [
      {
        id: 'netherworld-defense',
        name: 'Netherworld Defense',
        description: 'Uma raid de defesa que vai até a wave 100 (w100).'
      }
    ],
    npcs: [
      { id: 'world19-e-rank', name: 'E Rank NPC', rank: 'E', exp: 2551239, hp: '7.7TGN', world: 'World 19', drops: { coins: { amount: '770NVG', probability: 0.8 } } },
      { id: 'world19-d-rank', name: 'D Rank NPC', rank: 'D', exp: 2806363, hp: '38TGN', world: 'World 19', drops: { coins: { amount: '3.8TGN', probability: 0.8 } } },
      { id: 'world19-c-rank', name: 'C Rank NPC', rank: 'C', exp: 3086999, hp: '193TGN', world: 'World 19', drops: { coins: { amount: '19TGN', probability: 0.8 } } },
      { id: 'world19-b-rank', name: 'B Rank NPC', rank: 'B', exp: 3395699, hp: '965TGN', world: 'World 19', drops: { coins: { amount: '96TGN', probability: 0.8 } } },
      { id: 'world19-a-rank', name: 'A Rank NPC', rank: 'A', exp: 3735269, hp: '4.8UTG', world: 'World 19', drops: { coins: { amount: '480TGN', probability: 0.8 } } },
      { id: 'world19-s-rank', name: 'S Rank NPC', rank: 'S', exp: 4108796, hp: '24UTG', world: 'World 19', drops: { coins: { amount: '2.4UTG', probability: 0.8 } } },
      { id: 'hero-of-hell-boss', name: 'Hero of Hell', rank: 'SS', exp: 5135995, hp: '121UTG', world: 'World 19', drops: { coins: { amount: '12UTG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
      { id: 'leonardo-boss', name: 'Leonardo', rank: 'SS', exp: 5135995, hp: '121UTG', world: 'World 19', drops: { coins: { amount: '12UTG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
      { id: 'bansho-boss', name: 'Bansho', rank: 'SSS', exp: 6419993, hp: '605UTG', world: 'World 19', drops: { coins: { amount: '60UTG', probability: 1 } } },
    ],
    shadows: [
        {
            id: 'leonardo-shadow',
            name: 'Leonardo',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '30.8% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '33% Energy',
                }
            ]
        }
    ]
};
