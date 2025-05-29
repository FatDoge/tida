import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Task } from '@/types/task';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to format a date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Function to determine if a task is overdue
export function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate < now && task.status !== 'completed';
}

// Function to determine if a task is due today
export function isDueToday(task: Task): boolean {
  if (!task.dueDate) return false;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  return (
    dueDate.getDate() === now.getDate() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getFullYear() === now.getFullYear() &&
    task.status !== 'completed'
  );
}

// Function to handle reordering of tasks using drag and drop
export function reorderTasks(tasks: Task[], startIndex: number, endIndex: number): Task[] {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Update order property
  return result.map((task, index) => ({
    ...task,
    order: index,
  }));
}

// Local storage helpers
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}