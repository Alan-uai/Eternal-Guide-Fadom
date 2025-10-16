'use client';

import { useMemo } from 'react';
import { useUser, useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Loader2, Zap, Flame, Coins, Star, Wind, Shield } from 'lucide-react';
import { accessories } from '@/lib/accessory-data';
import { allGamepasses } from '@/lib/gamepass-data';
import { generalAchievements } from '@/lib/achievements-data';
import { profileCategories } from '@/lib/profile-config';
import { damageSwords, scythes, energySwords } from '@/lib/weapon-data';

const parseBonus = (value: string | undefined): number => {
    if (typeof value !== 'string') return 0;
    const cleanedValue = value.replace(/x|%/g, '');
    const number = parseFloat(cleanedValue);
    return isNaN(number) ? 0 : number;
};

const getWeaponBonus = (weapon: any, allWeapons: any[]) => {
    const totals = { damage: 0, energy: 0 };
    if (!weapon) return totals;

    const weaponData = allWeapons.find(w => w.name === weapon.name);
    if (!weaponData) return totals;

    const level = weapon.evolutionLevel || 0;

    if (weapon.type === 'energy') {
        const statKey = ['base_stats', 'one_star_stats', 'two_star_stats', 'three_star_stats'][level] as keyof typeof weaponData;
        totals.energy += parseBonus(weaponData[statKey]);
    } else { // damage or scythe
        let damageMultiplier = 1;
        const baseDamageKey = ['base_damage', 'one_star_damage', 'two_star_damage', 'three_star_damage'][level] as keyof typeof weaponData;
        damageMultiplier = parseBonus(weaponData[baseDamageKey]);
        
        if (weapon.type === 'damage' && weapon.breathingEnchantment && weapon.stoneEnchantment && weaponData.enchantments) {
            const enchantBonus = weaponData.enchantments[weapon.breathingEnchantment]?.[weapon.stoneEnchantment]?.[level];
             if(enchantBonus) damageMultiplier = parseBonus(enchantBonus);
        }

        if(weapon.type === 'scythe' && weapon.passiveEnchantment && weaponData.passives) {
            const passiveBonus = weaponData.passives[weapon.passiveEnchantment]?.[level];
            if(passiveBonus) damageMultiplier = parseBonus(passiveBonus);
        }

        totals.damage += damageMultiplier;
    }
    
    return totals;
}


