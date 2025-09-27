
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { DashboardWidgetConfig } from '@types/dashboard';

interface EmotionalHealthKpiCardProps {
  widget: DashboardWidgetConfig;
}

const EmotionalHealthKpiCard: React.FC<EmotionalHealthKpiCardProps> = ({ widget }) => {
  const settings = widget.settings || {};
  const title = settings.title || "Santé émotionnelle";
  const value = settings.value || "82";
  const trend = settings.trend || "+5%";
  const isTrendPositive = !trend.startsWith('-');
  
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground ml-1">/100</span>
          </div>
          <span className={`text-sm ${isTrendPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend} vs période précédente
          </span>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{width: '82%'}}
          ></div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Team average: 76/100
        </div>
      </CardContent>
    </>
  );
};

export default EmotionalHealthKpiCard;
