export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  categoryId: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
  order: number
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
}