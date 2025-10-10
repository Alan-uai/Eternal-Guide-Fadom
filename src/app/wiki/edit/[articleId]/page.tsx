'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, ShieldAlert, Sparkles } from 'lucide-react';
import type { WikiArticle } from '@/lib/types';
import { nanoid } from 'nanoid';
import { useApp } from '@/context/app-provider';
import { generateTags } from '@/ai/flows/generate-tags-flow';

// Schema for the form validation
const articleSchema = z.object({
  title: z.string().min(3, 'O título é obrigatório.'),
  summary: z.string().min(10, 'O resumo é obrigatório.'),
  content: z.string().min(20, 'O conteúdo é obrigatório.'),
  tags: z.string().min(1, 'Pelo menos uma tag é necessária.'),
  imageId: z.string().optional(),
  tables: z.string().optional(), // We'll edit tables as a JSON string for now
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { wikiArticles, isWikiLoading } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const articleIdParam = Array.isArray(params.articleId) ? params.articleId[0] : params.articleId;
  const isNewArticle = articleIdParam === 'new';
  const [articleId, setArticleId] = useState(isNewArticle ? nanoid() : articleIdParam);
  
  const [article, setArticle] = useState<WikiArticle | null | undefined>(null);

  const articleRef = useMemoFirebase(() => {
    if (!firestore || !articleId) return null;
    return doc(firestore, 'wikiContent', articleId);
  }, [firestore, articleId]);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      tags: '',
      imageId: '',
      tables: '',
    },
  });

  useEffect(() => {
    if (!isWikiLoading && !isNewArticle) {
      const foundArticle = wikiArticles.find(a => a.id === articleId);
      setArticle(foundArticle);
    }
  }, [isWikiLoading, wikiArticles, articleId, isNewArticle]);

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        summary: article.summary,
        content: article.content,
        tags: article.tags.join(', '),
        imageId: article.imageId,
        tables: article.tables ? JSON.stringify(article.tables, null, 2) : '',
      });
    }
  }, [article, form]);
  
  const handleGenerateTags = async () => {
    setIsGeneratingTags(true);
    const { title, summary, content } = form.getValues();
    try {
      const result = await generateTags({ title, summary, content });
      if (result.tags) {
        form.setValue('tags', result.tags);
        toast({ title: 'Tags Geradas!', description: 'As tags foram preenchidas com sugestões da IA.' });
      } else {
        throw new Error('A IA não retornou tags.');
      }
    } catch (error) {
      console.error('Erro ao gerar tags:', error);
      toast({ variant: 'destructive', title: 'Erro ao Gerar Tags', description: 'Não foi possível gerar as tags.' });
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const onSubmit = async (values: ArticleFormData) => {
    if (!articleRef) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível encontrar o artigo para atualizar.' });
      return;
    }
    setIsSaving(true);
    try {
        let parsedTables = article?.tables;
        if(values.tables) {
            try {
                parsedTables = JSON.parse(values.tables);
            } catch (e) {
                toast({ variant: 'destructive', title: 'Erro de JSON', description: 'A estrutura JSON das tabelas é inválida.' });
                setIsSaving(false);
                return;
            }
        }

      const updatedArticleData: Omit<WikiArticle, 'createdAt'> & { createdAt?: any, updatedAt?: any } = {
        id: articleId,
        title: values.title,
        summary: values.summary,
        content: values.content,
        tags: values.tags.split(',').map(tag => tag.trim()),
        imageId: values.imageId || article?.imageId || 'wiki-1', // Fallback imageId
        tables: parsedTables,
      };

      if (isNewArticle) {
        updatedArticleData.createdAt = serverTimestamp();
      } else {
        // For existing articles, we want to preserve the original createdAt timestamp
        if (article?.createdAt) {
          updatedArticleData.createdAt = article.createdAt;
        }
        updatedArticleData.updatedAt = serverTimestamp();
      }

      await setDoc(articleRef, updatedArticleData, { merge: true });
      toast({ title: 'Sucesso!', description: `O artigo foi ${isNewArticle ? 'criado' : 'atualizado'}.` });
      if (isNewArticle) {
        router.push('/admin-chat');
      }
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível salvar o artigo no Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isAdminLoading || (isWikiLoading && !isNewArticle);

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
        <ShieldAlert className="h-16 w-16 mb-4 text-destructive" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isNewArticle ? 'Criar Novo Artigo' : `Editando: ${article?.title || 'Carregando...'}`}</CardTitle>
          <CardDescription>Faça as alterações abaixo e clique em salvar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumo</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[250px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="tables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tabelas (JSON)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[250px] font-mono text-xs" />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">Edite o JSON bruto das tabelas. Cuidado com a sintaxe.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (separadas por vírgula)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleGenerateTags} disabled={isGeneratingTags}>
                        {isGeneratingTags ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Gerar Tags
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Imagem</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Alterações
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
