
// src/app/layout.tsx
'use client';
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/app-provider';
import { MainNav } from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';
import { AuthDialog } from '@/components/auth-dialog';
import { RaidTimer } from '@/components/raid-timer';

// We can't export metadata from a client component.
// We can remove it or keep it for reference, but it won't be used.
// export const metadata: Metadata = {
//   title: 'Guia Eterno',
//   description: 'Seu assistente de IA para o jogo Roblox Anime Eternal.',
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <title>Guia Eterno</title>
        <meta name="description" content="Seu assistente de IA para o jogo Roblox Anime Eternal." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-14 items-center border-b bg-background/80 px-4 backdrop-blur-sm z-50">
              <MainNav />
            </header>
            <RaidTimer />
            <main className="flex flex-1 flex-col p-4 md:p-6 pt-12">
              {children}
            </main>
          </div>
          <AuthDialog />
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
