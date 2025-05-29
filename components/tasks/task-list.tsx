'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SearchX, Plus } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskCard from '@/components/tasks/task-card';
import SortableTaskCard from '@/components/tasks/sortable-task-card';
import TaskDialog from '@/components/tasks/task-dialog';
import TaskFilter from '@/components/tasks/task-filter';

// 在组件接口中添加可选的初始筛选参数
interface TaskListProps {
  initialCategoryFilter?: string | null;
}

export default function TaskList({ initialCategoryFilter = null }: TaskListProps) {
  const { t } = useI18n();
  const { tasks, categories, reorderTasks } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(initialCategoryFilter);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Filter and sort tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(lowerSearchTerm) || 
          (task.description && task.description.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(task => task.status === filterStatus);
    }
    
    // Apply category filter
    if (filterCategory) {
      result = result.filter(task => task.categoryId === filterCategory);
    }
    
    // Apply priority filter
    if (filterPriority) {
      result = result.filter(task => task.priority === filterPriority);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          comparison = (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
          break;
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case 'createdAt':
          comparison = a.createdAt > b.createdAt ? 1 : -1;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default: // 'order'
          comparison = a.order - b.order;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, filterStatus, filterCategory, filterPriority, sortBy, sortDirection]);
  
  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };
  
  const handleTaskDialogClose = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  };
  
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Find the indices of the dragged and dropped tasks
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);
      
      // Update the order in our state first for immediate feedback
      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      setFilteredTasks(newTasks);
      
      // Then update the order in the backend
      await reorderTasks(active.id, newIndex);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('tasks')}</h1>
        <Button onClick={() => setIsTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('add_task')}
        </Button>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Input
            placeholder={t('search_tasks')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        
        <TaskFilter
          status={filterStatus}
          onStatusChange={setFilterStatus}
          category={filterCategory}
          onCategoryChange={setFilterCategory}
          priority={filterPriority}
          onPriorityChange={setFilterPriority}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
        />
      </div>
      
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <SortableTaskCard 
                    key={task.id} 
                    task={task} 
                    categories={categories} 
                    onEdit={handleTaskEdit} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <SearchX className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t('no_tasks')}</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus || filterCategory || filterPriority
                ? 'Try changing your filters'
                : 'Create your first task to get started'}
            </p>
          </div>
        )}
      </div>
      
      <TaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
        onClose={handleTaskDialogClose}
      />
    </div>
  );
}