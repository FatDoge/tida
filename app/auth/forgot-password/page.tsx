'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { useI18n } from '@/providers/i18n-provider';

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: '请输入有效的电子邮件地址',
  }),
});

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(values.email);
      
      if (error) {
        toast({
          title: t('error_occurred'),
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: t('success'),
        description: '重置密码链接已发送到您的邮箱，请查收',
      });
      
      router.push('/auth/login');
    } catch (error: any) {
      toast({
        title: t('error_occurred'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <CheckCircleIcon className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">忘记密码</h1>
          <p className="text-muted-foreground">
            请输入您的电子邮件地址，我们将向您发送重置密码的链接
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>电子邮件</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@example.com" 
                      type="email" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '处理中...' : '发送重置链接'}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm">
          记起密码了？{' '}
          <Link
            href="/auth/login"
            className="font-medium underline-offset-4 hover:underline"
          >
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}