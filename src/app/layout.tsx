// src/app/layout.tsx
'use client';
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
import { Bot, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { AuthDialog } from '@/components/auth-dialog';
import { useAdmin } from '@/hooks/use-admin';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';


// We can't export metadata from a client component.
// We can remove it or keep it for reference, but it won't be used.
// export const metadata: Metadata = {
//   title: 'Guia Eterno',
//   description: 'Seu assistente de IA para o jogo Roblox Anime Eternal.',
// };

const LAST_VISITED_ROUTE_KEY = 'eternal-guide-last-route';

function LayoutRedirectManager({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoading: isAdminLoading } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (!isAdminLoading) {
            const lastRoute = localStorage.getItem(LAST_VISITED_ROUTE_KEY);
            let targetRoute: string | null = null;
            
            if (isAdmin) {
                // If user is admin, check for a valid last admin route, otherwise go to admin-chat
                if (lastRoute && lastRoute.startsWith('/admin')) {
                    targetRoute = lastRoute;
                } else {
                    targetRoute = '/admin-chat';
                }
            } else {
                // If user is not admin, but is trying to access an admin page, redirect to home
                if (pathname.startsWith('/admin')) {
                    targetRoute = '/';
                }
            }

            if (targetRoute && pathname !== targetRoute) {
                router.replace(targetRoute);
            } else {
                // If no redirect is needed, we can finish loading
                setIsInitialLoad(false);
            }
        }
    }, [isAdmin, isAdminLoading, router, pathname]);

    // This effect handles the case where a redirect is triggered.
    // The component will stay in a loading state until the new page's content is ready.
    useEffect(() => {
        const handleRouteChange = () => {
            setIsInitialLoad(false);
        };
        // Assuming router events are available and work this way in this Next.js version
        // This is a conceptual way to listen for the route change to complete.
        // In modern Next.js app router, the router.replace is typically fast enough,
        // and the main loading state handles the visual transition.
        // The check `!isAdminLoading` combined with `isInitialLoad` is the primary guard.
    }, [router]);


    if (isAdminLoading || isInitialLoad) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}


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
          <LayoutRedirectManager>
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
          </LayoutRedirectManager>
        </AppProvider>
      </body>
    </html>
  );
}