export function GlobalBonusDisplay() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();

    // Fetch all user data collections
    const collections = useMemo(() => {
        return profileCategories.reduce((acc, category) => {
            const query = (firestore && user) 
                ? collection(firestore, 'users', user.uid, category.subcollectionName)
                : null;
            acc[category.subcollectionName] = useCollection(useMemoFirebase(() => query, [firestore, user]));
            return acc;
        }, {} as Record<string, any>);
    }, [firestore, user]);

     const { data: weaponSlotsData, isLoading: weaponsLoading } = useDoc(useMemoFirebase(() => firestore && user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]));


    const totalBonuses = useMemo(() => {
        const totals = {
            damage: 0,
            energy: 0,
            coins: 0,
            exp: 0,
            movespeed: 0,
            luck: 0,
        };

        // Accessories
        const accessoryItems = collections.accessories?.data;
        if (accessoryItems) {
            accessoryItems.forEach((item: any) => {
                const fullAccessory = accessories.find(a => a.id === item.id);
                const rarityOption = fullAccessory?.rarity_options.find(ro => ro.rarity === item.rarity);
                if (!rarityOption) return;
                
                totals.damage += parseBonus(rarityOption.damage_bonus);
                totals.energy += parseBonus(rarityOption.energy_bonus);
                totals.coins += parseBonus(rarityOption.coins_bonus);
                totals.exp += parseBonus(rarityOption.exp_bonus);
                totals.movespeed += parseBonus(rarityOption.movespeed_bonus);
            });
        }
        
        // Gamepasses
        const gamepassItems = collections.gamepasses?.data;
        if (gamepassItems) {
             gamepassItems.forEach((item: any) => {
                const gamepassData = allGamepasses.find(gp => gp.id === item.id);
                if (gamepassData && gamepassData.bonus_type && gamepassData.bonus_value) {
                    if (gamepassData.bonus_type === 'damage') totals.damage += gamepassData.bonus_value - 1;
                    if (gamepassData.bonus_type === 'energy') totals.energy += gamepassData.bonus_value - 1;
                    if (gamepassData.bonus_type === 'coins') totals.coins += gamepassData.bonus_value - 1;
                    if (gamepassData.bonus_type === 'exp') totals.exp += gamepassData.bonus_value - 1;
                }
            });
        }

        // Achievements
        const achievementLevels = collections.achievements?.data?.[0];
        if (achievementLevels) {
            generalAchievements.forEach(ach => {
                const currentLevel = (achievementLevels as any)[ach.id] || 0;
                if (ach.progressionBonus.includes('energia')) totals.energy += currentLevel * 0.05;
                if (ach.progressionBonus.includes('damage')) totals.damage += currentLevel * 0.05;
                if (ach.progressionBonus.includes('coins')) totals.coins += currentLevel * 0.05;
            });
        }
        
        // Index Tiers
        const indexTiers = collections.index?.data?.[0];
        if (indexTiers) {
            totals.damage += ((indexTiers as any).avatarTier || 0) * 0.05;
            totals.energy += ((indexTiers as any).petTier || 0) * 0.05;
        }

        // Obelisks
        const obeliskLevels = collections.obelisks?.data?.[0];
        if(obeliskLevels) {
            totals.damage += ((obeliskLevels as any).damage || 0) * 0.02;
            totals.energy += ((obeliskLevels as any).energy || 0) * 0.02;
            totals.luck += ((obeliskLevels as any).lucky || 0) * 0.01;
        }

        // Weapons
        const allWeaponsData = [...damageSwords, ...scythes, ...energySwords];
        const equippedWeapons = (weaponSlotsData as any)?.weaponSlots;
        if(equippedWeapons) {
            Object.values(equippedWeapons).forEach((weapon: any) => {
                const bonuses = getWeaponBonus(weapon, allWeaponsData);
                totals.damage += bonuses.damage;
                totals.energy += bonuses.energy;
            });
        }
        
        // Other categories
        const simpleBonusCategories = ['powers', 'auras', 'pets', 'fighters'];
        simpleBonusCategories.forEach(cat => {
             const items = collections[cat]?.data;
             if(items) {
                 items.forEach((item: any) => {
                    if (item.statType === 'damage' && item.multiplier) totals.damage += parseBonus(item.multiplier);
                    if (item.statType === 'energy' && item.multiplier) totals.energy += parseBonus(item.multiplier);
                    if (item.statType === 'coin' && item.multiplier) totals.coins += parseBonus(item.multiplier);
                    if (item.energy_bonus) totals.energy += parseBonus(item.energy_bonus);
                    if (item.damage_bonus) totals.damage += parseBonus(item.damage_bonus);
                    if (item.coins_bonus) totals.coins += parseBonus(item.coins_bonus);
                 });
             }
        });


        return totals;
    }, [collections, weaponSlotsData]);

    const isLoading = useMemo(() => {
        if(isUserLoading || weaponsLoading) return true;
        return Object.values(collections).some(c => c.isLoading);
    }, [isUserLoading, weaponsLoading, collections]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }
    
    const bonusConfig = [
        { key: 'damage', label: 'Dano', icon: Flame, color: 'text-red-500', suffix: 'x' },
        { key: 'energy', label: 'Energia', icon: Zap, color: 'text-blue-500', suffix: 'x' },
        { key: 'coins', label: 'Moedas', icon: Coins, color: 'text-yellow-500', suffix: 'x' },
        { key: 'exp', label: 'EXP', icon: Star, color: 'text-green-500', suffix: '%' },
        { key: 'movespeed', label: 'Velocidade', icon: Wind, color: 'text-sky-500', suffix: '%' },
        { key: 'luck', label: 'Sorte', icon: Shield, color: 'text-purple-500', suffix: '%' },
    ] as const;


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full text-center">
            {bonusConfig.map(({ key, label, icon: Icon, color, suffix }) => (
                <div key={key} className={`flex flex-col items-center p-2 rounded-md bg-muted/50 border`}>
                    <Icon className={`h-6 w-6 mb-1 ${color}`} />
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold">{`+${totalBonuses[key].toFixed(2)}${suffix}`}</span>
                </div>
            ))}
        </div>
    );
}
