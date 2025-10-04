'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useApp } from '@/context/app-provider';
import { Skeleton } from './ui/skeleton';
import { micromark } from 'micromark';


export function WikiBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const { wikiArticles, isWikiLoading } = useApp();

  const filteredArticles = (wikiArticles || []).filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Wiki do Jogo</h1>
        <p className="text-muted-foreground">Pesquise em nosso banco de dados de artigos, guias e informações do jogo.</p>
      </header>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquisar artigos..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isWikiLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                 <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                 </div>
                 <Skeleton className="h-10 w-full mt-2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
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
                      {article.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                     <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                          <Info className="mr-2 h-4 w-4" />
                          Ler Mais
                        </Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
  
                <DialogContent className="max-w-2xl">
                   <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">{article.title}</DialogTitle>
                    <DialogDescription asChild>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {article.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </DialogDescription>
                   </DialogHeader>
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <div
                      className="prose prose-sm dark:prose-invert prose-p:text-foreground/80 py-4"
                      dangerouslySetInnerHTML={{ __html: micromark(article.content) }}
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
      {!isWikiLoading && filteredArticles.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">Nenhum Artigo Encontrado</h3>
            <p>Tente um termo de busca diferente.</p>
        </div>
      )}
    </div>
  );
}
