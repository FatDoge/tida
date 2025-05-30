'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import { Category } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ColorPicker from '@/components/categories/color-picker';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export default function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const { t } = useI18n();
  const { createCategory, updateCategory } = useTasks();
  const { toast } = useToast();
  
  const categorySchema = z.object({
    name: z.string().min(1, { message: t('name_required') }),
    color: z.string().min(1, { message: t('color_required') }),
  });
  
  type CategoryFormValues = z.infer<typeof categorySchema>;
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: '#4338CA', // Default color
    },
  });
  
  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        color: category.color,
      });
    } else {
      form.reset({
        name: '',
        color: '#4338CA',
      });
    }
  }, [category, form]);
  
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (category) {
        // Update existing category
        await updateCategory(category.id, {
          name: values.name,
          color: values.color,
        });
        
        toast({
          title: t('success'),
          description: t('category_updated'),
        });
      } else {
        // Create new category
        await createCategory({
          name: values.name,
          color: values.color,
        });
        
        toast({
          title: t('success'),
          description: t('category_created'),
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t('error_occurred'),
        description: t('please_try_again'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? t('edit_category') : t('add_category')}
          </DialogTitle>
          <DialogDescription>
            {category
              ? t('update_category_description')
              : t('create_category_description')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('category_name_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('color')}</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {category ? t('update') : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}