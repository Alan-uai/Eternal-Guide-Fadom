'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useMemoFirebase, useUser, useFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, ShieldAlert, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import type { WikiArticle } from '@/lib/types';
import { nanoid } from 'nanoid';
import { useApp } from '@/context/app-provider';
import { generateTags } from '@/ai/flows/generate-tags-flow';
import { summarizeWikiContent } from '@/ai/flows/summarize-wiki-content';
import { extractTextFromFile } from '@/ai/flows/extract-text-from-file-flow';
import Image from 'next/image';

// Schema for the form validation
const articleSchema = z.object({
  title: z.string().min(3, 'O título é obrigatório.'),
  summary: z.string().min(10, 'O resumo é obrigatório.'),
  content: z.string().min(20, 'O conteúdo é obrigatório.'),
  tags: z.string().min(1, 'Pelo menos uma tag é necessária.'),
  imageUrl: z.string().optional(),
  tables: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { firestore, firebaseApp } = useFirebase();
  const { toast } = useToast();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { wikiArticles, isWikiLoading } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const articleIdParam = Array.isArray(params.articleId) ? params.articleId[0] : params.articleId;
  const isNewArticle = articleIdParam === 'new';
  const [articleId, setArticleId] = useState(isNewArticle ? nanoid() : articleIdParam);
  
  const [article, setArticle] = useState<WikiArticle | null | undefined>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const storage = firebaseApp ? getStorage(firebaseApp) : null;

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
      imageUrl: '',
      tables: '',
    },
  });

  useEffect(() => {
    if (!isWikiLoading && !isNewArticle) {
      const foundArticle = wikiArticles.find(a => a.id === articleId);
      setArticle(foundArticle);
      if (foundArticle?.imageUrl) {
        setImagePreview(foundArticle.imageUrl);
      }
    }
  }, [isWikiLoading, wikiArticles, articleId, isNewArticle]);

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        summary: article.summary,
        content: article.content,
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        imageUrl: article.imageUrl,
        tables: article.tables ? JSON.stringify(article.tables, null, 2) : '',
      });
      if(article.imageUrl) setImagePreview(article.imageUrl);
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

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const { content, title } = form.getValues();
    try {
      const result = await summarizeWikiContent({ wikiContent: content, topic: title });
      if (result.summary) {
        form.setValue('summary', result.summary);
        toast({ title: 'Resumo Gerado!', description: 'O resumo foi preenchido com uma sugestão da IA.' });
      } else {
        throw new Error('A IA não retornou um resumo.');
      }
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      toast({ variant: 'destructive', title: 'Erro ao Gerar Resumo', description: 'Não foi possível gerar o resumo.' });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, extractionType: 'markdown' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    toast({ title: 'Processando arquivo...', description: 'A IA está extraindo o texto. Isso pode levar um momento.' });

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const fileDataUri = reader.result as string;
            
            const result = await extractTextFromFile({ fileDataUri, extractionType });
            
            if (result.extractedText) {
                if (extractionType === 'markdown') {
                    form.setValue('content', result.extractedText);
                } else if (extractionType === 'json') {
                    form.setValue('tables', result.extractedText);
                }
                toast({ title: 'Texto Extraído!', description: `O campo de ${extractionType === 'markdown' ? 'conteúdo' : 'tabelas'} foi preenchido.` });
            } else {
                throw new Error('A IA não retornou texto.');
            }
        };
        reader.onerror = (error) => {
            throw error;
        }
    } catch (error) {
      console.error(`Erro ao extrair texto para ${extractionType}:`, error);
      toast({ variant: 'destructive', title: 'Erro na Extração', description: 'Não foi possível extrair o texto do arquivo.' });
    } finally {
      setIsExtracting(false);
      // Reset file input to allow uploading the same file again
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    setIsUploadingImage(true);
    toast({ title: 'Enviando imagem...', description: 'A imagem está sendo enviada para o armazenamento.' });

    try {
      const storageRef = ref(storage, `wiki-images/${articleId}/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      form.setValue('imageUrl', downloadURL);
      setImagePreview(downloadURL);

      toast({ title: 'Imagem Enviada!', description: 'A nova imagem do artigo foi salva.' });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast({ variant: 'destructive', title: 'Erro no Upload', description: 'Não foi possível enviar a imagem.' });
    } finally {
      setIsUploadingImage(false);
      if(imageInputRef.current) imageInputRef.current.value = '';
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

      const updatedArticleData: Omit<WikiArticle, 'createdAt' | 'imageId'> & { imageUrl: string, createdAt?: any, updatedAt?: any } = {
        id: articleId,
        title: values.title,
        summary: values.summary,
        content: values.content,
        tags: values.tags.split(',').map(tag => tag.trim()),
        imageUrl: values.imageUrl || imagePreview || '', // Use new URL, then preview, then empty
        tables: parsedTables,
      };

      if (isNewArticle) {
        updatedArticleData.createdAt = serverTimestamp();
      } else {
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
              <input type="file" ref={fileInputRef} onChange={(e) => {}} style={{ display: 'none' }} accept="image/*,application/pdf" />

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
                    <div className="flex gap-2">
                       <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                        {isGeneratingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Gerar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Imagem do Artigo</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 relative rounded-md border bg-muted overflow-hidden">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Pré-visualização do artigo" layout="fill" objectFit="cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                     <input type="file" ref={imageInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                     <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isUploadingImage}>
                      {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      {isUploadingImage ? 'Enviando...' : 'Enviar Imagem'}
                    </Button>
                    <p className="text-xs text-muted-foreground">Envie uma imagem para o artigo.</p>
                  </div>
                </div>
              </FormItem>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Conteúdo (Markdown)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isExtracting}
                        onClick={() => {
                            const handler = (e: Event) => {
                                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>, 'markdown');
                                fileInputRef.current?.removeEventListener('change', handler);
                            };
                            fileInputRef.current?.addEventListener('change', handler);
                            fileInputRef.current?.click();
                        }}
                      >
                        {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Extrair de Arquivo
                      </Button>
                    </div>
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
                     <div className="flex items-center justify-between">
                        <FormLabel>Tabelas (JSON)</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isExtracting}
                            onClick={() => {
                                const handler = (e: Event) => {
                                    handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>, 'json');
                                    fileInputRef.current?.removeEventListener('change', handler);
                                };
                                fileInputRef.current?.addEventListener('change', handler);
                                fileInputRef.current?.click();
                            }}
                        >
                            {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Extrair de Arquivo
                        </Button>
                     </div>
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

              <Button type="submit" disabled={isSaving || isExtracting || isUploadingImage}>
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
