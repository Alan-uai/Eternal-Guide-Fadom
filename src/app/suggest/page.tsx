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
import { Send } from 'lucide-react';
import Head from 'next/head';

const suggestionSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.').max(100, 'O título não pode exceder 100 caracteres.'),
  description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres.').max(1000, 'A descrição não pode exceder 1000 caracteres.'),
});

export default function SuggestContentPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof suggestionSchema>) {
    console.log('Sugestão enviada:', values);
    toast({
      title: 'Sugestão Enviada!',
      description: 'Obrigado por sua contribuição para a Wiki.',
    });
    form.reset();
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
            <CardTitle>Sugestão de Novo Artigo</CardTitle>
            <CardDescription>Preencha o formulário abaixo para enviar sua ideia.</CardDescription>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo / Descrição do Artigo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o conteúdo do artigo. O que ele deve cobrir?"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Sugestão
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
