
export const world12Data = {
    name: 'World 12 - Village of Sins',
    powers: [
        {
            id: 'sins-power',
            name: 'Sins',
            type: 'gacha',
            statType: 'energy',
            unlockCost: 'N/A',
            stats: [
                { name: 'Lust', multiplier: '2x', rarity: 'Common', probability: 40.55 },
                { name: 'Envy', multiplier: '3x', rarity: 'Uncommon', probability: 33 },
                { name: 'Sloth', multiplier: '4x', rarity: 'Rare', probability: 19.9 },
                { name: 'Greed', multiplier: '6x', rarity: 'Epic', probability: 5 },
                { name: 'Gluttony', multiplier: '8x', rarity: 'Legendary', probability: 1 },
                { name: 'Wrath', multiplier: '12x', rarity: 'Mythic', probability: 0.5 },
                { name: 'Pride', multiplier: '15x', rarity: 'Phantom', probability: 0.05 },
            ]
        },
        {
            id: 'commandments-power',
            name: 'Commandments',
            type: 'gacha',
            statType: 'mixed',
            unlockCost: 'N/A',
            stats: [
                { name: 'Selflessness', multiplier: '2x', statType: 'energy', rarity: 'Common' },
                { name: 'Pacifism', multiplier: '3x', statType: 'energy', rarity: 'Uncommon' },
                { name: 'Patience', multiplier: '0.5x', statType: 'damage', rarity: 'Rare' },
                { name: 'Repose', multiplier: '6x', statType: 'energy', rarity: 'Epic' },
                { name: 'Purity', multiplier: '1x', statType: 'damage', rarity: 'Legendary' },
                { name: 'Reticence', multiplier: '8x', statType: 'energy', rarity: 'Legendary' },
                { name: 'Truth', multiplier: '1x', statType: 'damage', rarity: 'Mythic' },
                { name: 'Faith', multiplier: '2x', statType: 'damage', rarity: 'Mythic' },
                { name: 'Love', multiplier: '1.1x', statType: 'damage', rarity: 'Supreme' },
                { name: 'Piety', multiplier: '10x', statType: 'energy', rarity: 'Phantom' },
            ]
        },
        {
            id: 'sins-energy-progression',
            name: 'Energy Progression',
            type: 'progression',
            statType: 'energy',
            unlockCost: 'N/A',
            maxLevel: 50,
            maxBoost: '0.5x Energy'
        },
        {
            id: 'sins-damage-progression',
            name: 'Damage Progression',
            type: 'progression',
            statType: 'damage',
            unlockCost: 'N/A',
            maxLevel: 50,
            maxBoost: '0.5x Damage'
        },
        {
            id: 'sins-coins-progression',
            name: 'Coins Progression',
            type: 'progression',
            statType: 'coin',
            unlockCost: 'N/A',
            maxLevel: 50,
            maxBoost: '0.5x Coins'
        }
    ],
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
