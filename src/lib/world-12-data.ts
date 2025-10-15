export const world12Data = {
    name: 'World 12',
    npcs: [
        { id: 'world12-e-rank', name: 'E Rank NPC', rank: 'E', exp: 19083, hp: '6.5Vgn', world: 'World 12', drops: { coins: { amount: '650NvD', probability: 0.8 } } },
        { id: 'world12-d-rank', name: 'D Rank NPC', rank: 'D', exp: 20942, hp: '32Vgn', world: 'World 12', drops: { coins: { amount: '3.2Vgn', probability: 0.8 } } },
        { id: 'world12-c-rank', name: 'C Rank NPC', rank: 'C', exp: 23037, hp: '164Vgn', world: 'World 12', drops: { coins: { amount: '16Vgn', probability: 0.8 } } },
        { id: 'world12-b-rank', name: 'B Rank NPC', rank: 'B', exp: 25340, hp: '824Vgn', world: 'World 12', drops: { coins: { amount: '82Vgn', probability: 0.8 } } },
        { id: 'world12-a-rank', name: 'A Rank NPC', rank: 'A', exp: 27874, hp: '4.1UVg', world: 'World 12', drops: { coins: { amount: '410Vgn', probability: 0.8 } } },
        { id: 'world12-s-rank', name: 'S Rank NPC', rank: 'S', exp: 30662, hp: '20UVg', world: 'World 12', drops: { coins: { amount: '2UVg', probability: 0.8 } } },
        { id: 'escanor-boss', name: 'Esanor', rank: 'SS', exp: 46080, hp: '104UVg', world: 'World 12', drops: { coins: { amount: '10UVg', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    shadows: [
        {
            id: 'escanor-shadow',
            name: 'Escanor',
            type: 'Damage',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '19.6% Damage',
                    cooldown: '2s',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '21% Damage',
                    cooldown: '2s',
                }
            ]
        }
    ]
};

    