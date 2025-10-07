// src/app/calculator/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Swords, Shield, Zap, Flame, Calculator as CalculatorIcon, Construction } from 'lucide-react';
import Head from 'next/head';
import { useAdmin } from '@/hooks/use-admin';

interface Npc {
  id: string;
  name: string;
  rank: string;
  exp: number;
}

interface World {
  id: string;
  name: string;
  npcs: Npc[];
}

// Função para converter notação científica do jogo para número
function parseGameNotation(value: string | number): number {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;
  
    const numPart = parseFloat(value);
    const notations: { [key: string]: number } = {
      k: 1e3, M: 1e6, B: 1e9, T: 1e12, qd: 1e15, Qn: 1e18, sx: 1e21, Sp: 1e24, O: 1e27, N: 1e30,
      de: 1e33, Ud: 1e36, DD: 1e39, tdD: 1e42, qdD: 1e45, QnD: 1e48, sxD: 1e51, SpD: 1e54, OcD: 1e57, NvD: 1e60,
      Vgn: 1e63, Uvg: 1e66, DVg: 1e69, TVg: 1e72, qtV: 1e75, QnV: 1e78, SeV: 1e81, SPG: 1e84, OVG: 1e87, NVG: 1e90,
      TGN: 1e93, UTG: 1e96, DTG: 1e99, tsTG: 1e102, qTG: 1e105, QnTG: 1e108, ssTG: 1e111, SpTG: 1e114, OcTG: 1e117, NoTG: 1e120,
      QDR: 1e123, uQDR: 1e126, dQDR: 1e129, tQDR: 1e132, qdQDR: 1e135, QnQDR: 1e138, sxQDR: 1e141, SpQDR: 1e144, OQQDR: 1e147, NQQDR: 1e150
    };
  
    const key = Object.keys(notations).find(key => value.toLowerCase().includes(key.toLowerCase()));
    
    if (key) {
      return numPart * notations[key];
    }
    
    return numPart;
  }
  
  // Função para formatar número para a notação científica do jogo
  function formatGameNotation(num: number): string {
    if (num < 1e3) return num.toFixed(2);
    const notations: { [key: number]: string } = {
        3: 'k', 6: 'M', 9: 'B', 12: 'T', 15: 'qd', 18: 'Qn', 21: 'sx', 24: 'Sp', 27: 'O', 30: 'N',
        33: 'de', 36: 'Ud', 39: 'DD', 42: 'tdD', 45: 'qdD', 48: 'QnD', 51: 'sxD', 54: 'SpD', 57: 'OcD', 60: 'NvD',
        63: 'Vgn', 66: 'Uvg', 69: 'DVg', 72: 'TVg', 75: 'qtV', 78: 'QnV', 81: 'SeV', 84: 'SPG', 87: 'OVG', 90: 'NVG',
        93: 'TGN', 96: 'UTG', 99: 'DTG', 102: 'tsTG', 105: 'qTG', 108: 'QnTG', 111: 'ssTG', 114: 'SpTG', 117: 'OcTG', 120: 'NoTG',
        123: 'QDR', 126: 'uQDR', 129: 'dQDR', 132: 'tQDR', 135: 'qdQDR', 138: 'QnQDR', 141: 'sxQDR', 144: 'SpQDR', 147: 'OQQDR', 150: 'NQQDR'
      };
    
    const exponent = Math.floor(Math.log10(num));
    const closestExponent = Object.keys(notations).map(Number).sort((a, b) => b - a).find(exp => exponent >= exp);
    
    if (closestExponent) {
        return (num / Math.pow(10, closestExponent)).toFixed(2) + notations[closestExponent];
    }

    return num.toExponential(2);
  }

