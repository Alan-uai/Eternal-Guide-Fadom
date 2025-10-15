
export const world11Data = {
    name: 'World 11 - Titan City',
    powers: [
        {
            id: 'titan-families',
            name: 'Titan Families',
            type: 'gacha',
            statType: 'energy',
            unlockCost: 'N/A',
            stats: [
                { name: 'Grice Family', multiplier: '2x', rarity: 'Common', probability: 40.55 },
                { name: 'Leonhart Family', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
                { name: 'Braun Family', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
                { name: 'Tybur Family', multiplier: '6x', rarity: 'Epic', probability: 5 },
                { name: 'Ackerman Family', multiplier: '8x', rarity: 'Legendary', probability: 1 },
                { name: 'Yeager Family', multiplier: '12x', rarity: 'Mythic', probability: 0.5 },
                { name: 'Reiss Family', multiplier: '15x', rarity: 'Phantom', probability: 0.05 },
            ]
        },
        {
            id: 'titan-evolution',
            name: 'Titan Evolution',
            type: 'progression',
            statType: 'mixed',
            unlockCost: 'N/A',
            description: 'Evolve os Titãs para 1, 2 ou 3 estrelas para aumentar seu poder.'
        }
    ],
    npcs: [
        { id: 'world11-e-rank', name: 'E Rank NPC', rank: 'E', exp: 9457, hp: '41OcD', world: 'World 11', drops: { coins: { amount: '4.1OcD', probability: 0.8 } } },
        { id: 'world11-d-rank', name: 'D Rank NPC', rank: 'D', exp: 10403, hp: '205OcD', world: 'World 11', drops: { coins: { amount: '20OcD', probability: 0.8 } } },
        { id: 'world11-c-rank', name: 'C Rank NPC', rank: 'C', exp: 11443, hp: '1NvD', world: 'World 11', drops: { coins: { amount: '100OcD', probability: 0.8 } } },
        { id: 'world11-b-rank', name: 'B Rank NPC', rank: 'B', exp: 12587, hp: '5.2NvD', world: 'World 11', drops: { coins: { amount: '520OcD', probability: 0.8 } } },
        { id: 'world11-a-rank', name: 'A Rank NPC', rank: 'A', exp: 13846, hp: '26NvD', world: 'World 11', drops: { coins: { amount: '2.6NvD', probability: 0.8 } } },
        { id: 'world11-s-rank', name: 'S Rank NPC', rank: 'S', exp: 15231, hp: '131NvD', world: 'World 11', drops: { coins: { amount: '13NvD', probability: 0.8 } } },
        { id: 'eran-boss', name: 'Eran', rank: 'SS', exp: 23040, hp: '655NvD', world: 'World 11', drops: { coins: { amount: '65NvD', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    dungeons: [
        {
            id: 'titan-defense',
            name: 'Titan Defense',
            description: 'Uma raid com 1000 salas (w1k).'
        }
    ],
    shadows: [
        {
            id: 'eren-shadow',
            name: 'Eren',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '15.4% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '16.5% Energy',
                }
            ]
        }
    ]
};
