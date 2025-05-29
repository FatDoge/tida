'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#64748B', // Slate
  '#111827', // Gray
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal")}
          type="button"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: value }}
            />
            <span>{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "h-6 w-6 rounded-md cursor-pointer transition-all",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
                value === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div
            className="h-9 w-9 rounded-md border"
            style={{ backgroundColor: value }}
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
            placeholder="#000000"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}