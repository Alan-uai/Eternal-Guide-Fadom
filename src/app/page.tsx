'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { ChatView } from '@/components/chat-view';
import { Loader2 } from 'lucide-react';

function HomePageContent() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // Apenas redireciona se não estiver carregando e o usuário for admin.
    if (!isLoading && isAdmin) {
      router.replace('/admin-chat');
    }
  }, [isAdmin, isLoading, router]);

  // Enquanto verifica o status de admin, exibe um loader para evitar piscar de tela.
  if (isLoading || isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não for admin, exibe a página de chat normal.
  return <ChatView />;
}


export default function ChatPage() {
  return <HomePageContent />;
}
