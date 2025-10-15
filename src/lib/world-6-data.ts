export const world6Data = {
    name: 'World 6',
    npcs: [
        { id: 'world6-e-rank', name: 'E Rank NPC', rank: 'E', exp: 119, hp: '2.2N', world: 'World 6', drops: { coins: { amount: '220O', probability: 0.8 } } },
        { id: 'world6-d-rank', name: 'D Rank NPC', rank: 'D', exp: 131, hp: '11.2N', world: 'World 6', drops: { coins: { amount: '1.1N', probability: 0.8 } } },
        { id: 'world6-c-rank', name: 'C Rank NPC', rank: 'C', exp: 144, hp: '56N', world: 'World 6', drops: { coins: { amount: '5.6N', probability: 0.8 } } },
        { id: 'world6-b-rank', name: 'B Rank NPC', rank: 'B', exp: 159, hp: '280N', world: 'World 6', drops: { coins: { amount: '28N', probability: 0.8 } } },
        { id: 'world6-a-rank', name: 'A Rank NPC', rank: 'A', exp: 174, hp: '1.4de', world: 'World 6', drops: { coins: { amount: '140N', probability: 0.8 } } },
        { id: 'world6-s-rank', name: 'S Rank NPC', rank: 'S', exp: 192, hp: '7de', world: 'World 6', drops: { coins: { amount: '700N', probability: 0.8 } } },
        { id: 'statue-of-god-boss', name: 'Statue of God', rank: 'SS', exp: 480, hp: '35de', world: 'World 6', drops: { coins: { amount: '3.5de', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'statue-of-god-shadow',
            name: 'Statue of God',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '7% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '7.5% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ]
};

    