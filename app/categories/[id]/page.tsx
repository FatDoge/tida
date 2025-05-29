import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Shell from '@/components/layout/shell';
import TaskList from '@/components/tasks/task-list';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryTaskList from '@/components/categories/category-task-list';
import { getLocalStorageItem } from '@/lib/utils';
import { Category } from '@/types/task';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Category Tasks | Tida',
  description: 'View tasks by category',
};

// 添加这个函数来生成所有可能的类别 ID 参数
export async function generateStaticParams() {
  // 在服务器端，我们无法直接访问 localStorage
  // 所以我们需要返回一个空数组，实际的类别将在客户端组件中处理
  // 或者，如果你使用数据库，可以从数据库中获取所有类别 ID
  const { data: categories } = await supabase.from('categories').select('id');
  
  return categories?.map(category => ({
    id: category.id
  })) || [];
}

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // 在这里，params.id 就是类别的 ID
  return (
    <Shell>
      <Suspense fallback={<TasksSkeleton />}>
        <CategoryTaskList categoryId={params.id} />
      </Suspense>
    </Shell>
  );
}

function TasksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}