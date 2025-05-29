import { Suspense } from 'react';
import { Metadata } from 'next';
import Shell from '@/components/layout/shell';
import SettingsForm from '@/components/settings/settings-form';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Settings | Tida',
  description: 'Manage your Tida settings',
};

export default function SettingsPage() {
  return (
    <Shell>
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsForm />
      </Suspense>
    </Shell>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}