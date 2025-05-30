'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useI18n } from '@/providers/i18n-provider';
import { Skeleton } from '@/components/ui/skeleton';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { isLoaded: i18nLoaded } = useI18n();
  
  // 组合加载状态
  const loading = authLoading || !i18nLoaded;
  
  // 只在移动端视图下关闭侧边栏
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768; // 768px 是 md 断点
      if (isMobile) {
        setSidebarOpen(false);
      }
    };
    
    // 初始检查
    handleResize();
    
    // 路径变化时检查
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);
  
  // Don't render the shell for auth pages
  if (pathname.startsWith('/auth')) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {loading ? (
        // 骨架屏版本的侧边栏
        <div className="hidden md:block md:w-72 border-r bg-card px-3 py-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="space-y-2 py-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {loading ? (
          // 骨架屏版本的顶部栏
          <div className="h-16 border-b bg-background px-4 md:px-6 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ) : (
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
        )}
        
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 transition-all",
          "scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/40"
        )}>
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              // 只对主内容应用淡入效果，而不是整个布局
              <div className="content-container">
                <div className="fade-in">{children}</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}