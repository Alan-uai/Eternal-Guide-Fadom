'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { wikiArticles } from '@/lib/wiki-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

export function WikiBrowser() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = wikiArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Game Wiki</h1>
        <p className="text-muted-foreground">Search our database of articles, guides, and game information.</p>
      </header>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const placeholder = PlaceHolderImages.find((p) => p.id === article.imageId);
          return (
            <Dialog key={article.id}>
              <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-300">
                {placeholder && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={placeholder.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      data-ai-hint={placeholder.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{article.summary}</p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                   <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                        <Info className="mr-2 h-4 w-4" />
                        Read More
                      </Button>
                  </DialogTrigger>
                </CardFooter>
              </Card>

              <DialogContent className="max-w-2xl">
                 <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">{article.title}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </DialogDescription>
                 </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="whitespace-pre-wrap py-4 text-sm text-foreground/80">{article.content}</div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
      {filteredArticles.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No Articles Found</h3>
            <p>Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