function AdminCalculatorPage() {
  const firestore = useFirestore();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculator state
  const [baseEnergy, setBaseEnergy] = useState('');
  const [damageMultiplier, setDamageMultiplier] = useState('1');
  const [fastClick, setFastClick] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!firestore) return;
      setIsLoading(true);
      const worldsCollection = collection(firestore, 'worlds');
      const worldsSnapshot = await getDocs(worldsCollection);
      const worldsData: World[] = [];

      for (const worldDoc of worldsSnapshot.docs) {
        const npcsCollection = collection(worldDoc.ref, 'npcs');
        const npcsSnapshot = await getDocs(npcsCollection);
        const npcs = npcsSnapshot.docs.map(npcDoc => ({
          id: npcDoc.id,
          ...npcDoc.data(),
        } as Npc));
        
        worldsData.push({
          id: worldDoc.id,
          name: worldDoc.data().name,
          npcs: npcs,
        });
      }
      
      setWorlds(worldsData.sort((a,b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1])));
      setIsLoading(false);
    }
    fetchData();
  }, [firestore]);

  const { dps, timeToKill, npcHp } = useMemo(() => {
    const energy = parseGameNotation(baseEnergy);
    const multiplier = parseFloat(damageMultiplier) || 1;
    const finalDamage = energy * multiplier;
    const clicksPerSecond = fastClick ? 4 : 1;
    const dps = finalDamage * clicksPerSecond;
    
    let timeToKill: number | null = null;
    let npcHp : number | null = null;

    if (selectedWorldId && selectedNpcId) {
      const world = worlds.find(w => w.id === selectedWorldId);
      const npc = world?.npcs.find(n => n.id === selectedNpcId);
      // NOTE: We need HP data for NPCs to make this work. For now, we'll use EXP as a proxy.
      // This is a placeholder and should be updated when HP data is available.
      // We will look for an 'hp' field, otherwise fallback to 'exp' * some multiplier.
      const targetHp = (npc as any)?.hp ? parseGameNotation((npc as any).hp) : parseGameNotation((npc as any)?.exp || '0') * 100000;
      npcHp = targetHp;
      if (dps > 0 && targetHp > 0) {
        timeToKill = targetHp / dps;
      }
    }

    return { dps, timeToKill, npcHp };
  }, [baseEnergy, damageMultiplier, fastClick, selectedWorldId, selectedNpcId, worlds]);

  const selectedWorldNpcs = useMemo(() => {
    if (!selectedWorldId) return [];
    return worlds.find(w => w.id === selectedWorldId)?.npcs || [];
  }, [selectedWorldId, worlds]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4">Carregando dados dos mundos...</p>
      </div>
    );
  }

  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds.toFixed(1)} segundos`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutos`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} horas`;
    return `${(seconds / 86400).toFixed(1)} dias`;
  }

  return (
    <>
      <Head>
        <title>Calculadora de Batalha - Guia Eterno</title>
      </Head>
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3"><CalculatorIcon/> Calculadora de Batalha</h1>
          <p className="text-muted-foreground">Calcule seu DPS e o tempo para derrotar inimigos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna de Inputs */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Seus Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="base-energy">Energia Base</Label>
                <Input id="base-energy" value={baseEnergy} onChange={(e) => setBaseEnergy(e.target.value)} placeholder="ex: 10.5T" />
                <p className="text-xs text-muted-foreground">Use a notação do jogo (k, M, B, T, etc.).</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dmg-multiplier">Multiplicador de Dano Total</Label>
                <Input id="dmg-multiplier" type="number" value={damageMultiplier} onChange={(e) => setDamageMultiplier(e.target.value)} placeholder="ex: 2.5" />
                <p className="text-xs text-muted-foreground">Soma de todos os seus bônus (poderes, armas, etc.).</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="fast-click" checked={fastClick} onCheckedChange={setFastClick} />
                <Label htmlFor="fast-click">Gamepass "Fast Click" (4 cliques/seg)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Coluna de Alvo e Resultados */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Selecione o Alvo</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Mundo</Label>
                  <Select onValueChange={(val) => { setSelectedWorldId(val); setSelectedNpcId(null); }} value={selectedWorldId || ''}>
                    <SelectTrigger><SelectValue placeholder="Selecione um mundo" /></SelectTrigger>
                    <SelectContent>
                      {worlds.map(world => <SelectItem key={world.id} value={world.id}>{world.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>NPC / Chefe</Label>
                   <Select onValueChange={setSelectedNpcId} value={selectedNpcId || ''} disabled={!selectedWorldId}>
                    <SelectTrigger><SelectValue placeholder="Selecione um NPC" /></SelectTrigger>
                    <SelectContent>
                      {selectedWorldNpcs.map(npc => <SelectItem key={npc.id} value={npc.id}>{npc.name} ({npc.rank})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card/80'>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>
                  Seu poder de ataque e tempo estimado para a vitória.
                  <br />
                  <span className='text-xs text-amber-500'>Aviso: HP dos NPCs é um valor estimado, pois não está nos dados. Use como referência.</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                 <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"><Flame /> Dano por Segundo (DPS)</h3>
                    <p className="text-2xl font-bold text-primary">{formatGameNotation(dps)}</p>
                 </div>
                 <div className="bg-background/50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"><Shield /> HP do Alvo</h3>
                    <p className="text-2xl font-bold">{npcHp !== null ? formatGameNotation(npcHp) : 'N/A'}</p>
                 </div>
                 <div className="md:col-span-2 bg-background/50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"><Zap /> Tempo para Derrotar</h3>
                    <p className="text-3xl font-bold text-green-400">{timeToKill !== null ? formatTime(timeToKill) : 'N/A'}</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}


export default function CalculatorPage() {
    const { isAdmin, isLoading } = useAdmin();
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    if (!isAdmin) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Construction className="h-16 w-16 mb-4 text-primary" />
          <h1 className="text-2xl font-bold">Em Breve</h1>
          <p className="text-muted-foreground mt-2">
            A calculadora de batalha está em desenvolvimento e será lançada em breve!
          </p>
        </div>
      );
    }
  
    return <AdminCalculatorPage />;
  }
  
