'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { upgradesCostsArticle } from '@/lib/wiki-articles/upgrades-costs';

const codes = upgradesCostsArticle.content.match(/`Update20`|`320KLikes`|`325KLikes`|`590KFav`|`595KFav`/g)?.map(c => c.replace(/`/g, '')) || [];

export function CodesDisplay() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-14 w-full flex justify-start z-40 pointer-events-none pl-4 md:pl-6">
        <div className={cn(
            "flex flex-col items-center transition-all duration-300 ease-in-out pointer-events-auto",
             isExpanded ? "w-48" : "auto"
        )}>
            <div 
                className="w-full h-3 bg-background/80 backdrop-blur-sm"
                style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 55% 100%, 45% 100%)'
                }}
            />
            <motion.div 
                className="w-full bg-background/80 backdrop-blur-sm border-x border-b rounded-b-lg shadow-lg overflow-hidden flex flex-col items-center"
                initial={false}
                animate={{ height: isExpanded ? 'auto' : '2rem' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div 
                    className="flex items-center justify-center gap-1.5 h-8 px-2 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className='text-xs font-semibold'>Códigos</span>
                </div>
                <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="p-3 pt-1 text-center w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                    >
                        <ul className="space-y-1">
                            {codes.map(code => (
                                <li key={code} className="text-sm font-mono text-primary bg-primary/10 rounded-md py-1">
                                    {code}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.div>
        </div>
    </div>
  );
}
