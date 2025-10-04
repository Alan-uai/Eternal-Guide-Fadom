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
import { Metadata } from 'next';
import Head from 'next/head';

const suggestionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(100, 'Title cannot exceed 100 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.').max(1000, 'Description cannot exceed 1000 characters.'),
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
    console.log('Suggestion submitted:', values);
    toast({
      title: 'Suggestion Sent!',
      description: 'Thank you for your contribution to the Wiki.',
    });
    form.reset();
  }

  return (
    <>
      <Head>
        <title>Suggest Content - Eternal Guide</title>
      </Head>
      <div className="space-y-6 max-w-2xl mx-auto">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Suggest New Content</h1>
          <p className="text-muted-foreground">Have an idea for a new Wiki article? Share it with us!</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>New Article Suggestion</CardTitle>
            <CardDescription>Fill out the form below to submit your idea.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Advanced Pet Guide" {...field} />
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
                      <FormLabel>Article Content / Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the content of the article. What should it cover?"
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
                  Submit Suggestion
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
