
import React, { useState } from 'react';
import ChartCard from './charts/ChartCard';
import AbsenteeismChart from './charts/AbsenteeismChart';
import ProductivityChart from './charts/ProductivityChart';
import { getFilteredData } from '@/utils/chartHelpers';

interface TrendChartsProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const TrendCharts: React.FC<TrendChartsProps> = ({ 
  absenteeismData, 
  productivityData, 
  isLoading = false 
}) => {
  const [timeRange, setTimeRange] = useState<string>("7j");
  
  const filteredAbsenteeismData = getFilteredData(absenteeismData, timeRange);
  const filteredProductivityData = getFilteredData(productivityData, timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard 
        title="Tendance Absentéisme" 
        description={timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        isLoading={isLoading}
      >
        <AbsenteeismChart data={filteredAbsenteeismData} />
      </ChartCard>

      <ChartCard 
        title="Tendance Productivité" 
        description={timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        isLoading={isLoading}
      >
        <ProductivityChart data={filteredProductivityData} />
      </ChartCard>
    </div>
  );
};

export default TrendCharts;
