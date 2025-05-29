'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '@/components/tasks/task-card';
import { Task, Category } from '@/types/task';

interface SortableTaskCardProps {
  task: Task;
  categories: Category[];
  onEdit: (task: Task) => void;
}

export default function SortableTaskCard({ task, categories, onEdit }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
    >
      <TaskCard
        task={task}
        categories={categories}
        onEdit={onEdit}
      />
    </div>
  );
}