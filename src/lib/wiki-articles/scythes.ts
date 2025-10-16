import type { WikiArticle } from '@/lib/types';

export const scythesArticle: Omit<WikiArticle, 'createdAt'> = {
  id: 'scythes-world-21',
  title: 'Foices (Mundo 21)',
  summary: 'Um guia para as foices do Mundo 21, as armas mais recentes do jogo, e seus multiplicadores de dano.',
  content: `As foices são as armas introduzidas no Mundo 21. Elas oferecem multiplicadores de dano significativos que aumentam com a evolução (estrelas), de forma similar aos Titãs. Além disso, as foices podem vir com encantamentos de **Passiva**, que concedem bônus adicionais e também possuem raridades distintas.

### Fabricação (Scythe Exchanger)
É possível fabricar foices mais poderosas, como a **Stormreaver**. A fabricação requer:
- 10x Phantom Requiem
- 10k Exchange Coin 2
- 1x Item Desconhecido`,
  tags: ['foice', 'arma', 'mundo 21', '21', 'guia', 'geral', 'passiva', 'fabricação'],
  imageUrl: 'wiki-14',
  tables: {
    scythes: {
      headers: ['name', 'rarity', 'base_stats', 'one_star_stats', 'two_star_stats', 'three_star_stats'],
      rows: [
        { name: 'Venomleaf', rarity: 'Comum', base_stats: '0.75x', one_star_stats: '1.5x', two_star_stats: '2.25x', three_star_stats: '3.75x' },
        { name: 'Cryoscythe', rarity: 'Incomum', base_stats: '1x', one_star_stats: '2x', two_star_stats: '3x', three_star_stats: '5x' },
        { name: 'Toxinfang', rarity: 'Raro', base_stats: '1.75x', one_star_stats: '3.5x', two_star_stats: '5.25x', three_star_stats: '8.75x' },
        { name: 'Crimson Thorn', rarity: 'Lendário', base_stats: '2.2x', one_star_stats: '4.4x', two_star_stats: '6.6x', three_star_stats: '11x' },
        { name: 'Bonehowl', rarity: 'Mítico', base_stats: '2.75x', one_star_stats: '5.5x', two_star_stats: '8.25x', three_star_stats: '13.75x' },
        { name: 'Ashfang', rarity: 'Phantom', base_stats: '3.5x', one_star_stats: '7x', two_star_stats: '10.5x', three_star_stats: '17.5x' },
        { name: 'Phantom Requiem', rarity: 'Phantom', base_stats: '4.25x', one_star_stats: '8.5x', two_star_stats: '12.75x', three_star_stats: '21.25x' },
        { name: 'Stormreaver', rarity: 'Supremo', base_stats: '5x', one_star_stats: '10x', two_star_stats: '15x', three_star_stats: '25x' },
      ]
    }
  }
};
