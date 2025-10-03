
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationFilter, Notification } from '@/types/notifications';
import { Badge } from '@/components/ui/badge';

interface NotificationFiltersProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  notifications: Notification[];
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onFilterChange,
  notifications,
}) => {
  const getFilterCount = (filter: NotificationFilter): number => {
    switch (filter) {
      case 'all':
        return notifications.length;
      case 'unread':
        return notifications.filter(n => !n.read).length;
      case 'read':
        return notifications.filter(n => n.read).length;
      default:
        return notifications.filter(n => n.type === filter).length;
    }
  };

  const filters: { value: NotificationFilter; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'unread', label: 'Non lues' },
    { value: 'achievement', label: 'Réussites' },
    { value: 'system', label: 'Système' },
  ];

  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as NotificationFilter)}>
      <TabsList className="grid w-full grid-cols-4">
        {filters.map((filter) => {
          const count = getFilterCount(filter.value);
          return (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="flex items-center gap-1 text-xs"
            >
              {filter.label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 text-xs">
                  {count}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default NotificationFilters;
