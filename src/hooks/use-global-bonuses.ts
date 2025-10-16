'use client';

import { useMemo } from 'react';
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { accessories } from '@/lib/accessory-data';
import { allGamepasses } from '@/lib/gamepass-data';
import { generalAchievements } from '@/lib/achievements-data';
import { damageSwords, scythes, energySwords } from '@/lib/weapon-data';
import { energyGainPerRank } from '@/lib/energy-gain-data';

// Helper function to safely parse bonus values which can be strings like '1.5x' or '10%'
const parseBonusValue = (value: string | undefined): { value: number; isMultiplier: boolean } => {
    if (typeof value !== 'string') return { value: 0, isMultiplier: false };
    const isMultiplier = value.includes('x');
    const number = parseFloat(value.replace(/x|%/g, ''));
    if (isNaN(number)) return { value: 0, isMultiplier: false };
    // If it's a percentage, divide by 100 to get the decimal value for addition
    return { value: isMultiplier ? number : number / 100, isMultiplier };
};


// Helper to calculate weapon-specific bonuses
const getWeaponBonus = (weapon: any, allWeapons: any[]) => {
    const totals = { damage: { multipliers: [], bonuses: [] }, energy: { multipliers: [], bonuses: [] } };
    if (!weapon) return totals;

    const weaponData = allWeapons.find(w => w.name === weapon.name);
    if (!weaponData) return totals;

    const level = weapon.evolutionLevel || 0;

    if (weapon.type === 'energy') {
        const statKey = ['base_stats', 'one_star_stats', 'two_star_stats', 'three_star_stats'][level] as keyof typeof weaponData;
        const { value, isMultiplier } = parseBonusValue(weaponData[statKey]);
        if (isMultiplier) totals.energy.multipliers.push(value);
        else totals.energy.bonuses.push(value);
    } else { // damage or scythe
        let finalDamageBonus = '0x';
        if (weapon.type === 'damage' && weapon.breathingEnchantment && weapon.stoneEnchantment && weaponData.enchantments?.[weapon.breathingEnchantment]?.[weapon.stoneEnchantment]?.[level]) {
            finalDamageBonus = weaponData.enchantments[weapon.breathingEnchantment][weapon.stoneEnchantment][level];
        } else if (weapon.type === 'scythe' && weapon.passiveEnchantment && weaponData.passives?.[weapon.passiveEnchantment]?.[level]) {
            finalDamageBonus = weaponData.passives[weapon.passiveEnchantment][level];
        } else {
            const baseDamageKey = ['base_damage', 'one_star_damage', 'two_star_damage', 'three_star_damage'][level] as keyof typeof weaponData;
            finalDamageBonus = weaponData[baseDamageKey] || '0x';
        }
        
        const { value, isMultiplier } = parseBonusValue(finalDamageBonus);
        if (isMultiplier) totals.damage.multipliers.push(value);
        else totals.damage.bonuses.push(value);
    }
    
    return totals;
};

