'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SUBCOLLECTIONS = ['powers', 'npcs', 'pets', 'dungeons', 'shadows', 'stands', 'accessories'];

export function WorldSubcollections({ worldId }: { worldId: string }) {
    const firestore = useFirestore();

    return (
        <div className="pl-4 pt-2 space-y-2">
            {SUBCOLLECTIONS.map(subcollectionName => (
                <SubcollectionLink key={subcollectionName} worldId={worldId} subcollectionName={subcollectionName} />
            ))}
        </div>
    );
}

function SubcollectionLink({ worldId, subcollectionName }: { worldId: string, subcollectionName: string }) {
    const firestore = useFirestore();
    const subcollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'worlds', worldId, subcollectionName) : null, [firestore, worldId, subcollectionName]);
    const { data: items, isLoading } = useCollection(subcollectionRef as any);

    if (isLoading) {
        return (
            <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Carregando {subcollectionName}...
            </div>
        );
    }

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sm capitalize">
                    - {subcollectionName} ({items.length})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 pt-2 space-y-1">
                {items.map((item: any) => (
                    <Link key={item.id} href={`/admin/edit-collection/worlds/${worldId}/${subcollectionName}/${item.id}`} passHref>
                        <Button variant="ghost" className="w-full justify-start text-xs">
                            -- {item.name || item.id}
                        </Button>
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
