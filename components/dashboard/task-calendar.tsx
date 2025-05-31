'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus } from '@/types/task';
import { useI18n } from '@/providers/i18n-provider';
import { cn, isOverdue, isDueToday } from '@/lib/utils';
import { useTasks } from '@/providers/tasks-provider';
import { useToast } from '@/hooks/use-toast';

interface TaskCalendarProps {
  tasks: Task[];
  title: string;
  description: string;
}

export function TaskCalendar({ tasks, title, description }: TaskCalendarProps) {
  const { t } = useI18n();
  const { updateTask } = useTasks();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  
  // 获取当前月份的所有日期，并包含前后月份的日期以填充完整的日历网格
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // 获取未来7天的日期范围
  const today = new Date();
  const nextWeekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  // 当tasks或selectedDate变化时，更新selectedDateTasks
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateTasks(getTasksForDay(selectedDate));
    }
  }, [tasks, selectedDate]);
  
  // 处理任务完成状态切换
  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await updateTask(taskId, { status: newStatus });
      
      // 更新本地tasks数组中对应任务的状态
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
      
      // 使用更新后的任务列表重新过滤选中日期的任务
      if (selectedDate) {
        const updatedSelectedTasks = updatedTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return (
            dueDate.getDate() === selectedDate.getDate() &&
            dueDate.getMonth() === selectedDate.getMonth() &&
            dueDate.getFullYear() === selectedDate.getFullYear()
          );
        });
        setSelectedDateTasks(updatedSelectedTasks);
      }
      
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
  
  // 上个月
  const prevMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date);
  };
  
  // 下个月
  const nextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date);
  };
  
  // 跳转到今天
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    setSelectedDateTasks(getTasksForDay(new Date()));
  };
  
  // 计算某一天的任务数量
  const getTaskCountForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === day.getDate() &&
        dueDate.getMonth() === day.getMonth() &&
        dueDate.getFullYear() === day.getFullYear() &&
        task.status !== 'completed'
      );
    }).length;
  };
  
  // 获取某一天的任务列表
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === day.getDate() &&
        dueDate.getMonth() === day.getMonth() &&
        dueDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  // 处理日期点击
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedDateTasks(getTasksForDay(day));
  };
  
  // 获取日期的样式类
  const getDayClass = (day: Date) => {
    const taskCount = getTaskCountForDay(day);
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentDate);
    
    let baseClass = "flex flex-col items-center justify-center w-9 h-9 rounded-full cursor-pointer ";
    
    if (!isCurrentMonth) {
      return baseClass + "text-gray-300 dark:text-gray-600";
    }
    
    if (isSelected) {
      return baseClass + "bg-primary text-primary-foreground";
    }
    
    if (isToday(day)) {
      return baseClass + (taskCount > 0 ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-bold" : "border border-primary text-primary");
    }
    
    if (isTomorrow(day)) {
      return baseClass + (taskCount > 0 ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300" : "text-orange-600 dark:text-orange-400");
    }
    
    if (taskCount > 0) {
      return baseClass + "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300";
    }
    
    return baseClass + "hover:bg-muted";
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="h-8 px-2 text-xs">
              {t('today')}
            </Button>
            <div className="font-medium text-sm min-w-24 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <Button variant="outline" size="sm" onClick={nextMonth} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 日历头部 - 星期几 */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium">
          {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map((day, i) => (
            <div key={i} className="py-1">{day}</div>
          ))}
        </div>
        
        {/* 日历主体 */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, i) => {
            const taskCount = getTaskCountForDay(day);
            return (
              <div 
                key={i} 
                onClick={() => handleDateClick(day)}
                className={getDayClass(day)}
                title={taskCount > 0 ? `${taskCount} ${t('tasks')}` : ''}
              >
                <span className="text-xs">{format(day, 'd')}</span>
                {taskCount > 0 && (
                  <span className="text-[8px] font-bold">{taskCount}</span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 选中日期的任务列表 */}
        {selectedDate && selectedDateTasks.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h3 className="text-sm font-medium mb-2">
              {isToday(selectedDate) ? t('today') : 
               isTomorrow(selectedDate) ? t('tomorrow') : 
               format(selectedDate, 'EEEE, MMM d')} 
              <span className="text-xs text-muted-foreground ml-1">({selectedDateTasks.length})</span>
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {selectedDateTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-2 text-xs transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTaskStatus(task.id, task.status);
                      }}
                      className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                    >
                      {task.status === 'completed' ? (
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-primary" />
                      )}
                    </button>
                    <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 未来7天任务预览 */}
        <div className="mt-4 border-t pt-3">
          <h3 className="text-sm font-medium mb-2">{t('upcoming_tasks')}</h3>
          <div className="space-y-2">
            {nextWeekDays.map((day, i) => {
              const dayTasks = getTasksForDay(day);
              if (dayTasks.length === 0) return null;
              
              return (
                <div key={i} className="text-sm">
                  <div className="font-medium mb-1 text-xs">
                    {isToday(day) ? t('today') : 
                     isTomorrow(day) ? t('tomorrow') : 
                     format(day, 'EEEE, MMM d')}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({dayTasks.length} {dayTasks.length === 1 ? t('task') : t('tasks')})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between rounded-lg border p-2 text-xs transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTaskStatus(task.id, task.status);
                            }}
                            className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                          >
                            {task.status === 'completed' ? (
                              <div className="h-3 w-3 rounded-full bg-primary" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-primary" />
                            )}
                          </button>
                          <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-right">
                        +{dayTasks.length - 3} {t('more')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {nextWeekDays.every(day => getTasksForDay(day).length === 0) && (
              <div className="text-sm text-muted-foreground py-2 text-center">
                {t('no_upcoming_tasks')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}