
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry } from '@/types';
import { format } from 'date-fns';

export interface JournalCalendarViewProps {
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
}

const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({ entries, onEntryClick }) => {
  // Get all dates that have entries
  const datesWithEntries = entries.map(entry => new Date(entry.date));
  
  // Create a lookup of dates to entries for quick access
  const entryLookup = entries.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);
  
  // Handle day click to show entries for that day
  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayEntries = entryLookup[dateKey];
    
    if (dayEntries && dayEntries.length > 0) {
      // If multiple entries, show the first one
      onEntryClick(dayEntries[0]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des entrées</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={handleDayClick}
          className="rounded-md border"
          modifiers={{
            hasEntry: datesWithEntries
          }}
          modifiersStyles={{
            hasEntry: {
              fontWeight: 'bold',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-900)'
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default JournalCalendarView;
