'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, MoreVertical, CheckCircle, Circle, Edit, Trash } from 'lucide-react';
import { Task, Category } from '@/types/task';
import { cn, formatDate, isOverdue, isDueToday } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  categories: Category[];
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, categories, onEdit }: TaskCardProps) {
  const { t } = useI18n();
  const { updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const category = categories.find(c => c.id === task.categoryId);
  
  const handleStatusToggle = async () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: newStatus });
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
  
  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: t('success'),
        description: t('task_deleted'),
      });
    } catch (error) {
      toast({
        title: t('error_occurred'),
        description: t('please_try_again'),
        variant: 'destructive',
      });
    }
  };
  
  const statusIcon = task.status === 'completed' 
    ? <CheckCircle className="h-5 w-5 text-primary" />
    : <Circle className="h-5 w-5 text-muted-foreground" />;
  
  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300',
    high: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300',
  };
  
  const dueDateClasses = cn(
    "inline-flex items-center text-xs font-medium rounded-md px-1.5 py-0.5",
    {
      "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300": isOverdue(task),
      "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300": isDueToday(task),
      "bg-muted text-muted-foreground": !isOverdue(task) && !isDueToday(task),
    }
  );
  
  return (
    <>
      <div 
        className={cn(
          "group relative flex flex-col rounded-lg border p-4 space-y-3",
          "transition-all duration-200 hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          task.status === 'completed' && "opacity-80"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 rounded-md"
              onClick={handleStatusToggle}
            >
              {statusIcon}
              <span className="sr-only">
                {task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
              </span>
            </Button>
            
            <div>
              <h3 
                className={cn(
                  "font-medium line-clamp-2",
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-muted-foreground text-sm line-clamp-2 mt-1",
                  task.status === 'completed' && "text-muted-foreground/70"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 focus:opacity-100">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Task actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('edit_task')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                {t('delete_task')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
          {task.priority && (
            <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 font-medium", priorityColors[task.priority])}>
              {t(task.priority)}
            </span>
          )}
          
          {category && (
            <span 
              className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium"
              style={{ 
                backgroundColor: `${category.color}20`,
                color: category.color 
              }}
            >
              <Tag className="mr-1 h-3 w-3" />
              {category.name}
            </span>
          )}
          
          {task.status === 'in_progress' && (
            <span className="inline-flex items-center rounded-md bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
              <Clock className="mr-1 h-3 w-3" />
              {t('in_progress')}
            </span>
          )}
        </div>
        
        {task.dueDate && (
          <div className="pt-1 text-xs">
            <span className={dueDateClasses}>
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_task')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}