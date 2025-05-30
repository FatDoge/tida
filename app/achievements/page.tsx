import { Suspense } from 'react';
import { Metadata } from 'next';
import Shell from '@/components/layout/shell';
import Achievements from '@/components/achievements/achievements';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Achievements | Tida',
  description: 'View your task completion achievements',
};

export default function AchievementsPage() {
  return (
    <Shell>
      <Suspense fallback={<AchievementsSkeleton />}>
        <Achievements />
      </Suspense>
    </Shell>
  );
}

function AchievementsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}