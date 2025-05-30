'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { useI18n } from '@/providers/i18n-provider';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskContributionCalendarProps {
  tasks: Task[];
  title: string;
}

interface DayData {
  date: string;
  count: number;
  level: number; // 0-4 表示任务数量级别
  isInSelectedRange: boolean; // 是否在所选时间范围内
}

type TimeRange = '30' | '90' | '180' | '365';

export function TaskContributionCalendar({ tasks, title }: TaskContributionCalendarProps) {
  const { t } = useI18n();
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  
  // 更新日历数据
  useEffect(() => {
    // 始终获取过去365天的数据
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // 过去365天（包括今天）
    
    // 计算所选时间范围的起始日期
    const selectedRangeStartDate = new Date(today);
    selectedRangeStartDate.setDate(today.getDate() - (parseInt(timeRange) - 1));
    
    // 生成日期列表
    const dateList: string[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dateList.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD 格式
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 统计每天的任务数量
    const taskCountByDate: Record<string, number> = {};
    
    // 初始化所有日期的任务数为0
    dateList.forEach(date => {
      taskCountByDate[date] = 0;
    });
    
    // 计算每天的任务数
    tasks.forEach(task => {
      const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
      if (taskCountByDate[createdDate] !== undefined) {
        taskCountByDate[createdDate]++;
      }
    });
    
    // 找出最大任务数
    const maxCount = Math.max(...Object.values(taskCountByDate), 1);
    
    // 计算任务数量级别 (0-4)
    const calculateLevel = (count: number): number => {
      if (count === 0) return 0;
      if (maxCount <= 4) return count;
      
      const step = maxCount / 4;
      return Math.min(Math.ceil(count / step), 4);
    };
    
    // 生成日历数据
    const data: DayData[] = dateList.map(date => ({
      date,
      count: taskCountByDate[date],
      level: calculateLevel(taskCountByDate[date]),
      isInSelectedRange: new Date(date) >= selectedRangeStartDate
    }));
    
    setCalendarData(data);
  }, [tasks, timeRange]);
  
  // 获取日期的月份和日期
  const getMonthAndDay = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // 获取颜色类
  const getLevelColorClass = (level: number, isInSelectedRange: boolean): string => {
    if (!isInSelectedRange) return 'bg-gray-50 dark:bg-gray-900 opacity-30'; // 不在所选范围内的格子显示为半透明
    
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-400 dark:bg-green-600';
      case 4: return 'bg-green-500 dark:bg-green-500';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  
  // 固定每行显示的格子数
  const getGridColumns = () => {
    return 52; // 每行52个格子，大约一周7天 * 52周 = 364天
  };
  
  // 固定行数
  const getRowCount = () => {
    return 7; // 每列7个格子，7*52=364，接近365天
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t('select_time_range')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">{t('last_30_days')}</SelectItem>
            <SelectItem value="90">{t('last_90_days')}</SelectItem>
            <SelectItem value="180">{t('last_180_days')}</SelectItem>
            <SelectItem value="365">{t('last_year')}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* 横向可滚动 */}
        <div className="overflow-x-auto pb-2">
          {/* 贡献格子 - 网格布局 */}
          <div 
            className="grid gap-0.5 min-w-max" 
            style={{ 
              gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${getRowCount()}, 1fr)`,
              maxHeight: '168px' // 6行格子的最大高度
            }}
          >
            {calendarData.map((day) => (
              <div 
                key={day.date} 
                className={cn(
                  "w-5 h-5 rounded-sm flex flex-col items-center justify-center text-xs",
                  getLevelColorClass(day.level, day.isInSelectedRange)
                )}
                title={`${day.date}: ${day.count} ${t('tasks')}`}
                data-date={day.date}
                data-count={day.count}
              >
                <span className="text-[6px] leading-none text-muted-foreground">
                  {getMonthAndDay(day.date).split('/')[1]}
                </span>
                {day.count > 0 && day.isInSelectedRange && (
                  <span className="text-[7px] leading-none font-medium">
                    {day.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-2 text-xs text-muted-foreground border-t">
          <div>
            {t('showing_tasks_for_last')} {timeRange} {t('days')}
          </div>
          <div className="flex items-center gap-0.5">
            <span>{t('less')}</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-2.5 h-2.5 rounded-sm bg-green-300 dark:bg-green-700" />
            <div className="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-600" />
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500 dark:bg-green-500" />
            <span>{t('more')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}