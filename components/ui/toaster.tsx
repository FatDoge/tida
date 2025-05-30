'use client';

import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle, Info, Bell, Clock3 } from 'lucide-react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // 根据不同的 variant 选择不同的图标
        const getIcon = () => {
          switch (variant) {
            case 'destructive':
              return <AlertTriangle className="h-5 w-5 text-destructive-foreground shrink-0 mt-0.5" />;
            case 'success':
              return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />;
            case 'warning':
              return <Clock3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />;
            case 'info':
              return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />;
            default:
              return <Bell className="h-5 w-5 text-foreground shrink-0 mt-0.5" />;
          }
        };

        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
