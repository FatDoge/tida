'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { useTasks } from '@/providers/tasks-provider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface TaskFilterProps {
  status: string | null;
  onStatusChange: (status: string | null) => void;
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  priority: string | null;
  onPriorityChange: (priority: string | null) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
}

export default function TaskFilter({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}: TaskFilterProps) {
  const { t } = useI18n();
  const { categories } = useTasks();
  const [open, setOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = [status, category, priority].filter(Boolean).length;
  
  // Status options
  const statuses = [
    { value: 'pending', label: t('pending') },
    { value: 'in_progress', label: t('in_progress') },
    { value: 'completed', label: t('completed') },
  ];
  
  // Priority options
  const priorities = [
    { value: 'low', label: t('low') },
    { value: 'medium', label: t('medium') },
    { value: 'high', label: t('high') },
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'order', label: 'Default' },
    { value: 'dueDate', label: t('sort_by_due_date') },
    { value: 'priority', label: t('sort_by_priority') },
    { value: 'createdAt', label: t('sort_by_created_at') },
    { value: 'title', label: 'Title' },
  ];
  
  // Handle resetting all filters
  const handleReset = () => {
    onStatusChange(null);
    onCategoryChange(null);
    onPriorityChange(null);
    onSortByChange('order');
    onSortDirectionChange('asc');
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 border-dashed">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('filter')}
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup heading={t('status')}>
              {statuses.map((statusOption) => (
                <CommandItem
                  key={statusOption.value}
                  onSelect={() => {
                    onStatusChange(
                      status === statusOption.value ? null : statusOption.value
                    );
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{statusOption.label}</span>
                  {status === statusOption.value && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => onStatusChange(null)}
                disabled={!status}
                className="text-muted-foreground"
              >
                {t('all')}
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading={t('category')}>
              {categories.map((categoryOption) => (
                <CommandItem
                  key={categoryOption.id}
                  onSelect={() => {
                    onCategoryChange(
                      category === categoryOption.id ? null : categoryOption.id
                    );
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{ backgroundColor: categoryOption.color }}
                    />
                    <span>{categoryOption.name}</span>
                  </div>
                  {category === categoryOption.id && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => onCategoryChange(null)}
                disabled={!category}
                className="text-muted-foreground"
              >
                {t('all')}
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading={t('priority')}>
              {priorities.map((priorityOption) => (
                <CommandItem
                  key={priorityOption.value}
                  onSelect={() => {
                    onPriorityChange(
                      priority === priorityOption.value ? null : priorityOption.value
                    );
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{priorityOption.label}</span>
                  {priority === priorityOption.value && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => onPriorityChange(null)}
                disabled={!priority}
                className="text-muted-foreground"
              >
                {t('all')}
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading={t('sort')}>
              {sortOptions.map((sortOption) => (
                <CommandItem
                  key={sortOption.value}
                  onSelect={() => {
                    onSortByChange(sortOption.value);
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{sortOption.label}</span>
                  {sortBy === sortOption.value && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => {
                  onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
                }}
                className="flex items-center justify-between"
              >
                <span>
                  {sortDirection === 'asc' ? t('ascending') : t('descending')}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    sortDirection === 'desc' && "rotate-180"
                  )}
                />
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={handleReset}>
                {t('reset_filters')}
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}