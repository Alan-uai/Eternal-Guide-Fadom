export interface Aura {
    id: string;
    name: string;
    world: string;
    bonus_type: 'luck' | 'damage' | 'energy' | 'exp';
    bonus_value: string;
}

export const allAuras: Aura[] = [
    { id: 'luck-aura', name: 'Aura da Sorte', world: 'World 1', bonus_type: 'luck', bonus_value: '10%' },
    { id: 'red-emperor-aura', name: 'Aura do Imperador Vermelho', world: 'World 2', bonus_type: 'damage', bonus_value: '0.1x' },
    { id: 'purple-traitor-aura', name: 'Aura do Traidor Roxo', world: 'World 3', bonus_type: 'damage', bonus_value: '0.25x' },
    { id: 'fire-king-aura', name: 'Aura do Rei do Fogo', world: 'World 4', bonus_type: 'luck', bonus_value: '25%' }, // Drop luck
    { id: 'flaming-aura', name: 'Aura Flamejante', world: 'World 5', bonus_type: 'damage', bonus_value: '0.15x' },
    { id: 'statue-aura', name: 'Aura da Estátua', world: 'World 6', bonus_type: 'damage', bonus_value: '0.75x' },
    { id: 'leaf-aura', name: 'Aura da Folha', world: 'World 8', bonus_type: 'luck', bonus_value: '25%' }, // Star luck
    { id: 'energetic-aura', name: 'Aura Energética', world: 'World 10', bonus_type: 'energy', bonus_value: '1.5x' },
    { id: 'monstrous-aura', name: 'Aura Monstruosa', world: 'World 13', bonus_type: 'damage', bonus_value: '2.0x' },
    { id: 'virtual-aura', name: 'Aura Virtual', world: 'World 15', bonus_type: 'luck', bonus_value: '35%' }, // Drop luck
    { id: 'hamon-aura', name: 'Aura de Hamon', world: 'World 16', bonus_type: 'exp', bonus_value: '10%' },
    { id: 'ghoul-aura', name: 'Aura de Ghoul', world: 'World 17', bonus_type: 'damage', bonus_value: '1.0x' },
    { id: 'fire-captain-aura', name: 'Aura do Capitão de Fogo', world: 'World 19', bonus_type: 'damage', bonus_value: '1.5x' },
];
