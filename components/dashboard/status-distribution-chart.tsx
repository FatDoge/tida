import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StatusDistributionChartProps {
  statusData: Array<{ name: string; value: number; color: string }>;
  title: string;
  description: string;
  noTasksMessage: string;
  viewAllLabel: string;
}

export function StatusDistributionChart({ 
  statusData, 
  title, 
  description, 
  noTasksMessage,
  viewAllLabel 
}: StatusDistributionChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {statusData.length > 0 ? (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} tasks`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[220px]">
            <p className="text-muted-foreground">{noTasksMessage}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" asChild>
          <Link href="/tasks">{viewAllLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}