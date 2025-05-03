
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendChartsProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const TrendCharts: React.FC<TrendChartsProps> = ({ absenteeismData, productivityData, isLoading = false }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="apple-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tendance Absentéisme</CardTitle>
          <CardDescription>7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
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
                  <AreaChart data={absenteeismData}>
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
          <CardTitle className="text-lg">Tendance Productivité</CardTitle>
          <CardDescription>7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
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
                  <BarChart data={productivityData}>
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
