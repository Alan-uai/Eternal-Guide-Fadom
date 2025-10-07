'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, Loader2, Upload } from 'lucide-react';
import Head from 'next/head';
import { useUser, useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from 'react';

const suggestionSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.').max(100, 'O título não pode exceder 100 caracteres.'),
  content: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres.').max(5000, 'A descrição não pode exceder 5000 caracteres.'),
  attachment: z.any().optional(),
});

export default function SuggestContentPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { firestore, firebaseApp } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storage = firebaseApp ? getStorage(firebaseApp) : null;


  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const fileRef = form.register("attachment");

  async function onSubmit(values: z.infer<typeof suggestionSchema>) {
    if (!user || !firestore || !storage) {
        toast({
            title: 'Erro',
            description: 'Você precisa estar logado para enviar uma sugestão.',
            variant: 'destructive'
        });
        return;
    }
    setIsSubmitting(true);
    try {
        let attachmentURL = null;
        const file = values.attachment?.[0];

        if (file) {
            const storageRef = ref(storage, `suggestions/${user.uid}/${Date.now()}-${file.name}`);
            const uploadResult = await uploadBytes(storageRef, file);
            attachmentURL = await getDownloadURL(uploadResult.ref);
        }

        const suggestionsCollection = collection(firestore, 'contentSuggestions');
        await addDoc(suggestionsCollection, {
            userId: user.uid,
            userEmail: user.email,
            title: values.title,
            content: values.content,
            attachmentURL: attachmentURL,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        toast({
        title: 'Sugestão Enviada!',
        description: 'Obrigado por sua contribuição para a Wiki. Sua sugestão será revisada em breve.',
        });
        form.reset();
    } catch (error) {
        console.error("Erro ao enviar sugestão: ", error);
        toast({
            title: 'Erro ao Enviar',
            description: 'Ocorreu um problema ao enviar sua sugestão. Tente novamente.',
            variant: 'destructive'
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sugerir Conteúdo - Guia Eterno</title>
      </Head>
      <div className="space-y-6 max-w-2xl mx-auto">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Sugerir Novo Conteúdo</h1>
          <p className="text-muted-foreground">Tem uma ideia para um novo artigo na Wiki? Compartilhe conosco!</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Sugestão</CardTitle>
            <CardDescription>Preencha os detalhes abaixo. Anexos são opcionais, mas ajudam a ilustrar sua ideia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Artigo</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Guia Avançado de Pets" {...field} />
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
                      <FormLabel>Conteúdo / Descrição do Artigo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o conteúdo do artigo. O que ele deve cobrir? Seja o mais detalhado possível."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anexo (Opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input id="attachment" type="file" className="pl-12" {...fileRef} />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Upload className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Sugestão
                        </>
                    )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
