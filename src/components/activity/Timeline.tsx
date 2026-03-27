// @ts-nocheck
import React from 'react';
import { ActivityItem } from '@/store/activity.store';
import { ActivityItemCard } from './ActivityItem';
import { GroupHeader } from './GroupHeader';
import { Skeleton } from '@/components/ui/skeleton';

interface TimelineProps {
  items: ActivityItem[];
  loading?: boolean;
}

// Groupe les items par jour
const groupByDay = (items: ActivityItem[]) => {
  const groups: Record<string, ActivityItem[]> = {};
  
  items.forEach(item => {
    const date = new Date(item.date);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(item);
  });

  // Trie par date décroissante
  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }));
};

export const Timeline: React.FC<TimelineProps> = ({ items, loading }) => {
  const groupedItems = groupByDay(items);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groupedItems.length === 0) {
    return null; // EmptyState will be shown by parent
  }

  return (
    <div 
      className="space-y-6"
      role="list"
      aria-label="Historique d'activité"
    >
      {groupedItems.map(({ date, items }) => (
        <div key={date} className="space-y-3">
          <GroupHeader date={date} />
          <div className="space-y-2 pl-4 border-l-2 border-muted">
            {items.map(item => (
              <div key={item.id} role="listitem">
                <ActivityItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};