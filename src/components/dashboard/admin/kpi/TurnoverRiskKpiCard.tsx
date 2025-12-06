// @ts-nocheck
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMinus } from 'lucide-react';
import { DashboardWidgetConfig } from '@types/dashboard';

interface TurnoverRiskKpiCardProps {
  widget: DashboardWidgetConfig;
}

const TurnoverRiskKpiCard: React.FC<TurnoverRiskKpiCardProps> = ({ widget }) => {
  const settings = widget.settings || {};
  const title = settings.title || "Risque de turnover";
  const value = settings.value || "8.5%";
  const trend = settings.trend || "-1.5%";
  const isTrendPositive = trend.startsWith('-');
  
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <UserMinus className="h-5 w-5 mr-2 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold">{value}</span>
          </div>
          <span className={`text-sm ${isTrendPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend} vs période précédente
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['Ingénieurs', 'Marketing', 'Support'].map((dept, i) => (
            <div key={i} className="bg-muted/20 p-2 rounded-md">
              <div className="text-sm font-medium">{dept}</div>
              <div className={`text-sm ${[15, 6, 4][i] > 10 ? 'text-red-500' : 'text-amber-500'}`}>
                {[15, 6, 4][i]}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default TurnoverRiskKpiCard;