export function useGlobalBonuses() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();

    // Fetch all necessary data collections
    const collectionsToFetch = ['accessories', 'gamepasses', 'achievements', 'index', 'obelisks', 'powers', 'auras', 'pets', 'fighters'];
    const collectionQueries = useMemo(() => {
        if (!firestore || !user) return {};
        const queries: { [key: string]: any } = {};
        collectionsToFetch.forEach(name => {
            queries[name] = collection(firestore, 'users', user.uid, name);
        });
        return queries;
    }, [firestore, user]);

    const { data: accessoryItems, isLoading: accessoriesLoading } = useCollection(collectionQueries.accessories);
    const { data: gamepassItems, isLoading: gamepassesLoading } = useCollection(collectionQueries.gamepasses);
    const { data: achievementItems, isLoading: achievementsLoading } = useCollection(collectionQueries.achievements);
    const { data: indexItems, isLoading: indexLoading } = useCollection(collectionQueries.index);
    const { data: obeliskItems, isLoading: obelisksLoading } = useCollection(collectionQueries.obelisks);
    const { data: powerItems, isLoading: powersLoading } = useCollection(collectionQueries.powers);
    const { data: auraItems, isLoading: aurasLoading } = useCollection(collectionQueries.auras);
    const { data: petItems, isLoading: petsLoading } = useCollection(collectionQueries.pets);
    const { data: fighterItems, isLoading: fightersLoading } = useCollection(collectionQueries.fighters);
    
    const { data: weaponSlotsData, isLoading: weaponsLoading } = useDoc(useMemoFirebase(() => firestore && user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]));
    const { data: rankData, isLoading: rankLoading } = useDoc(useMemoFirebase(() => firestore && user ? doc(firestore, 'users', user.uid, 'rank', 'current') : null, [firestore, user]));

    const isLoading = isUserLoading || weaponsLoading || rankLoading || accessoriesLoading || gamepassesLoading || achievementsLoading || indexLoading || obelisksLoading || powersLoading || aurasLoading || petsLoading || fightersLoading;

    const totalBonuses = useMemo(() => {
        const bonuses = {
            damage: { multipliers: [1], bonuses: [0] },
            energy: { multipliers: [1], bonuses: [0] },
            coins: { multipliers: [1], bonuses: [0] },
            exp: { multipliers: [1], bonuses: [0] },
            movespeed: { multipliers: [1], bonuses: [0] },
            luck: { multipliers: [1], bonuses: [0] },
        };

        const addBonus = (category: keyof typeof bonuses, valueStr: string | undefined) => {
            const { value, isMultiplier } = parseBonusValue(valueStr);
            if (value === 0) return;
            if (isMultiplier) bonuses[category].multipliers.push(value);
            else bonuses[category].bonuses.push(value);
        };
        
        // Accessories
        accessoryItems?.forEach((item: any) => {
            const fullAccessory = accessories.find(a => a.id === item.id);
            const rarityOption = fullAccessory?.rarity_options.find(ro => ro.rarity === item.rarity);
            if (!rarityOption) return;
            addBonus('damage', rarityOption.damage_bonus);
            addBonus('energy', rarityOption.energy_bonus);
            addBonus('coins', rarityOption.coins_bonus);
            addBonus('exp', rarityOption.exp_bonus);
            addBonus('movespeed', rarityOption.movespeed_bonus);
        });

        // Gamepasses
        gamepassItems?.forEach((item: any) => {
            const gamepassData = allGamepasses.find(gp => gp.id === item.id);
            if (gamepassData?.bonus_type && gamepassData.bonus_value) {
                // Gamepass values in data are multipliers (e.g., 2 for 2x)
                bonuses[gamepassData.bonus_type].multipliers.push(gamepassData.bonus_value);
            }
        });

        // Achievements
        const achievementLevels = achievementItems?.[0];
        if (achievementLevels) {
            generalAchievements.forEach(ach => {
                const currentLevel = (achievementLevels as any)[ach.id] || 0;
                if (ach.progressionBonus.includes('energia')) bonuses.energy.bonuses.push(currentLevel * 0.05);
                if (ach.progressionBonus.includes('damage')) bonuses.damage.bonuses.push(currentLevel * 0.05);
                if (ach.progressionBonus.includes('coins')) bonuses.coins.bonuses.push(currentLevel * 0.05);
            });
        }
        
        // Index Tiers
        const indexTiers = indexItems?.[0];
        if (indexTiers) {
            bonuses.damage.bonuses.push(((indexTiers as any).avatarTier || 0) * 0.05);
            bonuses.energy.bonuses.push(((indexTiers as any).petTier || 0) * 0.05);
        }

        // Obelisks
        const obeliskLevels = obeliskItems?.[0];
        if(obeliskLevels) {
            bonuses.damage.bonuses.push(((obeliskLevels as any).damage || 0) * 0.02);
            bonuses.energy.bonuses.push(((obeliskLevels as any).energy || 0) * 0.02);
            bonuses.luck.bonuses.push(((obeliskLevels as any).lucky || 0) * 0.01);
        }

        // Weapons
        const allWeaponsData = [...damageSwords, ...scythes, ...energySwords];
        const equippedWeapons = (weaponSlotsData as any)?.weaponSlots;
        if(equippedWeapons) {
            Object.values(equippedWeapons).forEach((weapon: any) => {
                const weaponBonuses = getWeaponBonus(weapon, allWeaponsData);
                bonuses.damage.multipliers.push(...weaponBonuses.damage.multipliers);
                bonuses.energy.multipliers.push(...weaponBonuses.energy.multipliers);
            });
        }
        
        // Other item categories (Powers, Auras, Pets, Fighters)
        [powerItems, auraItems, petItems, fighterItems].forEach(collection => {
             collection?.forEach((item: any) => {
                addBonus('damage', item.multiplier && item.statType === 'damage' ? item.multiplier : item.damage_bonus);
                addBonus('energy', item.multiplier && item.statType === 'energy' ? item.multiplier : item.energy_bonus);
                addBonus('coins', item.multiplier && item.statType === 'coin' ? item.multiplier : item.coins_bonus);
             });
        });
        
        // Final Calculation
        const rankValue = (rankData as any)?.value || 0;
        const baseEnergy = parseFloat((energyGainPerRank as Record<string, string>)[rankValue.toString()] || '0');

        const totalEnergyMultiplier = bonuses.energy.multipliers.reduce((a, b) => a * b, 1);
        const totalEnergyBonus = bonuses.energy.bonuses.reduce((a, b) => a + b, 0);
        const finalEnergy = baseEnergy * totalEnergyMultiplier * (1 + totalEnergyBonus);
        
        const baseDamage = finalEnergy; // Core game mechanic
        const totalDamageMultiplier = bonuses.damage.multipliers.reduce((a, b) => a * b, 1);
        const totalDamageBonus = bonuses.damage.bonuses.reduce((a, b) => a + b, 0);
        const finalDamage = baseDamage * totalDamageMultiplier * (1 + totalDamageBonus);

        const totalCoinsMultiplier = bonuses.coins.multipliers.reduce((a, b) => a * b, 1);
        const totalCoinsBonus = bonuses.coins.bonuses.reduce((a, b) => a + b, 0);
        
        const totalExpBonus = bonuses.exp.bonuses.reduce((a, b) => a + b, 0);
        const totalMovespeedBonus = bonuses.movespeed.bonuses.reduce((a, b) => a + b, 0);
        const totalLuckBonus = bonuses.luck.bonuses.reduce((a, b) => a + b, 0);


        return {
            damage: finalDamage,
            energy: finalEnergy,
            coins: totalCoinsMultiplier * (1 + totalCoinsBonus), // Presented as a multiplier
            exp: totalExpBonus * 100, // Presented as percentage
            movespeed: totalMovespeedBonus * 100, // Presented as percentage
            luck: totalLuckBonus * 100, // Presented as percentage
        };

    }, [
        accessoryItems, gamepassItems, achievementItems, indexItems, obeliskItems, 
        powerItems, auraItems, petItems, fighterItems, weaponSlotsData, rankData
    ]);

    return {
        bonuses: totalBonuses,
        isLoading
    };
}
