
'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, PlayCircle } from 'lucide-react';
import { useApp } from '@/context/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LocationData {
  [category: string]: {
    [world: string]: any[];
  };
}

export function LocationsDisplay() {
  const { activeSidePanel, setActiveSidePanel, allGameData, isGameDataLoading } = useApp();
  const isExpanded = activeSidePanel === 'locations';
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const locations = useMemo((): LocationData => {
    if (isGameDataLoading || !allGameData || allGameData.length === 0) {
      return {};
    }

    const data: LocationData = {
      Poderes: {},
      NPCs: {},
      Bosses: {},
      Raids: {},
    };

    allGameData.forEach(world => {
      if (!world.name) return;
      const worldName = world.name;

      if (world.powers && world.powers.length > 0) {
        if (!data.Poderes[worldName]) data.Poderes[worldName] = [];
        world.powers.forEach((power: any) => {
          if (power.name) data.Poderes[worldName].push(power);
        });
      }
      
      if (world.npcs && world.npcs.length > 0) {
        world.npcs.forEach((npc: any) => {
          if (!npc.name) return;
          const category = (npc.rank === 'SS' || npc.rank === 'SSS') ? 'Bosses' : 'NPCs';
          if (!data[category][worldName]) data[category][worldName] = [];
          data[category][worldName].push(npc);
        });
      }
      
      if (world.dungeons && world.dungeons.length > 0) {
        if (!data.Raids[worldName]) data.Raids[worldName] = [];
        world.dungeons.forEach((dungeon: any) => {
            if (dungeon.name) {
                data.Raids[worldName].push(dungeon);
            }
        });
      }
    });

    // Special handling for lobby dungeons which might be in World 1 or 20 data
    const lobbyRaids: { name: string, videoUrl?: string }[] = [];
    const lobbyWorld1 = allGameData.find(w => w.id === '001');
    const lobbyWorld20 = allGameData.find(w => w.id === '020');

    if (lobbyWorld1?.dungeons) {
        lobbyWorld1.dungeons.forEach((d:any) => lobbyRaids.push(d));
    }
    if (lobbyWorld20?.dungeons) {
        lobbyWorld20.dungeons.forEach((d:any) => lobbyRaids.push(d));
    }
    if(lobbyRaids.length > 0) {
        data.Raids['Lobby'] = lobbyRaids;
    }


    return data;
  }, [allGameData, isGameDataLoading]);

  const togglePanel = () => {
    setActiveSidePanel(isExpanded ? null : 'locations');
  };

  const handleItemClick = (item: any) => {
    if (item.videoUrl) {
      let url = Array.isArray(item.videoUrl) ? item.videoUrl[0] : item.videoUrl;
      const clipIdMatch = url.match(/\/clips\/([a-zA-Z0-9_-]+)/);
      if (clipIdMatch && clipIdMatch[1]) {
        const clipId = clipIdMatch[1];
        const embedUrl = `https://medal.tv/clip/${clipId}/embed`;
        setVideoUrl(embedUrl);
      }
    }
  }

  return (
    <>
      <motion.div
        className="flex flex-col items-center transition-all duration-300 ease-in-out pointer-events-auto"
        initial={false}
        animate={{ width: isExpanded ? 300 : 'auto' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div
          className="w-full h-3 bg-background/80 backdrop-blur-sm shrink-0"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 55% 100%, 45% 100%)' }}
        />
        <div className="w-full bg-background/80 backdrop-blur-sm border-x border-b rounded-b-lg shadow-lg overflow-hidden flex flex-col items-center flex-grow">
          <div
            className="flex items-center justify-center gap-1.5 h-8 px-2 cursor-pointer w-full shrink-0"
            onClick={togglePanel}
          >
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">Localidades</span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="w-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="px-1 pt-1 text-left w-[300px] h-80">
                  <ScrollArea className="h-full w-full pr-3">
                    {isGameDataLoading ? (
                        <div className='flex items-center justify-center h-full'><Loader2 className='h-6 w-6 animate-spin text-primary' /></div>
                    ) : (
                        <Accordion type="multiple" className="w-full">
                        {Object.entries(locations).map(([category, worlds]) => (
                            Object.keys(worlds).length > 0 && (
                            <AccordionItem value={category} key={category}>
                                <AccordionTrigger className="text-sm font-semibold py-2">
                                {category}
                                </AccordionTrigger>
                                <AccordionContent>
                                <div className="space-y-2 pl-2">
                                    {Object.entries(worlds).map(([world, items]) => (
                                    <div key={world}>
                                        <h4 className="text-xs font-bold text-primary mb-1">{world}</h4>
                                        <ul className="text-xs space-y-1">
                                        {items.map((item, index) => (
                                            <li key={item.id || item.name || index}>
                                            <button
                                                onClick={() => handleItemClick(item)}
                                                className={cn(
                                                    'w-full text-left flex items-center gap-1.5',
                                                    item.videoUrl ? 'cursor-pointer hover:underline' : 'cursor-default'
                                                )}
                                                disabled={!item.videoUrl}
                                            >
                                                <span>{item.name}</span>
                                                {item.videoUrl && <PlayCircle className='inline h-3 w-3 text-primary/70' />}
                                            </button>
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                    ))}
                                </div>
                                </AccordionContent>
                            </AccordionItem>
                            )
                        ))}
                        </Accordion>
                    )}
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Dialog open={!!videoUrl} onOpenChange={(isOpen) => !isOpen && setVideoUrl(null)}>
        <DialogContent className="max-w-3xl h-[80vh] p-0 border-0">
          <DialogHeader className='absolute top-2 right-2 z-10'>
             <DialogTitle className='sr-only'>Vídeo de Localização</DialogTitle>
          </DialogHeader>
          {videoUrl && (
            <iframe
              src={videoUrl}
              className='w-full h-full rounded-lg'
              allow="scripts; autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
