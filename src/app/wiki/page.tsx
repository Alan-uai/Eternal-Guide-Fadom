import { WikiBrowser } from '@/components/wiki-browser';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Wiki - Eternal Guide',
};

export default function WikiPage() {
  return <WikiBrowser />;
}
