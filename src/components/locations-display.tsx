
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useApp } from '@/context/app-provider';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface LocationData {
  [category: string]: {
    [world: string]: string[];
  };
}

export function LocationsDisplay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { allGameData, isGameDataLoading } = useApp();

  const locations = useMemo((): LocationData => {
    if (isGameDataLoading || !allGameData) {
      return {};
    }

    const data: LocationData = {
      Poderes: {},
      NPCs: {},
      Bosses: {},
    };

    allGameData.forEach(world => {
      if (!world.name) return;

      // Process Powers
      if (world.powers && world.powers.length > 0) {
        if (!data.Poderes[world.name]) data.Poderes[world.name] = [];
        world.powers.forEach((power: any) => {
          if (power.name) data.Poderes[world.name].push(power.name);
        });
      }

      // Process NPCs and Bosses
      if (world.npcs && world.npcs.length > 0) {
        world.npcs.forEach((npc: any) => {
          if (!npc.name) return;
          const category = npc.rank === 'SS' || npc.rank === 'SSS' ? 'Bosses' : 'NPCs';
          if (!data[category][world.name]) data[category][world.name] = [];
          data[category][world.name].push(npc.name);
        });
      }
    });

    return data;
  }, [allGameData, isGameDataLoading]);

  return (
    <motion.div
      className="flex flex-col items-center transition-all duration-300 ease-in-out pointer-events-auto w-auto"
      initial={false}
      animate={{ width: isExpanded ? 300 : 'auto' }}
    >
      <div
        className="w-full h-3 bg-background/80 backdrop-blur-sm shrink-0"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 55% 100%, 45% 100%)' }}
      />
      <div className="w-full bg-background/80 backdrop-blur-sm border-x border-b rounded-b-lg shadow-lg overflow-hidden flex flex-col items-center flex-grow">
        <div
          className="flex items-center justify-center gap-1.5 h-8 px-2 cursor-pointer w-full shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Localidades</span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="px-1 pt-1 text-left w-full h-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <ScrollArea className="h-full w-full pr-3">
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
                                <ul className="list-disc list-inside text-xs space-y-1">
                                  {items.map(item => <li key={item}>{item}</li>)}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  ))}
                </Accordion>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
