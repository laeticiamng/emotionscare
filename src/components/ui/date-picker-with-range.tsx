
"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange
  setDate?: (date: DateRange) => void
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    date || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  )

  React.useEffect(() => {
    if (date) {
      setDateRange(date)
    }
  }, [date])

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (setDate) {
      setDate(range || { from: undefined, to: undefined })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: fr })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: fr })
              )
            ) : (
              <span>Sélectionner une période</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={fr}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerWithRange
