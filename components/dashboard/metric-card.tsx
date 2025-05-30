import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral' | 'warning';
  href: string;
}

export function MetricCard({ title, value, description, icon, trend, href }: MetricCardProps) {
  const trendColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-blue-500',
    warning: 'text-yellow-500',
  };
  
  const bgColors = {
    positive: 'bg-green-500/10',
    negative: 'bg-red-500/10',
    neutral: 'bg-blue-500/10',
    warning: 'bg-yellow-500/10',
  };
  
  return (
    <Link href={href}>
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={cn("p-2 rounded-full", bgColors[trend])}>
              <div className={trendColors[trend]}>{icon}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}