import { WikiBrowser } from '@/components/wiki-browser';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wiki do Jogo - Guia Eterno',
};

export default function WikiPage() {
  return <WikiBrowser />;
}
