
export const world16Data = {
    name: 'World 16 - Cairo',
    powers: [
      {
        id: 'onomatopoeia-power',
        name: 'Onomatopoeia',
        type: 'gacha',
        statType: 'energy',
        unlockCost: 'N/A',
        stats: [
          { name: 'Common Onomatopoeia', multiplier: '2x', rarity: 'Common', probability: 40.55 },
          { name: 'Uncommon Onomatopoeia', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
          { name: 'Rare Onomatopoeia', multiplier: '4.5x', rarity: 'Rare', probability: 19.9 },
          { name: 'Epic Onomatopoeia', multiplier: '6x', rarity: 'Epic', probability: 5 },
          { name: 'Legendary Onomatopoeia', multiplier: '8x', rarity: 'Legendary', probability: 1 },
          { name: 'Mythical Onomatopoeia', multiplier: '10x', rarity: 'Mythic', probability: 0.5 },
          { name: 'Phantom Onomatopoeia', multiplier: '12x', rarity: 'Phantom', probability: 0.05 },
          { name: 'Supreme Onomatopoeia', multiplier: '15x', rarity: 'Supreme', probability: 0.01 },
        ],
      },
      {
        id: 'stands-power',
        name: 'Stands',
        type: 'gacha',
        statType: 'damage',
        unlockCost: 'N/A',
        description: 'Lutadores com diferentes tempos de ataque e porcentagens de dano, que evoluem com estrelas.',
        // Os stats detalhados para cada stand e nível de estrela precisariam de uma estrutura mais complexa,
        // mas por enquanto estamos capturando a existência do poder.
      },
       {
        id: 'ripple-energy',
        name: 'Ripple Energy',
        type: 'progression',
        statType: 'energy',
        unlockCost: 'N/A',
        maxLevel: 110,
        maxBoost: '1.10x Energy'
      },
      {
        id: 'stand-evolution',
        name: 'Stand Evolution',
        type: 'progression',
        statType: 'mixed',
        unlockCost: 'N/A',
        description: 'Evolua os Stands. 2 de 0★ para 1★ (custo: 1k Exchange Token 1). 2 de 1★ para 2★ (custo: 2.5k Exchange Token 1). 2 de 2★ para 3★ (custo: 5k Exchange Token 1).'
      }
    ],
    npcs: [
        { id: 'world16-e-rank', name: 'E Rank NPC', rank: 'E', exp: 312698, hp: '397QnV', world: 'World 16', drops: { coins: { amount: '39QnV', probability: 0.8 } } },
        { id: 'world16-d-rank', name: 'D Rank NPC', rank: 'D', exp: 343968, hp: '1.9SeV', world: 'World 16', drops: { coins: { amount: '190QnV', probability: 0.8 } } },
        { id: 'world16-c-rank', name: 'C Rank NPC', rank: 'C', exp: 378365, hp: '9.8SeV', world: 'World 16', drops: { coins: { amount: '980QnV', probability: 0.8 } } },
        { id: 'world16-b-rank', name: 'B Rank NPC', rank: 'B', exp: 416201, hp: '49SeV', world: 'World 16', drops: { coins: { amount: '4.9SeV', probability: 0.8 } } },
        { id: 'world16-a-rank', name: 'A Rank NPC', rank: 'A', exp: 457821, hp: '248SeV', world: 'World 16', drops: { coins: { amount: '24SeV', probability: 0.8 } } },
        { id: 'world16-s-rank', name: 'S Rank NPC', rank: 'S', exp: 503603, hp: '1.2SPG', world: 'World 16', drops: { coins: { amount: '120SeV', probability: 0.8 } } },
        { id: 'dio-boss', name: 'Dio', rank: 'SS', exp: 737280, hp: '6.2SPG', world: 'World 16', drops: { coins: { amount: '620SeV', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'dio-shadow',
            name: 'Dio',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '26.6% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '28.5% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ],
    stands: []
};
