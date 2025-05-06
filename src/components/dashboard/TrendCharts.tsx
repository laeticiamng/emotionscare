
import React, { useState } from 'react';
import ChartSwitcher from './charts/ChartSwitcher';
import { getFilteredData } from '@/utils/chartHelpers';
import { Card } from "@/components/ui/card";

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

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartSwitcher 
        title="Tendance Absentéisme"
        description={timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}
        availableViews={["area", "line"]}
        defaultView="area"
        data={filteredAbsenteeismData}
        isLoading={isLoading}
      />

      <ChartSwitcher 
        title="Tendance Productivité"
        description={timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}
        availableViews={["bar", "line"]}
        defaultView="bar"
        data={filteredProductivityData}
        isLoading={isLoading}
      />
      
      {/* Time range selector in a separate card */}
      <Card className="col-span-1 lg:col-span-2 p-4 flex flex-wrap gap-4 justify-center">
        <button
          className={`px-4 py-2 rounded-md ${timeRange === "7j" ? "bg-primary text-white" : "bg-gray-100"}`}
          onClick={() => handleTimeRangeChange("7j")}
        >
          7 jours
        </button>
        <button
          className={`px-4 py-2 rounded-md ${timeRange === "30j" ? "bg-primary text-white" : "bg-gray-100"}`}
          onClick={() => handleTimeRangeChange("30j")}
        >
          30 jours
        </button>
        <button
          className={`px-4 py-2 rounded-md ${timeRange === "90j" ? "bg-primary text-white" : "bg-gray-100"}`}
          onClick={() => handleTimeRangeChange("90j")}
        >
          90 jours
        </button>
      </Card>
    </div>
  );
};

export default TrendCharts;
