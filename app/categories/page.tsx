import { Suspense } from 'react';
import { Metadata } from 'next';
import Shell from '@/components/layout/shell';
import CategoryList from '@/components/categories/category-list';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Categories | Tida',
  description: 'Manage your task categories',
};

export default function CategoriesPage() {
  return (
    <Shell>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoryList />
      </Suspense>
    </Shell>
  );
}

function CategoriesSkeleton() {
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