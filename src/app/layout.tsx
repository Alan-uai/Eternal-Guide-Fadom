import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/app-provider';
import { MainNav } from '@/components/main-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { AuthDialog } from '@/components/auth-dialog';

export const metadata: Metadata = {
  title: 'Guia Eterno',
  description: 'Seu assistente de IA para o jogo Roblox Anime Eternal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-3 px-2">
                  <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors">
                    <Bot size={28} />
                    <h1 className="text-xl font-semibold font-headline">Guia Eterno</h1>
                  </Link>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <MainNav />
              </SidebarContent>
              <SidebarFooter>
                <div className="text-xs text-muted-foreground p-4">
                  © 2024 Guia Eterno. Todos os direitos reservados.
                </div>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
                <div className='flex items-center gap-4'>
                    <SidebarTrigger className='md:hidden'/>
                    <div className="hidden items-center gap-2 text-primary md:flex">
                    <Bot size={24} />
                    <h1 className="text-lg font-semibold font-headline">Guia Eterno</h1>
                    </div>
                </div>
                <UserNav />
              </header>
              <main className="flex flex-1 flex-col p-4 md:p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <AuthDialog />
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
