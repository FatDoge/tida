import Link from 'next/link';
import { CheckCircle2, Clock3, Circle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { useTasks } from '@/providers/tasks-provider';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/providers/i18n-provider';

interface RecentTasksProps {
  recentTasks: Task[];
  title: string;
  description: string;
  noTasksMessage: string;
  viewAllLabel: string;
}

export function RecentTasks({ 
  recentTasks, 
  title, 
  description, 
  noTasksMessage,
  viewAllLabel 
}: RecentTasksProps) {
  const { t } = useI18n();
  const { updateTask } = useTasks();
  const { toast } = useToast();

  // 处理任务状态切换（完成/取消完成）
  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await updateTask(taskId, { status: newStatus });
      toast({
        title: t('success'),
        description: t('task_updated'),
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: t('error_occurred'),
        description: t('please_try_again'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : task.status === 'in_progress' ? (
                      <Clock3 className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
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
              <p className="text-muted-foreground">{noTasksMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" asChild>
          <Link href="/tasks">{viewAllLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}