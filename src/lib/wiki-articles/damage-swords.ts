import type { WikiArticle } from '@/lib/types';

export const damageSwordsArticle: Omit<WikiArticle, 'createdAt'> = {
  id: 'damage-swords',
  title: 'Espadas de Dano (Evolução)',
  summary: 'Um guia para as espadas de dano e seus multiplicadores em cada nível de evolução (estrela), incluindo informações sobre a espada de evento Golden Venom Strike.',
  content: `Espadas de dano aumentam seu poder de ataque. A cada evolução (nível de estrela), o multiplicador de dano aumenta significativamente. Para maximizar ainda mais o dano, as espadas podem ser aprimoradas com encantamentos como **Respirações** e **Runas**, que também possuem suas próprias raridades e bônus.

**Nota Especial sobre a Golden Venom Strike:** A Golden Venom Strike foi uma espada de evento da atualização 17, que saiu na atualização 18 e não está mais disponível para obtenção. Ela era adquirida no Mundo 2 ao trocar uma Venomstrike de 3 estrelas (Phantom) por ela. A Golden Venom Strike possui um multiplicador de dano base de 38x e não possui estrelas ou passivas.`,
  tags: ['espadas', 'dano', 'arma', 'guia', 'geral', 'evolução', 'golden venom', 'respiração', 'runa'],
  imageUrl: 'wiki-9',
  tables: {
    damageSwords: {
      headers: ['name', 'rarity', 'type', 'baseDamage', 'phantomBreathing', 'phantomRune', 'supremeRune'],
      rows: [
        { name: 'BloodThorn', rarity: 'Comum', type: 'damage', baseDamage: '1.25x', phantomBreathing: '2.25x', phantomRune: '4.05x', supremeRune: '5x' },
        { name: 'Eclipse Warden', rarity: 'Incomum', type: 'damage', baseDamage: '2.25x', phantomBreathing: '4.05x', phantomRune: '7.29x', supremeRune: '9.10x' },
        { name: 'Obsidian Reaver', rarity: 'Raro', type: 'damage', baseDamage: '3.75x', phantomBreathing: '6.75x', phantomRune: '12.15x', supremeRune: '13.50x' },
        { name: 'Aquarius Edge', rarity: 'Lendário', type: 'damage', baseDamage: '5x', phantomBreathing: '9x', phantomRune: '16.2x', supremeRune: '18x' },
        { name: 'Demon Soul', rarity: 'Mítico', type: 'damage', baseDamage: '6.25x', phantomBreathing: '11.25x', phantomRune: '20.25x', supremeRune: '22.50x' },
        { name: 'Redmourne', rarity: 'Mítico', type: 'damage', baseDamage: '7.5x', phantomBreathing: '13.5x', phantomRune: '24.3x', supremeRune: '27x' },
        { name: 'VenomStrike', rarity: 'Phantom', type: 'damage', baseDamage: '10x', phantomBreathing: '18x', phantomRune: '32.4x', supremeRune: '36x' },
        { name: 'Golden Venom Strike', rarity: 'Evento', type: 'damage', baseDamage: '38x', phantomBreathing: 'N/A', phantomRune: 'N/A', supremeRune: 'N/A' },
      ],
    },
  },
};
