'use client';

import Link from 'next/link';
import { useI18n } from '@/providers/i18n-provider';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} Tida build with TraeAI.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/privacy-policy" 
            className="text-sm text-muted-foreground hover:underline"
          >
            隐私权政策
          </Link>
          <Link 
            href="/terms" 
            className="text-sm text-muted-foreground hover:underline"
          >
            使用条款
          </Link>
        </div>
      </div>
    </footer>
  );
}