
import React, { useState } from 'react';
import { JournalEntry } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface JournalCalendarViewProps {
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
}

const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({ entries, onEntryClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const dateStr = new Date(entry.date).toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  // Get entries for the selected date
  const selectedDateStr = selectedDate ? selectedDate.toDateString() : '';
  const entriesForSelectedDate = entriesByDate[selectedDateStr] || [];

  // Get all dates that have entries
  const datesWithEntries = Object.keys(entriesByDate).map(dateStr => new Date(dateStr));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Sélectionnez une date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            modifiers={{
              hasEntries: datesWithEntries,
            }}
            modifiersClassNames={{
              hasEntries: "bg-primary/20 font-bold text-primary",
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Entrées du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
              : "Sélectionnez une date pour voir les entrées"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entriesForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {entriesForSelectedDate.map(entry => (
                <Card 
                  key={entry.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onEntryClick(entry)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{entry.title}</h3>
                      <Badge>{entry.mood}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-4">
              Aucune entrée pour cette date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalCalendarView;
