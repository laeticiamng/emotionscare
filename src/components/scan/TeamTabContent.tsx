import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import TeamOverview from './TeamOverview';
import { User } from '@/types';

interface TeamTabContentProps {
  users: User[];
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [emotionalThreshold, setEmotionalThreshold] = useState<number[]>([0, 100]);
  const [periodFilter, setPeriodFilter] = useState<string>('7');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, emotionalThreshold, periodFilter, dateRange, users]);

  const applyFilters = () => {
    let filtered = users.filter(user => {
      const searchMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const emotionalScore = user.emotionalScore || 0;
      const thresholdMatch = emotionalScore >= emotionalThreshold[0] && emotionalScore <= emotionalThreshold[1];

      return searchMatch && thresholdMatch;
    });

    setFilteredUsers(filtered);
  };

  const handlePeriodChange = (period: string) => {
    setPeriodFilter(period);
    let fromDate;
    switch (period) {
      case '7':
        fromDate = new Date(new Date().setDate(new Date().getDate() - 7));
        break;
      case '30':
        fromDate = new Date(new Date().setDate(new Date().getDate() - 30));
        break;
      case '90':
        fromDate = new Date(new Date().setDate(new Date().getDate() - 90));
        break;
      default:
        fromDate = new Date(new Date().setDate(new Date().getDate() - 7));
        break;
    }
    setDateRange({ from: fromDate, to: new Date() });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filtrer les membres de l'équipe</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Rechercher par nom</Label>
              <Input
                type="search"
                id="search"
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label>Score émotionnel</Label>
              <div className="flex items-center space-x-2">
                <span>{emotionalThreshold[0]}</span>
                <Slider
                  value={emotionalThreshold}
                  onValueChange={setEmotionalThreshold}
                  max={100}
                  step={1}
                />
                <span>{emotionalThreshold[1]}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Période</Label>
              <Select value={periodFilter} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                          {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                        </>
                      ) : (
                        format(dateRange.from, "dd MMM yyyy", { locale: fr })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={fr}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamOverview 
        teamId="team-1" // Default team ID if none available
        dateRange={dateRange} 
        users={filteredUsers} 
        period={periodFilter} 
        anonymized={false} 
        showNames={true} 
      />
    </div>
  );
};

export default TeamTabContent;
