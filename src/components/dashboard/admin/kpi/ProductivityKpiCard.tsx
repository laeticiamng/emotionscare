// @ts-nocheck
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
import { DashboardWidgetConfig } from '@types/dashboard';

interface ProductivityKpiCardProps {
  widget: DashboardWidgetConfig;
}

const ProductivityKpiCard: React.FC<ProductivityKpiCardProps> = ({ widget }) => {
  const settings = widget.settings || {};
  const title = settings.title || "Productivité";
  const value = settings.value || "87%";
  const trend = settings.trend || "+3.2%";
  const isTrendPositive = !trend.startsWith('-');
  
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <LineChart className="h-5 w-5 mr-2 text-blue-500" />
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
        <div className="mt-4 grid grid-cols-7 gap-1">
          {[65, 72, 68, 74, 82, 79, 87].map((value, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="w-full bg-blue-200 rounded-sm" 
                style={{height: `${value * 0.8}%`}}
              ></div>
              <span className="text-xs text-muted-foreground mt-1">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default ProductivityKpiCard;
