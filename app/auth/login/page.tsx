'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Triangle } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { t, isLoaded } = useI18n();
  const { signIn, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email({
      message: t('please_enter_valid_email'),
    }),
    password: z.string().min(6, {
      message: t('password_min_length'),
    }),
  });
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    // 在onSubmit函数中修改成功消息
    try {
      const { error } = await signIn(values.email, values.password);
      
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
        description: t('login_success'),
        variant: 'success',
      });
      
      router.push('/');
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
  
  async function handleProviderSignIn(provider: 'google' | 'github') {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        toast({
          title: t('error_occurred'),
          description: error.message,
          variant: 'destructive',
        });
      }
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
  
  // 添加加载状态的骨架屏，带有淡入淡出效果
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 animate-fade-in">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Triangle className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">{t('sign_in')}</h1>
          <p className="text-muted-foreground">
            {t('welcome')}
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('password')}</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {t('forgot_password')}
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="••••••" 
                      type="password" 
                      autoComplete="current-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('loading') : t('sign_in')}
            </Button>
          </form>
        </Form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('or_continue_with')}
            </span>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleProviderSignIn('github')}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        
        <div className="text-center text-sm">
          {t('dont_have_account')}{' '}
          <Link
            href="/auth/signup"
            className="font-medium underline-offset-4 hover:underline"
          >
            {t('sign_up')}
          </Link>
        </div>
      </div>
    </div>
  );
}
