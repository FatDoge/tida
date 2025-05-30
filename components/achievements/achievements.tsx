'use client';

import { useState, useEffect } from 'react';
import { Trophy, Flame, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isOverdue, isDueToday } from '@/lib/utils';

export default function Achievements() {
  const { t } = useI18n();
  const { tasks } = useTasks();
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    consecutiveDays: 0,
    consecutiveWeeks: 0,
    consecutiveMonths: 0
  });
  
  // 计算任务统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completedOnTime = tasks.filter(task => 
    task.status === 'completed' && task.dueDate && new Date(task.dueDate) >= new Date(task.updatedAt)
  ).length;
  const overdueTasksManaged = tasks.filter(task => 
    task.status === 'completed' && task.dueDate && new Date(task.dueDate) < new Date(task.updatedAt)
  ).length;
  
  // 计算完成率
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // 计算按时完成率
  const onTimeRate = completedTasks > 0 
    ? Math.round((completedOnTime / completedTasks) * 100) 
    : 0;
  
  // 计算连续完成任务的天数
  useEffect(() => {
    if (tasks.length === 0) return;
    
    // 按日期对已完成的任务进行分组
    const completedTasksByDate: any = {};
    tasks.forEach(task => {
      if (task.status === 'completed') {
        const date = new Date(task.updatedAt).toISOString().split('T')[0];
        if (!completedTasksByDate[date]) {
          completedTasksByDate[date] = [];
        }
        completedTasksByDate[date].push(task);
      }
    });
    
    // 获取所有有完成任务的日期并排序
    const dates = Object.keys(completedTasksByDate).sort();
    if (dates.length === 0) {
      setStreakData({
        currentStreak: 0,
        longestStreak: 0,
        consecutiveDays: 0,
        consecutiveWeeks: 0,
        consecutiveMonths: 0
      });
      return;
    }
    
    // 计算当前连续天数
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // 如果今天有完成任务，从今天开始计算
    // 如果今天没有但昨天有，从昨天开始计算
    // 否则连续记录已经中断
    let startDate = null;
    if (completedTasksByDate[today]) {
      startDate = today;
    } else if (completedTasksByDate[yesterday]) {
      startDate = yesterday;
    }
    
    if (startDate) {
      currentStreak = 1;
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - 1);
      
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (completedTasksByDate[dateStr]) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    // 计算最长连续天数
    let longestStreak = 0;
    let currentConsecutive = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / 86400000);
      
      if (diffDays === 1) {
        currentConsecutive++;
      } else {
        longestStreak = Math.max(longestStreak, currentConsecutive);
        currentConsecutive = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentConsecutive);
    
    // 计算连续周和月的逻辑（简化版）
    // 这里只是一个示例，实际实现可能需要更复杂的逻辑
    const consecutiveWeeks = Math.floor(currentStreak / 7);
    const consecutiveMonths = Math.floor(currentStreak / 30);
    
    setStreakData({
      currentStreak,
      longestStreak,
      consecutiveDays: currentStreak,
      consecutiveWeeks,
      consecutiveMonths
    });
  }, [tasks]);
  
  // 获取成就等级
  const getAchievementLevel = (value: number, thresholds: number[]) => {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    for (let i = 0; i < thresholds.length; i++) {
      if (value < thresholds[i]) {
        return levels[i];
      }
    }
    return levels[levels.length - 1];
  };
  
  // 获取进度百分比
  const getProgressPercentage = (value: number, nextThreshold: number) => {
    return Math.min(Math.round((value / nextThreshold) * 100), 100);
  };
  
  // 定义成就阈值
  const tasksCompletedThresholds = [10, 50, 100, 500, 1000];
  const streakThresholds = [3, 7, 14, 30, 60];
  const onTimeRateThresholds = [60, 70, 80, 90, 95];
  
  // 获取下一个阈值
  const getNextThreshold = (value: number, thresholds: number[]) => {
    for (const threshold of thresholds) {
      if (value < threshold) {
        return threshold;
      }
    }
    return thresholds[thresholds.length - 1];
  };
  
  // 任务完成成就等级
  const tasksCompletedLevel = getAchievementLevel(completedTasks, tasksCompletedThresholds);
  const nextTasksCompletedThreshold = getNextThreshold(completedTasks, tasksCompletedThresholds);
  const tasksCompletedProgress = getProgressPercentage(completedTasks, nextTasksCompletedThreshold);
  
  // 连续完成成就等级
  const streakLevel = getAchievementLevel(streakData.currentStreak, streakThresholds);
  const nextStreakThreshold = getNextThreshold(streakData.currentStreak, streakThresholds);
  const streakProgress = getProgressPercentage(streakData.currentStreak, nextStreakThreshold);
  
  // 按时完成率成就等级
  const onTimeRateLevel = getAchievementLevel(onTimeRate, onTimeRateThresholds);
  const nextOnTimeRateThreshold = getNextThreshold(onTimeRate, onTimeRateThresholds);
  const onTimeRateProgress = getProgressPercentage(onTimeRate, nextOnTimeRateThreshold);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('achievements')}</h1>
        <p className="text-muted-foreground">{t('achievements_description')}</p>
      </div>
      
      {/* 连续成就 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('streak_achievements')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AchievementCard
            title={t('current_streak')}
            value={streakData.currentStreak}
            description={`${t('consecutive_days')}: ${streakData.currentStreak}`}
            icon={<Flame className="h-6 w-6" />}
            level={t(streakLevel as any)}
            progress={streakProgress}
            nextThreshold={nextStreakThreshold}
            color="bg-orange-500"
          />
          <AchievementCard
            title={t('longest_streak')}
            value={streakData.longestStreak}
            description={`${t('consecutive_days')}: ${streakData.longestStreak}`}
            icon={<Flame className="h-6 w-6" />}
            level={t(getAchievementLevel(streakData.longestStreak, streakThresholds) as any)}
            progress={getProgressPercentage(streakData.longestStreak, getNextThreshold(streakData.longestStreak, streakThresholds))}
            nextThreshold={getNextThreshold(streakData.longestStreak, streakThresholds)}
            color="bg-red-500"
          />
          <AchievementCard
            title={t('daily_completion')}
            value={streakData.consecutiveDays}
            description={`${t('consecutive_days')}: ${streakData.consecutiveDays}`}
            icon={<CheckCircle className="h-6 w-6" />}
            level={t(getAchievementLevel(streakData.consecutiveDays, streakThresholds) as any)}
            progress={getProgressPercentage(streakData.consecutiveDays, getNextThreshold(streakData.consecutiveDays, streakThresholds))}
            nextThreshold={getNextThreshold(streakData.consecutiveDays, streakThresholds)}
            color="bg-green-500"
          />
        </div>
      </div>
      
      {/* 完成成就 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('completion_achievements')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AchievementCard
            title={t('tasks_completed')}
            value={completedTasks}
            description={`${completedTasks} / ${totalTasks} ${t('tasks')}`}
            icon={<Trophy className="h-6 w-6" />}
            level={t(tasksCompletedLevel as any)}
            progress={tasksCompletedProgress}
            nextThreshold={nextTasksCompletedThreshold}
            color="bg-blue-500"
          />
          <AchievementCard
            title={t('on_time_completion_rate')}
            value={`${onTimeRate}%`}
            description={`${completedOnTime} ${t('tasks_completed_on_time')}`}
            icon={<Clock className="h-6 w-6" />}
            level={t(onTimeRateLevel as any)}
            progress={onTimeRateProgress}
            nextThreshold={`${nextOnTimeRateThreshold}%`}
            color="bg-purple-500"
          />
          <AchievementCard
            title={t('overdue_tasks_managed')}
            value={overdueTasksManaged}
            description={`${overdueTasksManaged} ${t('overdue_tasks')}`}
            icon={<AlertTriangle className="h-6 w-6" />}
            level={t(getAchievementLevel(overdueTasksManaged, tasksCompletedThresholds) as any)}
            progress={getProgressPercentage(overdueTasksManaged, getNextThreshold(overdueTasksManaged, tasksCompletedThresholds))}
            nextThreshold={getNextThreshold(overdueTasksManaged, tasksCompletedThresholds)}
            color="bg-yellow-500"
          />
        </div>
      </div>
    </div>
  );
}

// 成就卡片组件
interface AchievementCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  level: string;
  progress: number;
  nextThreshold: number | string;
  color: string;
}

function AchievementCard({ 
  title, 
  value, 
  description, 
  icon, 
  level, 
  progress, 
  nextThreshold,
  color 
}: AchievementCardProps) {
  const { t } = useI18n();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`p-2 rounded-full ${color.replace('bg-', 'bg-opacity-10')}`}>
            <div className={color.replace('bg-', 'text-')}>{icon}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm font-medium text-muted-foreground">{level}</div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>{description}</span>
            <span>{t('achievement_progress')}: {progress}% ({t('next')}: {nextThreshold})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}