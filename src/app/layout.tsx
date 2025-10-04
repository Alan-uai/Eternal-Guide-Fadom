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

export const metadata: Metadata = {
  title: 'Eternal Guide',
  description: 'Your AI assistant for the Roblox game Anime Eternal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
                    <h1 className="text-xl font-semibold font-headline">Eternal Guide</h1>
                  </Link>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <MainNav />
              </SidebarContent>
              <SidebarFooter>
                <div className="text-xs text-muted-foreground p-4">
                  © 2024 Eternal Guide. All rights reserved.
                </div>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center justify-start gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
                <SidebarTrigger />
                <div className="flex items-center gap-2 text-primary">
                  <Bot size={24} />
                  <h1 className="text-lg font-semibold font-headline">Eternal Guide</h1>
                </div>
              </header>
              <main className="flex flex-1 flex-col p-4 md:p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
