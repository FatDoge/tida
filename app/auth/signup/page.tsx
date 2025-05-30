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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { useI18n } from '@/providers/i18n-provider';

export default function SignupPage() {
  const { t } = useI18n();
  const { signUp, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signupSchema = z.object({
    email: z.string().email({
      message: t('please_enter_valid_email'),
    }),
    password: z.string().min(6, {
      message: t('password_min_length'),
    }),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: t('passwords_do_not_match'),
    path: ['confirmPassword'],
  });
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    
    // 在onSubmit函数中修改成功消息
    try {
      const { error } = await signUp(values.email, values.password);
      
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
        description: t('check_email_for_confirmation'),
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
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Triangle className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">{t('sign_up')}</h1>
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
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••" 
                      type="password" 
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {t('password_min_length')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm_password')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••" 
                      type="password" 
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('loading') : t('sign_up')}
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
          {t('already_have_account')}{' '}
          <Link
            href="/auth/login"
            className="font-medium underline-offset-4 hover:underline"
          >
            {t('sign_in')}
          </Link>
        </div>
      </div>
    </div>
  );
}
