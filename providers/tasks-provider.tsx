'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Task, Category } from '@/types/task';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { generateId, getLocalStorageItem, setLocalStorageItem } from '@/lib/utils';

interface TasksContextType {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  reorderTasks: (taskId: string, newOrder: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'taskflow-tasks';
const CATEGORIES_STORAGE_KEY = 'taskflow-categories';
const SYNC_TIMESTAMP_KEY = 'taskflow-last-sync';

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load tasks from local storage initially
  useEffect(() => {
    const localTasks = getLocalStorageItem<Task[]>(TASKS_STORAGE_KEY, []);
    const localCategories = getLocalStorageItem<Category[]>(CATEGORIES_STORAGE_KEY, []);
    
    setTasks(localTasks);
    setCategories(localCategories);
    
    // Only fetch from Supabase if user is logged in
    if (user) {
      fetchTasksAndCategories();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  // Sync with Supabase when online
  const fetchTasksAndCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch tasks from Supabase
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order', { ascending: true });
      
      if (tasksError) throw tasksError;
      
      // Fetch categories from Supabase
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      
      if (categoriesError) throw categoriesError;
      
      // Transform Supabase data to our Task type
      const transformedTasks: Task[] = tasksData.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        categoryId: task.category_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        order: task.order
      }));
      
      // Transform Supabase data to our Category type
      const transformedCategories: Category[] = categoriesData.map(category => ({
        id: category.id,
        name: category.name,
        color: category.color,
        createdAt: category.created_at
      }));
      
      // Update local state and localStorage
      setTasks(transformedTasks);
      setCategories(transformedCategories);
      setLocalStorageItem(TASKS_STORAGE_KEY, transformedTasks);
      setLocalStorageItem(CATEGORIES_STORAGE_KEY, transformedCategories);
      setLocalStorageItem(SYNC_TIMESTAMP_KEY, new Date().toISOString());
      
    } catch (error: any) {
      toast({
        title: 'Error syncing data',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Error fetching tasks and categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a task
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Task> => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: now,
      updatedAt: now,
      order: tasks.length,
    };
    
    // Update local state
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setLocalStorageItem(TASKS_STORAGE_KEY, updatedTasks);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from('tasks').insert({
          id: newTask.id,
          user_id: user.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          category_id: newTask.categoryId,
          due_date: newTask.dueDate,
          created_at: newTask.createdAt,
          updated_at: newTask.updatedAt,
          order: newTask.order,
        });
        
        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Error saving task',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error saving task to Supabase:', error);
      }
    }
    
    return newTask;
  };
  
  // Update a task
  const updateTask = async (id: string, taskUpdate: Partial<Task>): Promise<Task> => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) throw new Error('Task not found');
    
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...taskUpdate,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    
    // Update local state
    setTasks(updatedTasks);
    setLocalStorageItem(TASKS_STORAGE_KEY, updatedTasks);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            category_id: updatedTask.categoryId,
            due_date: updatedTask.dueDate,
            updated_at: updatedTask.updatedAt,
            order: updatedTask.order,
          })
          .eq('id', id);
        
        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Error updating task',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error updating task in Supabase:', error);
      }
    }
    
    return updatedTask;
  };
  
  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    // Update local state
    setTasks(updatedTasks);
    setLocalStorageItem(TASKS_STORAGE_KEY, updatedTasks);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Error deleting task',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error deleting task from Supabase:', error);
      }
    }
  };
  
  // Create a category
  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
    const now = new Date().toISOString();
    const newCategory: Category = {
      id: generateId(),
      ...categoryData,
      createdAt: now,
    };
    
    // Update local state
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setLocalStorageItem(CATEGORIES_STORAGE_KEY, updatedCategories);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from('categories').insert({
          id: newCategory.id,
          user_id: user.id,
          name: newCategory.name,
          color: newCategory.color,
          created_at: newCategory.createdAt,
        });
        
        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Error saving category',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error saving category to Supabase:', error);
      }
    }
    
    return newCategory;
  };
  
  // Update a category
  const updateCategory = async (id: string, categoryUpdate: Partial<Category>): Promise<Category> => {
    const categoryIndex = categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) throw new Error('Category not found');
    
    const updatedCategory: Category = {
      ...categories[categoryIndex],
      ...categoryUpdate,
    };
    
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex] = updatedCategory;
    
    // Update local state
    setCategories(updatedCategories);
    setLocalStorageItem(CATEGORIES_STORAGE_KEY, updatedCategories);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('categories')
          .update({
            name: updatedCategory.name,
            color: updatedCategory.color,
          })
          .eq('id', id);
        
        if (error) throw error;
      } catch (error: any) {
        toast({
          title: 'Error updating category',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error updating category in Supabase:', error);
      }
    }
    
    return updatedCategory;
  };
  
  // Delete a category
  const deleteCategory = async (id: string): Promise<void> => {
    const updatedCategories = categories.filter(category => category.id !== id);
    
    // Update local state
    setCategories(updatedCategories);
    setLocalStorageItem(CATEGORIES_STORAGE_KEY, updatedCategories);
    
    // Update tasks that had this category
    const updatedTasks = tasks.map(task => {
      if (task.categoryId === id) {
        return { ...task, categoryId: null };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setLocalStorageItem(TASKS_STORAGE_KEY, updatedTasks);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        // First update tasks that had this category
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ category_id: null })
          .eq('category_id', id);
        
        if (updateError) throw updateError;
        
        // Then delete the category
        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        
        if (deleteError) throw deleteError;
      } catch (error: any) {
        toast({
          title: 'Error deleting category',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error deleting category from Supabase:', error);
      }
    }
  };
  
  // Reorder tasks
  const reorderTasks = async (taskId: string, newOrder: number): Promise<void> => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const currentOrder = tasks[taskIndex].order;
    if (currentOrder === newOrder) return;
    
    const updatedTasks = [...tasks];
    
    // Remove the task from its current position
    const [task] = updatedTasks.splice(taskIndex, 1);
    
    // Insert the task at the new position
    updatedTasks.splice(newOrder, 0, task);
    
    // Update the order of all tasks
    const reorderedTasks = updatedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    
    // Update local state
    setTasks(reorderedTasks);
    setLocalStorageItem(TASKS_STORAGE_KEY, reorderedTasks);
    
    // Sync with Supabase if user is logged in
    if (user) {
      try {
        // Update each task that has a new order
        for (const task of reorderedTasks) {
          const { error } = await supabase
            .from('tasks')
            .update({ order: task.order })
            .eq('id', task.id);
          
          if (error) throw error;
        }
      } catch (error: any) {
        toast({
          title: 'Error reordering tasks',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error reordering tasks in Supabase:', error);
      }
    }
  };
  
  const value = {
    tasks,
    categories,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderTasks,
  };
  
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}