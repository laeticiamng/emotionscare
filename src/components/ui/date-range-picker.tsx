
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  value,
  onChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange?.(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "P", { locale: fr })} -{" "}
                  {format(date.to, "P", { locale: fr })}
                </>
              ) : (
                format(date.from, "P", { locale: fr })
              )
            ) : (
              <span>Sélectionner une plage de dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
