// @ts-nocheck
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DashboardWidgetConfig } from '@types/dashboard';

interface AbsenteeismKpiCardProps {
  widget: DashboardWidgetConfig;
}

const AbsenteeismKpiCard: React.FC<AbsenteeismKpiCardProps> = ({ widget }) => {
  const settings = widget.settings || {};
  const title = settings.title || "Taux d'absentéisme";
  const value = settings.value || "4.2%";
  const trend = settings.trend || "+0.5%";
  const isTrendPositive = !trend.startsWith('-');
  
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold">{value}</span>
          </div>
          <span className={`text-sm ${isTrendPositive ? 'text-red-500' : 'text-green-500'}`}>
            {trend} vs période précédente
          </span>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 rounded-full" 
            style={{width: '40%'}}
          ></div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Objectif: 3.5%
        </div>
      </CardContent>
    </>
  );
};

export default AbsenteeismKpiCard;
