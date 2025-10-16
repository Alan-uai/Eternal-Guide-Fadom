
export const world9Data = {
    id: '009',
    name: 'World 9 - Spirit Residence',
    powers: [
        {
            id: 'psychic-mayhem',
            name: 'Psychic Mayhem',
            type: 'gacha',
            statType: 'energy',
            unlockCost: 'N/A', // Custo não especificado
            stats: [
                { id: 'illusion-casting', name: 'Illusion Casting', multiplier: '2x', rarity: 'Common' },
                { id: 'mind-swap', name: 'Mind Swap', multiplier: '3x', rarity: 'Uncommon' },
                { id: 'brain-freeze-field', name: 'Brain Freeze Field', multiplier: '4x', rarity: 'Rare' },
                { id: 'kinetic-absorption', name: 'Kinetic Absorption', multiplier: '5x', rarity: 'Epic' },
                { id: 'precognition', name: 'Precognition', multiplier: '8x', rarity: 'Legendary' },
                { id: 'psychic-barrier', name: 'Psychic Barrier', multiplier: '10x', rarity: 'Mythic' },
                { id: 'energy-aura-blast', name: 'Energy Aura Blast', multiplier: '12x', rarity: 'Phantom' }
            ]
        },
        {
            id: 'lucky-spirit',
            name: 'Lucky Spirit',
            type: 'progression',
            statType: 'luck',
            unlockCost: 'N/A',
            maxLevel: 50,
            maxBoost: '50% Luckboost'
        },
        {
            id: 'spiritual-upgrade',
            name: 'Spiritual Upgrade',
            type: 'progression',
            statType: 'damage',
            unlockCost: 'N/A',
            maxLevel: 60,
            maxBoost: '0,6x Damage'
        }
    ],
    npcs: [
        { id: 'world9-e-rank', name: 'E Rank NPC', rank: 'E', exp: 972, hp: '16qdD', world: 'World 9', drops: { coins: { amount: '1.6qdD', probability: 0.8 } } },
        { id: 'world9-d-rank', name: 'D Rank NPC', rank: 'D', exp: 1215, hp: '84qdD', world: 'World 9', drops: { coins: { amount: '8.4qdD', probability: 0.8 } } },
        { id: 'world9-c-rank', name: 'C Rank NPC', rank: 'C', exp: 1518, hp: '422qdD', world: 'World 9', drops: { coins: { amount: '42qdD', probability: 0.8 } } },
        { id: 'world9-b-rank', name: 'B Rank NPC', rank: 'B', exp: 1898, hp: '2.1QnD', world: 'World 9', drops: { coins: { amount: '210qdD', probability: 0.8 } } },
        { id: 'world9-a-rank', name: 'A Rank NPC', rank: 'A', exp: 2373, hp: '10.5QnD', world: 'World 9', drops: { coins: { amount: '1QnD', probability: 0.8 } } },
        { id: 'world9-s-rank', name: 'S Rank NPC', rank: 'S', exp: 3915, hp: '52QnD', world: 'World 9', drops: { coins: { amount: '5.2QnD', probability: 0.8 } } },
        { id: 'ken-turbo-boss', name: 'Ken Turbo', rank: 'SS', exp: 5760, hp: '264QnD', world: 'World 9', drops: { coins: { amount: '26QnD', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    pets: [
        { id: 'ken', name: 'Ken', energy_bonus: '4.57k' },
        { id: 'aira', name: 'Aira', energy_bonus: '9.15k' },
        { id: 'jiji', name: 'Jiji', energy_bonus: '13.7k' },
        { id: 'momo', name: 'Momo', energy_bonus: '18.3k' },
        { id: 'alien', name: 'Alien', energy_bonus: '22.8k' },
        { id: 'saiko', name: 'Saiko', energy_bonus: '30.5k' },
        { id: 'ken-turbo-pet', name: 'Ken Turbo', energy_bonus: '68.6k' }
    ],
    shadows: [
        {
            id: 'ken-turbo-shadow',
            name: 'Ken Turbo',
            type: 'Energy',
            stats: [
                {
                    rank: 'Rank SS',
                    rarity: 'Phantom',
                    bonus: '11.2% Energy',
                },
                {
                    rank: 'Rank SSS',
                    rarity: 'Supreme',
                    bonus: '12% Energy',
                }
            ]
        }
    ],
    dungeons: [
      {
        id: 'progression-raid',
        name: 'Progression Raid',
        description: 'Vai até a wave 1000 (w1k).'
      }
    ]
};
