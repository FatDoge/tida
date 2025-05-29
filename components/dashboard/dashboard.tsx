'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus, 
  BarChart4, 
  Calendar,
  CheckCircle2,
  Circle, 
  Clock3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import { useAuth } from '@/providers/auth-provider';
import { isOverdue, isDueToday, cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskDialog from '@/components/tasks/task-dialog';
import { Task } from '@/types/task';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const { t } = useI18n();
  const { tasks } = useTasks();
  const { user } = useAuth();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  // Calculate task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const overdueTasks = tasks.filter(task => isOverdue(task)).length;
  const todayTasks = tasks.filter(task => isDueToday(task)).length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Prepare data for pie chart
  // 修改statusData的定义，使用直接的颜色值
  const statusData = [
    { name: t('pending'), value: pendingTasks, color: '#3B82F6' }, // 蓝色
    { name: t('in_progress'), value: inProgressTasks, color: '#10B981' }, // 绿色
    { name: t('completed'), value: completedTasks, color: '#6366F1' }, // 紫色
  ].filter(item => item.value > 0);
  
  const priorityData = [
    { name: t('high'), value: tasks.filter(task => task.priority === 'high').length, color: '#EF4444' }, // 红色
    { name: t('medium'), value: tasks.filter(task => task.priority === 'medium').length, color: '#F59E0B' }, // 橙色
    { name: t('low'), value: tasks.filter(task => task.priority === 'low').length, color: '#3B82F6' }, // 蓝色
  ].filter(item => item.value > 0);
  
  // Get the most recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {user ? `${t('welcome')}, ${user.user_metadata.full_name || user.email}` : t('welcome')}
          </p>
        </div>
        <Button onClick={() => setIsTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('add_task')}
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('total_tasks')}
          value={totalTasks}
          description={`${t('completion_rate')} ${completionRate}%`}
          icon={<BarChart4 className="h-6 w-6" />}
          trend={completionRate >= 70 ? 'positive' : completionRate >= 40 ? 'neutral' : 'negative'}
          href="/tasks"
        />
        <MetricCard
          title={t('completed_tasks')}
          value={completedTasks}
          description={`${completedTasks} of ${totalTasks} tasks`}
          icon={<CheckCircle className="h-6 w-6" />}
          trend="positive"
          href="/tasks?status=completed"
        />
        <MetricCard
          title={t('due_today')}
          value={todayTasks}
          description={t('tasks_due_today')}
          icon={<Clock className="h-6 w-6" />}
          trend={todayTasks > 0 ? 'warning' : 'positive'}
          href="/tasks"
        />
        <MetricCard
          title={t('overdue')}
          value={overdueTasks}
          description={t('overdue_tasks')}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={overdueTasks > 0 ? 'negative' : 'positive'}
          href="/tasks"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t('task_distribution')}</CardTitle>
            <CardDescription>{t('task_status_distribution')}</CardDescription>
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
                <p className="text-muted-foreground">{t('no_tasks')}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild>
              <Link href="/tasks">{t('view_all_tasks')}</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* 新增：按优先级分布的饼图 */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t('task_priority_distribution')}</CardTitle>
            <CardDescription>{t('task_priority_distribution')}</CardDescription>
          </CardHeader>
          <CardContent>
            {priorityData.length > 0 ? (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {priorityData.map((entry, index) => (
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
                <p className="text-muted-foreground">{t('no_tasks')}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild>
              <Link href="/tasks">{t('view_all_tasks')}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recent_tasks')}</CardTitle>
            <CardDescription>{t('your_recent_tasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : task.status === 'in_progress' ? (
                        <Clock3 className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-muted-foreground">{t('no_tasks')}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild>
              <Link href="/tasks">{t('view_all_tasks')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
        task={null}
        onClose={() => setIsTaskDialogOpen(false)}
      />
    </div>
  );
}

// MetricCard component
interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral' | 'warning';
  href: string;
}

function MetricCard({ title, value, description, icon, trend, href }: MetricCardProps) {
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