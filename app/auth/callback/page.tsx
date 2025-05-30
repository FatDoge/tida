'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/providers/i18n-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { t, isLoaded } = useI18n();

  useEffect(() => {
    // 处理 OAuth 回调
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      // 无论成功与否，都重定向到首页
      // 如果登录成功，用户会被认证
      // 如果失败，用户会看到未登录状态
      router.push('/');
    };

    handleAuthCallback();
  }, [router]);

  // 添加加载状态的骨架屏
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center animate-fade-in">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center animate-fade-in">
      <h1 className="text-2xl font-bold">{t('processing_login')}</h1>
      <p className="text-muted-foreground">{t('completing_authentication')}</p>
    </div>
  );
}