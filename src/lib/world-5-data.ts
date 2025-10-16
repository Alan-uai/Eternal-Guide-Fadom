
export const world5Data = {
    id: '005',
    name: 'World 5 - Slayer Village',
    npcs: [
        { id: 'world5-e-rank', name: 'E Rank NPC', rank: 'E', exp: 75, hp: '14.2Sp', world: 'World 5', drops: { coins: { amount: '1.4Sp', probability: 0.8 } } },
        { id: 'world5-d-rank', name: 'D Rank NPC', rank: 'D', exp: 78, hp: '71Sp', world: 'World 5', drops: { coins: { amount: '7.1Sp', probability: 0.8 } } },
        { id: 'world5-c-rank', name: 'C Rank NPC', rank: 'C', exp: 82, hp: '355Sp', world: 'World 5', drops: { coins: { amount: '35Sp', probability: 0.8 } } },
        { id: 'world5-b-rank', name: 'B Rank NPC', rank: 'B', exp: 86, hp: '1.7O', world: 'World 5', drops: { coins: { amount: '170Sp', probability: 0.8 } } },
        { id: 'world5-a-rank', name: 'A Rank NPC', rank: 'A', exp: 91, hp: '8.8O', world: 'World 5', drops: { coins: { amount: '880Sp', probability: 0.8 } } },
        { id: 'world5-s-rank', name: 'S Rank NPC', rank: 'S', exp: 95, hp: '44O', world: 'World 5', drops: { coins: { amount: '4.4O', probability: 0.8 } } },
        { id: 'rangoki-boss', name: 'Rangoki', rank: 'SS', exp: 240, hp: '224O', world: 'World 5', drops: { coins: { amount: '22O', probability: 1 }, tokens: { amount: 5, probability: 0.5 } } },
    ],
    powers: [
        {
            id: 'demon-arts',
            name: 'Demon Arts',
            type: 'gacha',
            statType: 'damage',
            unlockCost: '2M',
            stats: [
                { id: 'dream-manipulation', name: 'Dream Manipulation', multiplier: '2x', rarity: 'Common', probability: 40.55 },
                { id: 'blood-scythes', name: 'Blood Scythes', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
                { id: 'vase-teleportation', name: 'Vase Teleportation', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
                { id: 'emotion-splitting', name: 'Emotion Splitting', multiplier: '5x', rarity: 'Epic', probability: 5 },
                { id: 'destructive-death', name: 'Destructive Death', multiplier: '8x', rarity: 'Legendary', probability: 1 },
                { id: 'cryokinesis', name: 'Cryokinesis', multiplier: '10x', rarity: 'Mythic', probability: 0.5 },
                { id: 'blood-control', name: 'Blood Control', multiplier: '12x', rarity: 'Phantom', probability: 0.05 },
            ]
        },
        {
            id: 'breathings',
            name: 'Breathings',
            type: 'progression',
            unlockCost: 'N/A',
            statType: 'mixed',
            description: 'Um sistema para encantar armas. Role com a arma desequipada. O custo e as raridades variam.'
        },
        {
            id: 'weapon-evolution',
            name: 'Weapon Evolution',
            type: 'progression',
            unlockCost: 'N/A',
            statType: 'mixed',
            description: 'Evolua suas armas. Evolve 2: 4 armas iguais + 400M de moedas. Evolve 3: 2 armas iguais + 2B de moedas.'
        }
    ],
    pets: [
        { id: 'nazuki', name: 'Nazuki', rarity: 'Common', energy_bonus: '117' },
        { id: 'tenjaro', name: 'Tenjaro', rarity: 'Uncommon', energy_bonus: '234' },
        { id: 'zentsu', name: 'Zentsu', rarity: 'Rare', energy_bonus: '352' },
        { id: 'insake', name: 'Insake', rarity: 'Epic', energy_bonus: '469' },
        { id: 'tamoka', name: 'Tamoka', rarity: 'Legendary', energy_bonus: '586' },
        { id: 'shinabe', name: 'Shinabe', rarity: 'Mythic', energy_bonus: '781' },
        { id: 'rangaki', name: 'Rangaki', rarity: 'Phantom', energy_bonus: '1.75k' }
    ],
    dungeons: [],
    shadows: [],
    stands: []
};

    