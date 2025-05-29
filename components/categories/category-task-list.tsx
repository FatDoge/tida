'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import TaskList from '@/components/tasks/task-list';

interface CategoryTaskListProps {
  categoryId: string;
}

export default function CategoryTaskList({ categoryId }: CategoryTaskListProps) {
  const { t } = useI18n();
  const { categories } = useTasks();
  const router = useRouter();
  
  // 查找类别
  const category = categories.find(c => c.id === categoryId);
  
  // 如果类别不存在，可以重定向到任务页面
  useEffect(() => {
    if (categories.length > 0 && !category) {
      router.push('/tasks');
    }
  }, [category, categories, router]);
  
  if (!category) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <h1 className="text-2xl font-bold tracking-tight">
          {category.name} {t('tasks')}
        </h1>
      </div>
      
      {/* 使用现有的 TaskList 组件，但传入预设的类别筛选 */}
      <TaskList initialCategoryFilter={categoryId} />
    </div>
  );
}