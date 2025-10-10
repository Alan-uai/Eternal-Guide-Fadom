'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, Bookmark, Lightbulb, ClipboardList, BrainCircuit, Calculator, HeartPulse, Database } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: BotMessageSquare, label: 'Chat IA', tooltip: 'Chat com a IA' },
  { href: '/tips', icon: HeartPulse, label: 'Dicas', tooltip: 'Como Ficar Mais Forte' },
  { href: '/calculator', icon: Calculator, label: 'Calculadora', tooltip: 'Calculadora de Batalha' },
  { href: '/saved', icon: Bookmark, label: 'Respostas Salvas', tooltip: 'Respostas Salvas' },
  { href: '/suggest', icon: Lightbulb, label: 'Sugerir Conteúdo', tooltip: 'Sugerir Conteúdo' },
];

const adminNavItems = [
    { href: '/suggestions', icon: ClipboardList, label: 'Ver Sugestões', tooltip: 'Ver Sugestões de Conteúdo' },
    { href: '/admin/manage-content', icon: Database, label: 'Gerenciar Conteúdo', tooltip: 'Gerenciar dados da Wiki e do Jogo' },
    { href: '/admin-chat', icon: BrainCircuit, label: 'Canal com IA', tooltip: 'Interagir com a IA para desenvolvimento' },
];

export function MainNav() {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} className="w-full">
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.tooltip }}
              className={cn(
                'w-full justify-start',
                pathname === item.href &&
                  'bg-primary/10 text-primary hover:bg-primary/20'
              )}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      {isAdmin && adminNavItems.map((item) => (
         <SidebarMenuItem key={item.href}>
          <Link href={item.href} className="w-full">
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              tooltip={{ children: item.tooltip }}
              className={cn(
                'w-full justify-start',
                pathname.startsWith(item.href) &&
                  'bg-primary/10 text-primary hover:bg-primary/20'
              )}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
