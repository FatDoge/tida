'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">正在处理登录...</h1>
      <p className="text-muted-foreground">请稍候，正在完成认证过程</p>
    </div>
  );
}