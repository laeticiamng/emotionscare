
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { JournalEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { DayPickerDayProps } from 'react-day-picker';

interface JournalCalendarViewProps {
  entries: JournalEntry[];
  onEntryClick: (entryId: string) => void;
}

const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({ entries, onEntryClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Trouve les entrées pour la date sélectionnée
  const entriesForSelectedDate = selectedDate 
    ? entries.filter(entry => isSameDay(new Date(entry.date), selectedDate))
    : [];
  
  // Fonction pour construire un tableau de dates avec des entrées
  const entryDates = entries.map(entry => new Date(entry.date));
  
  // Personnalisation du rendu des jours du calendrier
  const dayClassName = (date: Date) => {
    const hasEntry = entryDates.some(entryDate => isSameDay(entryDate, date));
    return hasEntry ? "bg-cocoon-100 text-cocoon-800 rounded-full font-bold" : undefined;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={fr}
          className="rounded-md border"
          modifiersClassNames={{
            selected: "bg-cocoon-600 text-white hover:bg-cocoon-600 hover:text-white focus:bg-cocoon-600 focus:text-white",
          }}
          modifiersStyles={{
            selected: { fontWeight: "bold" }
          }}
          components={{
            Day: ({ date, ...props }: DayPickerDayProps) => (
              <button {...props} className={`${props.className} ${dayClassName(date) || ''}`}>
                {date.getDate()}
              </button>
            )
          }}
        />
      </Card>
      
      <Card className="h-full">
        <CardContent className="p-6">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
              <div className="h-px bg-slate-200 w-full mt-2 mb-4" />
            </div>
          )}
          
          {entriesForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {entriesForSelectedDate.map(entry => (
                <div 
                  key={entry.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => onEntryClick(entry.id)}
                >
                  <p className="text-sm text-muted-foreground line-clamp-5">
                    {entry.content || entry.text || ''}
                  </p>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-primary">Cliquer pour voir le détail</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="text-muted-foreground mb-2">
                {selectedDate ? (
                  <p>Aucune entrée pour cette date</p>
                ) : (
                  <p>Sélectionnez une date pour voir vos entrées</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalCalendarView;
