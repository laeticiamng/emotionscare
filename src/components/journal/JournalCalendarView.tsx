
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { JournalEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, isToday } from 'date-fns';
import { DayContentProps, CaptionProps } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Calendar as CalendarIcon, BookOpen } from 'lucide-react';

interface JournalCalendarViewProps {
  entries: JournalEntry[];
  onEntryClick: (entryId: string) => void;
}

const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({ entries, onEntryClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Create a map of dates to entries for faster lookup
  const entryDateMap = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(entry);
    });
    
    return map;
  }, [entries]);
  
  // Find entries for the selected date
  const entriesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return entryDateMap.get(dateKey) || [];
  }, [selectedDate, entryDateMap]);

  // Array of dates with entries
  const datesWithEntries = useMemo(() => 
    entries.map(entry => new Date(entry.date)),
  [entries]);
  
  // Custom caption component for the calendar
  const CustomCaption = (props: CaptionProps) => {
    const { displayMonth } = props;
    return (
      <div className="flex justify-center py-2 font-medium text-lg">
        {format(displayMonth, 'MMMM yyyy', { locale: fr })}
      </div>
    );
  };

  // Custom day component for the calendar
  const CustomDay = (props: DayContentProps) => {
    const { date } = props;
    const hasEntry = datesWithEntries.some(entryDate => isSameDay(entryDate, date));
    const isSelectedDay = selectedDate && isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);
    
    let classNames = "flex h-8 w-8 items-center justify-center rounded-full p-0";
    
    if (hasEntry) {
      classNames += " bg-cocoon-100 text-cocoon-800 font-medium";
    }
    if (isSelectedDay) {
      classNames += " bg-cocoon-600 text-white hover:bg-cocoon-600 hover:text-white";
    }
    if (isCurrentDay && !isSelectedDay) {
      classNames += " border border-cocoon-400";
    }
    
    return (
      <div className={classNames}>
        {date.getDate()}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden border-cocoon-100">
        <CardHeader className="pb-2 bg-cocoon-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5" /> Calendrier de votre journal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border-none"
              modifiersClassNames={{
                selected: "bg-cocoon-600 text-white hover:bg-cocoon-600 hover:text-white focus:bg-cocoon-600 focus:text-white",
              }}
              components={{
                Day: CustomDay,
                Caption: CustomCaption
              }}
              showOutsideDays={true}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-cocoon-100 border border-cocoon-200"></div>
              <span>Entrée présente</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full border border-cocoon-400"></div>
              <span>Aujourd'hui</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full border-cocoon-100">
        <CardHeader className="pb-2 bg-cocoon-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" /> 
              {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </CardTitle>
            <Badge variant="outline" className="bg-cocoon-50 text-cocoon-700 border-cocoon-200">
              {entriesForSelectedDate.length} {entriesForSelectedDate.length > 1 ? 'entrées' : 'entrée'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {entriesForSelectedDate.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {entriesForSelectedDate.map((entry, index) => (
                <div 
                  key={entry.id}
                  className="p-4 cursor-pointer transition-all hover:bg-cocoon-50/50"
                  onClick={() => onEntryClick(entry.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), 'HH:mm', { locale: fr })}
                    </div>
                    {entry.ai_feedback && (
                      <Badge variant="secondary" className="bg-cocoon-100 text-cocoon-800 text-xs">
                        Analysé
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm line-clamp-3 text-foreground mb-2">
                    {entry.content || entry.text || ''}
                  </p>
                  
                  <div className="flex justify-end items-center text-xs text-primary gap-1 hover:underline">
                    Voir le détail <ArrowRight className="h-3 w-3" />
                  </div>
                  
                  {index < entriesForSelectedDate.length - 1 && (
                    <Separator className="mt-2" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center py-10 px-6">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <div className="text-muted-foreground space-y-1">
                {selectedDate ? (
                  <>
                    <p className="font-medium">Aucune entrée pour cette date</p>
                    <p className="text-sm">Sélectionnez une autre date ou créez une nouvelle entrée</p>
                  </>
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
