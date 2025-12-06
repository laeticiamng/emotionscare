// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';

interface DayEntry {
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  hasEntry: boolean;
  intensity: number;
}

interface EmotionalCalendarProps {
  onDateSelect?: (date: string) => void;
  className?: string;
}

const EmotionalCalendar: React.FC<EmotionalCalendarProps> = ({
  onDateSelect,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock data for demonstration
  const [entries] = useState<Record<string, DayEntry>>({
    '2024-01-15': { date: '2024-01-15', mood: 'good', hasEntry: true, intensity: 75 },
    '2024-01-14': { date: '2024-01-14', mood: 'excellent', hasEntry: true, intensity: 90 },
    '2024-01-13': { date: '2024-01-13', mood: 'neutral', hasEntry: true, intensity: 50 },
    '2024-01-12': { date: '2024-01-12', mood: 'bad', hasEntry: true, intensity: 30 },
    '2024-01-11': { date: '2024-01-11', mood: 'good', hasEntry: true, intensity: 70 },
  });

  const getMoodColor = (mood: string) => {
    const colors = {
      'excellent': 'bg-green-500',
      'good': 'bg-blue-500',
      'neutral': 'bg-yellow-500',
      'bad': 'bg-orange-500',
      'terrible': 'bg-red-500'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-300';
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      'excellent': 'Excellent',
      'good': 'Bien',
      'neutral': 'Neutre',
      'bad': 'Difficile',
      'terrible': 'Très difficile'
    };
    return labels[mood as keyof typeof labels] || mood;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier Émotionnel
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} aria-label="Mois précédent">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {monthName}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} aria-label="Mois suivant">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-xs font-medium text-center p-2 text-muted-foreground">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="p-2" />;
              }
              
              const dateKey = formatDateKey(day);
              const entry = entries[dateKey];
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={dateKey}
                  onClick={() => onDateSelect?.(dateKey)}
                  className={`
                    relative p-2 text-xs text-center rounded-md transition-all hover:bg-muted
                    ${isToday ? 'ring-2 ring-primary' : ''}
                    ${entry ? 'font-medium' : ''}
                  `}
                >
                  <span className={isToday ? 'text-primary' : ''}>{day.getDate()}</span>
                  {entry && (
                    <div className={`
                      absolute bottom-0.5 left-1/2 transform -translate-x-1/2
                      w-1.5 h-1.5 rounded-full ${getMoodColor(entry.mood)}
                    `} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Légende des humeurs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries({
                'excellent': 'Excellent',
                'good': 'Bien',
                'neutral': 'Neutre',
                'bad': 'Difficile',
                'terrible': 'Très difficile'
              }).map(([mood, label]) => (
                <div key={mood} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getMoodColor(mood)}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalCalendar;
