
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChartTimeToggle from './ChartTimeToggle';

interface ChartCardProps {
  title: string;
  description: string;
  timeRange: string;
  setTimeRange: (value: string) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  timeRange,
  setTimeRange,
  isLoading = false,
  children
}) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <ChartTimeToggle timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>
        <CardDescription>
          {timeRange === "7j" ? "7 derniers jours" : 
           timeRange === "30j" ? "30 derniers jours" : 
           "90 derniers jours"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64" aria-label={`Graphique de ${title.toLowerCase()}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
