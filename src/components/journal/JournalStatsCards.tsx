
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, BarChart, LineChart } from 'lucide-react';

const JournalStatsCards: React.FC = () => {
  return (
    <>
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="mr-4 p-2 rounded-full bg-primary/10">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Entrées ce mois-ci</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="mr-4 p-2 rounded-full bg-primary/10">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Humeur dominante</p>
            <p className="text-2xl font-bold">Calme</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="mr-4 p-2 rounded-full bg-primary/10">
            <LineChart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Progression</p>
            <p className="text-2xl font-bold">+8%</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default JournalStatsCards;
