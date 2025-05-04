
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TrendChartsProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const TrendCharts: React.FC<TrendChartsProps> = ({ absenteeismData, productivityData, isLoading = false }) => {
  const [timeRange, setTimeRange] = useState<string>("7j");
  
  // Dans un vrai scénario, vous feriez une requête avec le nouveau timeRange
  // Pour ce prototype, on simule simplement un changement de données
  const getFilteredData = (data: Array<{ date: string; value: number }>, range: string) => {
    if (range === "7j") return data;
    // Simulons plus de données pour les périodes plus longues
    if (range === "30j") {
      return [...data, ...data.map(item => ({
        date: item.date + "*",
        value: Math.min(100, item.value * (1 + Math.random() * 0.4))
      }))];
    }
    if (range === "90j") {
      return [...data, ...data.map(item => ({
        date: item.date + "**",
        value: Math.min(100, item.value * (1 + Math.random() * 0.8))
      }))];
    }
    return data;
  };

  const filteredAbsenteeismData = getFilteredData(absenteeismData, timeRange);
  const filteredProductivityData = getFilteredData(productivityData, timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="apple-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Tendance Absentéisme</CardTitle>
            <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)} aria-label="Période">
              <ToggleGroupItem value="7j" aria-label="7 jours">7j</ToggleGroupItem>
              <ToggleGroupItem value="30j" aria-label="30 jours">30j</ToggleGroupItem>
              <ToggleGroupItem value="90j" aria-label="90 jours">90j</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <CardDescription>{timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64" aria-label="Graphique d'absentéisme">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  value: { theme: { light: '#7ED321', dark: '#7ED321' } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredAbsenteeismData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="value"
                      stroke="#7ED321" 
                      fill="#7ED321" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="apple-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Tendance Productivité</CardTitle>
            <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)} aria-label="Période">
              <ToggleGroupItem value="7j" aria-label="7 jours">7j</ToggleGroupItem>
              <ToggleGroupItem value="30j" aria-label="30 jours">30j</ToggleGroupItem>
              <ToggleGroupItem value="90j" aria-label="90 jours">90j</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <CardDescription>{timeRange === "7j" ? "7 derniers jours" : timeRange === "30j" ? "30 derniers jours" : "90 derniers jours"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64" aria-label="Graphique de productivité">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  value: { theme: { light: '#4A90E2', dark: '#4A90E2' } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="value" 
                      name="value"
                      fill="#4A90E2" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendCharts;
