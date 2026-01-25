/**
 * Légende du calendrier des sessions
 */

import React from 'react';
import type { GroupSessionCategory } from '../types';
import { cn } from '@/lib/utils';

interface CalendarLegendProps {
  categories: GroupSessionCategory[];
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'bg-pink-500',
  meditation: 'bg-purple-500',
  breathing: 'bg-cyan-500',
  discussion: 'bg-blue-500',
  creative: 'bg-amber-500',
  movement: 'bg-green-500',
  support: 'bg-indigo-500',
  workshop: 'bg-red-500',
};

export const CalendarLegend: React.FC<CalendarLegendProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onCategoryClick?.(cat.name)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all',
            'hover:bg-muted',
            activeCategory === cat.name && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          <span
            className={cn('h-2.5 w-2.5 rounded-full', CATEGORY_COLORS[cat.name] || 'bg-primary')}
          />
          <span className={cn(activeCategory === cat.name ? 'font-medium' : 'text-muted-foreground')}>
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CalendarLegend;
