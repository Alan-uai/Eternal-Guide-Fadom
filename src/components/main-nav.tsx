'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, Bookmark, FileText, Lightbulb, Database } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: BotMessageSquare, label: 'AI Chat', tooltip: 'AI Chat' },
  { href: '/wiki', icon: FileText, label: 'Game Wiki', tooltip: 'Game Wiki' },
  { href: '/saved', icon: Bookmark, label: 'Saved Answers', tooltip: 'Saved Answers' },
  { href: '/suggest', icon: Lightbulb, label: 'Suggest Content', tooltip: 'Suggest Content' },
  { href: '/seed', icon: Database, label: 'Seed Data', tooltip: 'Seed Data' },
];

export function MainNav() {
  const pathname = usePathname();

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
    </SidebarMenu>
  );
}
