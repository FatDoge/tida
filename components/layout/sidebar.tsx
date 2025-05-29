'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Tag, Settings, X, Triangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  translationKey: string;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { categories } = useTasks();
  
  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      translationKey: 'dashboard',
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      translationKey: 'tasks',
    },
    {
      title: 'Categories',
      href: '/categories',
      icon: <Tag className="h-5 w-5" />,
      translationKey: 'categories',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      translationKey: 'settings',
    },
  ];
  
  // Add effect to handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  
  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const target = e.target as Node;
      
      if (sidebar && !sidebar.contains(target) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card px-3 py-4 shadow-sm transition-transform duration-300 md:relative md:z-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <Link href="/" className="flex items-center">
            <Triangle className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold tracking-tight">
              {t('app_name')}
            </h2>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <nav className="grid gap-1 py-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/70"
              )}
            >
              {item.icon}
              {t(item.translationKey as any)}
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4" />
        
        <div className="px-3 py-2">
          <h3 className="mb-2 text-sm font-medium text-foreground/70">
            {t('categories')}
          </h3>
          <div className="grid gap-1">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground px-3 py-2">
                {t('no_categories')}
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-muted-foreground mt-2"
              asChild
            >
              <Link href="/categories">
                <span>{t('add_category')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}