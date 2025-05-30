'use client';

import { useState } from 'react';
import { Menu, Bell, Moon, Sun, User, LogOut, LogIn, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';
import { useI18n } from '@/providers/i18n-provider';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
  user: SupabaseUser | null;
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { t, language, setLanguage, availableLanguages } = useI18n();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleSignIn = () => {
    router.push('/auth/login');
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">{t('app_name')}</h2>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-muted-foreground">
              {t('no_new_notifications')}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {user && user.role === 'authenticated' && (
                  <div className="absolute -bottom-2 -right-2">
                    <Badge 
                      variant="default"
                      className="h-3 text-[8px] px-1 py-0"
                    >
                      Pro
                    </Badge>
                  </div>
                )}
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata.full_name || user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <div className="flex items-center px-2 py-1.5 text-sm">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>{t('language')}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? 'bg-accent' : ''}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('sign_out')}</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <div className="flex items-center px-2 py-1.5 text-sm">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>{t('language')}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {availableLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? 'bg-accent' : ''}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignIn}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>{t('sign_in')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
