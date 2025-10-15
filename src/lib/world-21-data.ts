
export const world21Data = {
    name: 'World 21 - Hollow World',
    powers: [
        {
            id: 'bankai',
            name: 'Bankai',
            type: 'gacha',
            unlockCost: '6k',
            statType: 'mixed'
        },
        {
            id: 'espada',
            name: 'Espada',
            type: 'gacha',
            unlockCost: '2k',
            statType: 'mixed',
            stats: [
                { "name": "Espada 9", "multiplier": "1x" },
                { "name": "Espada 8", "multiplier": "2x" },
                { "name": "Espada 7", "multiplier": "3x" },
                { "name": "Espada 6", "multiplier": "4x" },
                { "name": "Espada 5", "multiplier": "5x" },
                { "name": "Espada 4", "multiplier": "6x" },
                { "name": "Espada 3", "multiplier": "7.5x" },
                { "name": "Espada 2", "multiplier": "10x" },
                { "name": "Espada 1", "multiplier": "12x" },
                { "name": "Espada 0", "multiplier": "15x" }
            ]
        },
        {
            id: 'hollow-power',
            name: 'Hollow Power',
            type: 'gacha',
            unlockCost: 'N/A',
            statType: 'damage',
            stats: [
              { name: 'Common Hollow Power', multiplier: '1x', rarity: 'Common' },
              { name: 'Uncommon Hollow Power', multiplier: '1.5x', rarity: 'Uncommon' },
              { name: 'Rare Hollow Power', multiplier: '2x', rarity: 'Rare' },
              { name: 'Epic Hollow Power', multiplier: '3x', rarity: 'Epic' },
              { name: 'Legendary Hollow Power', multiplier: '5x', rarity: 'Legendary' },
              { name: 'Mythical Hollow Power', multiplier: '7x', rarity: 'Mythic' },
              { name: 'Phantom Hollow Power', multiplier: '10x', rarity: 'Phantom' },
              { name: 'Supreme Hollow Power', multiplier: '12x', rarity: 'Supreme' }
            ]
        }
    ],
    npcs: [
        { id: 'world21-e-rank', name: 'E Rank NPC', rank: 'E', exp: 20193989, hp: '47qTG', world: 'World 21', drops: { coins: { amount: '4.7qTG', probability: 0.8 } } },
        { id: 'world21-d-rank', name: 'D Rank NPC', rank: 'D', exp: 22213388, hp: '237qTG', world: 'World 21', drops: { coins: { amount: '23qTG', probability: 0.8 } } },
        { id: 'world21-c-rank', name: 'C Rank NPC', rank: 'C', exp: 24434727, hp: '1.1QnTG', world: 'World 21', drops: { coins: { amount: '110qTG', probability: 0.8 } } },
        { id: 'world21-b-rank', name: 'B Rank NPC', rank: 'B', exp: 26878199, hp: '5.9QnTG', world: 'World 21', drops: { coins: { amount: '590qTG', probability: 0.8 } } },
        { id: 'world21-a-rank', name: 'A Rank NPC', rank: 'A', exp: 29566019, hp: '29QnTG', world: 'World 21', drops: { coins: { amount: '2.9QnTG', probability: 0.8 } } },
        { id: 'world21-s-rank', name: 'S Rank NPC', rank: 'S', exp: 32522621, hp: '148QnTG', world: 'World 21', drops: { coins: { amount: '14QnTG', probability: 0.8 } } },
        { id: 'cifer-boss', name: 'Cifer', rank: 'SSS', exp: 40653277, hp: '744QnTG', world: 'World 21', drops: { coins: { amount: '74QnTG', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
        { id: 'vasto-ichge-boss', name: 'Vasto Ichge', rank: 'SSS', exp: 60979915, hp: '3.7ssTG', world: 'World 21', drops: { coins: { amount: '370QnTG', probability: 1 } } },
    ],
    shadows: [
        {
            id: 'cifer-shadow',
            name: 'Cifer',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '35% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supremo',
                    bonus: '37.5% Energy',
                }
            ]
        }
    ]
};
