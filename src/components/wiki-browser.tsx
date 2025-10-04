'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useApp } from '@/context/app-provider';
import { Skeleton } from './ui/skeleton';
import { micromark } from 'micromark';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WikiArticle } from '@/lib/types';

function ArticleCard({ article }: { article: WikiArticle }) {
  const placeholder = PlaceHolderImages.find((p) => p.id === article.imageId);
  return (
    <Dialog>
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
            {article.tags?.map((tag: string) => (
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
              {article.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogDescription>
         </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div
            className="prose prose-sm dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground prose-table:w-full prose-th:text-left prose-td:py-2 prose-td:px-3 prose-tr:border-b prose-tr:border-border"
            dangerouslySetInnerHTML={{ __html: micromark(article.content) }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function LoadingSkeletons() {
  return (
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
  )
}

function NoArticlesFound() {
  return (
    <div className="text-center py-16 text-muted-foreground">
        <Search className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">Nenhum Artigo Encontrado</h3>
        <p>Tente um termo de busca diferente ou selecione outra categoria.</p>
    </div>
  )
}

export function WikiBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const { wikiArticles, isWikiLoading } = useApp();

  const generalArticles = (wikiArticles || []).filter(
    (article) => article.tags.includes('guia') || article.tags.includes('sistema') || article.tags.includes('geral')
  );

  const worldArticles = (wikiArticles || []).filter(
    (article) => !generalArticles.some(a => a.id === article.id)
  );

  const filteredArticles = (articles: WikiArticle[]) => articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredGeneral = filteredArticles(generalArticles);
  const filteredWorlds = filteredArticles(worldArticles);

  const worldNumbers = [...new Set(worldArticles.map(a => a.tags.find(t => !isNaN(parseInt(t)))).filter(Boolean))].sort((a,b) => parseInt(a!) - parseInt(b!));


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

      <Tabs defaultValue="geral" className="w-full">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="mundos">Mundos</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="mt-6">
            {isWikiLoading ? <LoadingSkeletons /> : (
              filteredGeneral.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGeneral.map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
              ) : <NoArticlesFound />
            )}
        </TabsContent>
        <TabsContent value="mundos" className="mt-6">
          {isWikiLoading ? <LoadingSkeletons /> : (
            filteredWorlds.length > 0 && worldNumbers.length > 0 ? (
              <Tabs defaultValue={worldNumbers[0]} className="w-full">
                <TabsList className="flex-wrap h-auto">
                  {worldNumbers.map(worldNum => (
                    <TabsTrigger key={worldNum} value={worldNum!}>Mundo {worldNum}</TabsTrigger>
                  ))}
                </TabsList>
                {worldNumbers.map(worldNum => (
                  <TabsContent key={worldNum} value={worldNum!} className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles(worldArticles.filter(a => a.tags.includes(worldNum!))).map((article) => <ArticleCard key={article.id} article={article} />)}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : <NoArticlesFound />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}