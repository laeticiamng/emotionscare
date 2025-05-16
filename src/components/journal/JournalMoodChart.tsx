
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoodLineChart, MoodData } from '@/components/charts/MoodLineChart';

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
        <MoodLineChart 
          data={data} 
          showControls={showControls}
        />
      </CardContent>
    </Card>
  );
};

export default JournalMoodChart;
