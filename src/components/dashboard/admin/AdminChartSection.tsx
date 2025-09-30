// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, LineChart, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from '@/components/dashboard/charts/ChartCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminChartSectionProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const AdminChartSection: React.FC<AdminChartSectionProps> = ({
  absenteeismData,
  productivityData,
  isLoading = false
}) => {
  const renderChart = (data: Array<{ date: string; value: number }>, color: string) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={30} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  
  // Calculate trends (example calculation, modify as needed)
  const absenteeismTrend = absenteeismData.length > 1 ? 
    Math.round((absenteeismData[absenteeismData.length-1].value - absenteeismData[0].value) / absenteeismData[0].value * 100) : 0;
  
  const productivityTrend = productivityData.length > 1 ?
    Math.round((productivityData[productivityData.length-1].value - productivityData[0].value) / productivityData[0].value * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard
        title="Taux d'absentéisme"
        data={absenteeismData}
        icon={<Users className="w-5 h-5" />}
        isLoading={isLoading}
        valueFormat={(val) => `${val}%`}
        trend={absenteeismTrend}
        trendLabel="depuis le début de la période"
      >
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          renderChart(absenteeismData, '#ef4444')
        )}
      </ChartCard>
      
      <ChartCard
        title="Taux de productivité"
        data={productivityData}
        icon={<Activity className="w-5 h-5" />}
        isLoading={isLoading}
        valueFormat={(val) => `${val}%`}
        trend={productivityTrend}
        trendLabel="depuis le début de la période"
      >
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          renderChart(productivityData, '#3b82f6')
        )}
      </ChartCard>
    </div>
  );
};

export default AdminChartSection;
