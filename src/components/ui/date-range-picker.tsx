import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (value: [Date, Date]) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<[Date, Date]>(value);

  const handleApply = () => {
    onChange(date);
    setIsOpen(false);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = addDays(end, -days);
    setDate([start, end]);
  };

  // Format for display
  const formatDateRange = (range: [Date, Date]) => {
    return `${format(range[0], 'dd/MM/yyyy', { locale: fr })} - ${format(range[1], 'dd/MM/yyyy', { locale: fr })}`;
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateRange(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Sélection rapide</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(7)}
                >
                  7 jours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(30)}
                >
                  30 jours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(90)}
                >
                  90 jours
                </Button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Date de début</h4>
                <CalendarComponent
                  mode="single"
                  selected={date[0]}
                  onSelect={(selectedDate) => 
                    selectedDate && setDate([selectedDate, date[1]])
                  }
                  disabled={(d) => d > date[1]}
                />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Date de fin</h4>
                <CalendarComponent
                  mode="single"
                  selected={date[1]}
                  onSelect={(selectedDate) => 
                    selectedDate && setDate([date[0], selectedDate])
                  }
                  disabled={(d) => d < date[0] || d > new Date()}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleApply}>
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
