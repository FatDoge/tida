'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/providers/auth-provider';
import { useI18n } from '@/providers/i18n-provider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { t, language, setLanguage, availableLanguages } = useI18n();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const handleUpdateProfile = async () => {
    if (!user) {
      // 添加未登录时的提示
      toast({
        title: t('error_occurred'),
        description: t('please_login_to_save_changes'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      toast({
        title: t('success'),
        description: t('profile_updated_successfully'),
        variant:'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('error_occurred'),
        description: t('please_try_again'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 在组件中添加条件渲染
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('manage_your_account_settings')}
        </p>
      </div>
      
      <Separator />
      
      {user ? <Card>
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
          <CardDescription>
            {t('manage_your_profile_information')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('name')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              placeholder={t('email')}
            />
          </div>
        </CardContent>
      </Card> : null}
      
      <Card>
        <CardHeader>
          <CardTitle>{t('appearance')}</CardTitle>
          <CardDescription>
            {t('customize_the_appearance_of_the_app')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">{t('theme')}</Label>
            {mounted ? (
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder={t('select_theme')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('light')}</SelectItem>
                  <SelectItem value="dark">{t('dark')}</SelectItem>
                  <SelectItem value="system">{t('system')}</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-10 rounded-md border border-input bg-background px-3 py-2">
                <span className="text-muted-foreground">{t('select_theme')}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">{t('language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t('select_language')} />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {user ? <div className="flex justify-end">
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isLoading}
        >
          {isLoading ? t('saving') : t('save_changes')}
        </Button>
      </div> : null}
    </div>
  );
}