'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, Bookmark, Lightbulb, Database, HeartPulse, Calculator } from 'lucide-react';
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
    { href: '/seed', icon: Database, label: 'Popular Dados', tooltip: 'Popular Dados' },
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
    </SidebarMenu>
  );
}
