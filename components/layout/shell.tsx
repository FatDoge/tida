'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  // Close sidebar when path changes (mobile navigation)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  
  // Don't render the shell for auth pages
  if (pathname.startsWith('/auth') || loading) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 transition-all",
          "scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/40"
        )}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}