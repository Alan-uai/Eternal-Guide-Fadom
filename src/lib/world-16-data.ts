export const world16Data = {
    name: 'World 16',
    powers: [
        {
            id: 'stands',
            name: 'Stands',
            type: 'gacha',
            unlockCost: '900Qn',
            statType: 'energy'
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
    ]
};

    