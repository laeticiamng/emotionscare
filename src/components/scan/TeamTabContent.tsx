
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Period } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import { addDays, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import TeamOverview from './TeamOverview';

// Données fictives pour démonstration
const mockUsers = [
  {
    id: 'user-1',
    name: 'Jean Dupont',
    teamId: 'team-1',
    emotionalScore: 0.82,
    lastActive: new Date().toISOString()
  },
  {
    id: 'user-2',
    name: 'Marie Martin',
    teamId: 'team-1',
    emotionalScore: 0.65,
    lastActive: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'user-3',
    name: 'Paul Bernard',
    teamId: 'team-1',
    emotionalScore: 0.91,
    lastActive: subDays(new Date(), 3).toISOString()
  }
];

interface TeamTabContentProps {
  teamId: string;
  value: string;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ teamId, value }) => {
  const [period, setPeriod] = useState<Period>('week');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    startOfWeek(new Date()),
    endOfWeek(new Date())
  ]);
  
  // Gestion du changement de période
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    
    const now = new Date();
    let start: Date;
    let end: Date;
    
    switch (newPeriod) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        start = startOfWeek(now);
        end = endOfWeek(now);
    }
    
    setDateRange([start, end]);
  };
  
  // Navigation dans les périodes
  const navigatePeriod = (direction: 'next' | 'prev') => {
    const [start, end] = dateRange;
    
    let newStart: Date;
    let newEnd: Date;
    
    if (direction === 'prev') {
      switch (period) {
        case 'day':
          newStart = subDays(start, 1);
          newEnd = subDays(end, 1);
          break;
        case 'week':
          newStart = subWeeks(start, 1);
          newEnd = subWeeks(end, 1);
          break;
        case 'month':
          newStart = subMonths(start, 1);
          newEnd = subMonths(end, 1);
          break;
        default:
          newStart = subWeeks(start, 1);
          newEnd = subWeeks(end, 1);
      }
    } else {
      switch (period) {
        case 'day':
          newStart = addDays(start, 1);
          newEnd = addDays(end, 1);
          break;
        case 'week':
          newStart = addDays(start, 7);
          newEnd = addDays(end, 7);
          break;
        case 'month':
          newStart = addDays(start, 30);
          newEnd = addDays(end, 30);
          break;
        default:
          newStart = addDays(start, 7);
          newEnd = addDays(end, 7);
      }
    }
    
    setDateRange([newStart, newEnd]);
  };
  
  return (
    <TabsContent value={value} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vue d'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sélection de période */}
            <div>
              <RadioGroup
                value={period}
                onValueChange={(value) => handlePeriodChange(value as Period)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="day" />
                  <Label htmlFor="day">Jour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="week" id="week" />
                  <Label htmlFor="week">Semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="month" />
                  <Label htmlFor="month">Mois</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigatePeriod('prev')}>
                Précédent
              </Button>
              <span>
                {dateRange[0].toLocaleDateString()} - {dateRange[1].toLocaleDateString()}
              </span>
              <Button variant="outline" onClick={() => navigatePeriod('next')}>
                Suivant
              </Button>
            </div>
            
            {/* Vue d'équipe */}
            <TeamOverview
              teamId={teamId}
              dateRange={dateRange}
              users={mockUsers}
              anonymized={false}
              showNames={true}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TeamTabContent;
