
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useApp } from '@/context/app-provider';
import { Skeleton } from './ui/skeleton';
import { micromark } from 'micromark';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WikiArticle } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function WikiArticleContent({ article }: { article: WikiArticle }) {
  const contentHtml = article.content ? micromark(article.content) : '';
  const hasTables = article.tables && Object.keys(article.tables).length > 0;

  // Specific grid rendering for the Rank System article
  if (article.id === 'rank-system' && article.tables?.ranks) {
    return (
      <div>
        <div
          className="prose prose-sm dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          {article.tables.ranks.rows.map((row, index) => (
            <React.Fragment key={index}>
              <div className="font-semibold text-foreground">Rank {row.Rank}</div>
              <div className="text-muted-foreground">{row.Energia}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Standard table rendering for other articles
  return (
    <div>
      <div
        className="prose prose-sm dark:prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      {hasTables && Object.entries(article.tables).map(([key, tableData]) => (
          <div key={key} className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableData.headers.map((header) => (
                    <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {tableData.headers.map((header, cellIndex) => (
                      <TableCell key={`${rowIndex}-${cellIndex}`} className="whitespace-nowrap">{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
    </div>
  );
}


function ArticleCard({ article }: { article: WikiArticle }) {
  const placeholder = PlaceHolderImages.find((p) => p.id === article.imageId);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer">
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
            <p className="text-muted-foreground text-sm line-clamp-3">{article.summary}</p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
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
        <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
          <WikiArticleContent article={article} />
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
          <CardFooter>
             <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
             </div>
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

  const filteredArticles = wikiArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const allArticles = filteredArticles;
  const worldRelatedArticles = filteredArticles.filter(a => a.tags.some(tag => !isNaN(parseInt(tag)) && tag !== 'geral'));
  
  const worldNumbers = [...new Set(
    worldRelatedArticles.flatMap(a => a.tags).filter(tag => !isNaN(parseInt(tag)))
  )].sort((a, b) => parseInt(a) - parseInt(b));

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
          <TabsTrigger value="mundos" disabled={worldNumbers.length === 0}>Mundos</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
            {isWikiLoading ? <LoadingSkeletons /> : (
              allArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
              ) : <NoArticlesFound />
            )}
        </TabsContent>

        <TabsContent value="mundos" className="mt-6">
          {isWikiLoading ? <LoadingSkeletons /> : (
            worldNumbers.length > 0 ? (
              <Tabs defaultValue={worldNumbers[0]} className="w-full">
                <TabsList className="flex-wrap h-auto justify-start">
                  {worldNumbers.map(worldNum => (
                    <TabsTrigger key={worldNum} value={worldNum!}>Mundo {worldNum}</TabsTrigger>
                  ))}
                </TabsList>
                {worldNumbers.map(worldNum => (
                  <TabsContent key={worldNum} value={worldNum!} className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {worldRelatedArticles.filter(a => a.tags.includes(worldNum!)).map((article) => <ArticleCard key={article.id} article={article} />)}
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
