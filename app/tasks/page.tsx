import { Suspense } from 'react';
import { Metadata } from 'next';
import Shell from '@/components/layout/shell';
import TaskList from '@/components/tasks/task-list';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Tasks | Tida',
  description: 'Manage your tasks',
};

export default function TasksPage() {
  return (
    <Shell>
      <Suspense fallback={<TasksSkeleton />}>
        <TaskList />
      </Suspense>
    </Shell>
  );
}

function TasksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}