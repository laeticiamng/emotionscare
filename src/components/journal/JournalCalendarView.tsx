
import React from 'react';
import { JournalEntry } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface JournalCalendarViewProps {
  entries: JournalEntry[];
  onEntryClick?: (entry: JournalEntry) => void;
}

const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({ entries, onEntryClick }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Créer un dictionnaire des dates avec des entrées
  const entriesByDate = React.useMemo(() => {
    const map: Record<string, JournalEntry[]> = {};
    
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(entry);
    });
    
    return map;
  }, [entries]);
  
  // Obtenir les entrées pour la date sélectionnée
  const selectedDateEntries = React.useMemo(() => {
    if (!selectedDate) return [];
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return entriesByDate[dateKey] || [];
  }, [entriesByDate, selectedDate]);
  
  // Personnaliser le rendu des jours dans le calendrier
  const modifiersStyles = {
    hasEntry: { 
      fontWeight: 'bold',
      backgroundColor: 'var(--primary-50)',
      borderColor: 'var(--primary-200)'
    }
  };
  
  // Déterminer les jours qui ont des entrées
  const daysWithEntries = React.useMemo(() => {
    return Object.keys(entriesByDate).map(dateKey => new Date(dateKey));
  }, [entriesByDate]);
  
  // Fonction pour générer des classes personnalisées pour les jours du calendrier
  const getDayClassName = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const hasEntries = !!entriesByDate[dateKey];
    
    if (hasEntries) {
      // Utiliser une couleur différente pour les jours avec entrées
      return 'bg-primary/10 font-medium border-primary/30';
    }
    
    return '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            classNames={{
              day_today: "bg-accent text-accent-foreground",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_outside: "text-muted-foreground opacity-50"
            }}
            modifiers={{ hasEntry: daysWithEntries }}
            modifiersStyles={modifiersStyles as any}
            components={{
              Day: ({ date, ...props }) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayEntries = entriesByDate[dateKey] || [];
                const hasEntries = dayEntries.length > 0;
                
                return (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          {...props}
                          className={`${props.className} ${getDayClassName(date)}`}
                        >
                          {format(date, 'd')}
                          {hasEntries && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                          )}
                        </button>
                      </TooltipTrigger>
                      {hasEntries && (
                        <TooltipContent side="right" className="p-0">
                          <div className="p-2">
                            <p className="font-medium">{format(date, 'PPPP', { locale: fr })}</p>
                            <p className="text-xs text-muted-foreground">{dayEntries.length} entrée(s)</p>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          {selectedDate && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Entrées du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </h3>
              
              {selectedDateEntries.length === 0 ? (
                <p className="text-muted-foreground">Aucune entrée pour cette date.</p>
              ) : (
                <div className="space-y-4">
                  {selectedDateEntries.map(entry => {
                    const emotionValue = entry.mood || entry.emotion || 'neutral';
                    const emotionColorClass = getEmotionColor(emotionValue);
                    
                    return (
                      <div 
                        key={entry.id} 
                        className="p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => onEntryClick && onEntryClick(entry)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{entry.title}</h4>
                          <Badge className={emotionColorClass}>
                            {getEmotionIcon(emotionValue)} {emotionValue}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalCalendarView;
