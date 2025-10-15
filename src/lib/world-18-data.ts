export const world18Data = {
    name: 'World 18',
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
    ]
};
