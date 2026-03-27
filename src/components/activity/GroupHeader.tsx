// @ts-nocheck
import React from 'react';

interface GroupHeaderProps {
  date: string; // YYYY-MM-DD format
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today or yesterday
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return "Aujourd'hui";
    } else if (isYesterday) {
      return "Hier";
    } else {
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }).format(date);
    }
  };

  const formattedDate = formatDate(date);
  
  return (
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {formattedDate}
    </h2>
  );
};