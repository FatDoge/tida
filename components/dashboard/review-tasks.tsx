import Link from 'next/link';
import { CheckCircle2, Clock3, Circle, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { isOverdue, isDueToday } from '@/lib/utils';
import { useTasks } from '@/providers/tasks-provider';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/providers/i18n-provider';

interface ReviewTasksProps {
  tasks: Task[];
  title: string;
  description: string;
  noTasksMessage: string;
  viewAllLabel: string;
}

export function ReviewTasks({ 
  tasks, 
  title, 
  description, 
  noTasksMessage,
  viewAllLabel 
}: ReviewTasksProps) {
  const { t } = useI18n();
  const { updateTask } = useTasks();
  const { toast } = useToast();

  // 筛选出今日逾期或已逾期未完成的任务
  const overdueTasks = tasks.filter(task => 
    (isOverdue(task) || isDueToday(task)) && task.status !== 'completed'
  );

  // 处理任务完成状态切换
  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: 'completed' });
      toast({
        title: t('success'),
        description: t('task_updated'),
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
          {overdueTasks.length > 0 ? (
            overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : isOverdue(task) ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock3 className="h-5 w-5 text-yellow-500" />
                    )}
                  </button>
                  <span>
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