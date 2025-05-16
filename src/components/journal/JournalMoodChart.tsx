
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface MoodData {
  date: string;
  value: number;
  label?: string;
}

export interface MoodLineChartProps {
  data: MoodData[];
  showControls?: boolean;
}

export interface JournalMoodChartProps {
  data: MoodData[];
  showControls?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export const JournalMoodChart: React.FC<JournalMoodChartProps> = ({
  data,
  showControls = true,
  title = "Évolution émotionnelle",
  description = "Suivi de vos émotions au fil du temps",
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for MoodLineChart */}
        <div className="h-60 w-full bg-muted/20 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Graphique d'émotions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalMoodChart;
