export interface Jewelry {
    id: string;
    name: string;
    type: 'energy' | 'coin' | 'damage' | 'luck';
    level: 'bronze' | 'silver' | 'gold' | 'rose-gold';
    bonus: string;
}

export const allJewelry: Jewelry[] = [
    // Bronze
    { id: 'bronze-energy-bracelet', name: 'Bronze Energy Bracelet', type: 'energy', level: 'bronze', bonus: '0.1x' },
    { id: 'bronze-coin-bracelet', name: 'Bronze Coin Bracelet', type: 'coin', level: 'bronze', bonus: '0.1x' },
    { id: 'bronze-damage-bracelet', name: 'Bronze Damage Bracelet', type: 'damage', level: 'bronze', bonus: '0.1x' },
    { id: 'bronze-luck-bracelet', name: 'Bronze Luck Bracelet', type: 'luck', level: 'bronze', bonus: '5.00%' },
    // Silver
    { id: 'silver-energy-bracelet', name: 'Silver Energy Bracelet', type: 'energy', level: 'silver', bonus: '0.25x' },
    { id: 'silver-coin-bracelet', name: 'Silver Coin Bracelet', type: 'coin', level: 'silver', bonus: '0.25x' },
    { id: 'silver-damage-bracelet', name: 'Silver Damage Bracelet', type: 'damage', level: 'silver', bonus: '0.25x' },
    { id: 'silver-luck-bracelet', name: 'Silver Luck Bracelet', type: 'luck', level: 'silver', bonus: '10.00%' },
    // Gold
    { id: 'gold-energy-bracelet', name: 'Gold Energy Bracelet', type: 'energy', level: 'gold', bonus: '0.5x' },
    { id: 'gold-coin-bracelet', name: 'Gold Coin Bracelet', type: 'coin', level: 'gold', bonus: '0.5x' },
    { id: 'gold-damage-bracelet', name: 'Gold Damage Bracelet', type: 'damage', level: 'gold', bonus: '0.5x' },
    { id: 'gold-luck-bracelet', name: 'Gold Luck Bracelet', type: 'luck', level: 'gold', bonus: '20.00%' },
    // Rose Gold
    { id: 'rose-gold-energy-bracelet', name: 'Rose Gold Energy Bracelet', type: 'energy', level: 'rose-gold', bonus: '0.75x' },
    { id: 'rose-gold-coin-bracelet', name: 'Rose Gold Coin Bracelet', type: 'coin', level: 'rose-gold', bonus: '0.75x' },
    { id: 'rose-gold-damage-bracelet', name: 'Rose Gold Damage Bracelet', type: 'damage', level: 'rose-gold', bonus: '0.75x' },
    { id: 'rose-gold-luck-bracelet', name: 'Rose Gold Luck Bracelet', type: 'luck', level: 'rose-gold', bonus: '35.00%' },
];
