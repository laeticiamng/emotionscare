
import React, { useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartInteractiveLegend } from '@/components/ui/chart';
import { useMediaQuery } from '@/hooks/use-media-query';

interface AdminChartSectionProps {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
}

const AdminChartSection: React.FC<AdminChartSectionProps> = ({ absenteeismData, productivityData }) => {
  const [hiddenAbsenteeismSeries, setHiddenAbsenteeismSeries] = useState<string[]>([]);
  const [hiddenProductivitySeries, setHiddenProductivitySeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggleAbsenteeismSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenAbsenteeismSeries(hiddenAbsenteeismSeries.filter(key => key !== dataKey));
    } else {
      setHiddenAbsenteeismSeries([...hiddenAbsenteeismSeries, dataKey]);
    }
  };

  const handleToggleProductivitySeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenProductivitySeries(hiddenProductivitySeries.filter(key => key !== dataKey));
    } else {
      setHiddenProductivitySeries([...hiddenProductivitySeries, dataKey]);
    }
  };

  return (
    <>
      {/* Absenteeism Trends */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Tendance Absentéisme
          </CardTitle>
          <CardDescription>Taux d'absentéisme global anonymisé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={absenteeismData} 
                margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <ChartInteractiveLegend
                  onToggleSeries={handleToggleAbsenteeismSeries}
                  hiddenSeries={hiddenAbsenteeismSeries}
                  verticalAlign={isMobile ? "bottom" : "top"}
                  align="right"
                  layout={isMobile ? "vertical" : "horizontal"}
                />
                {!hiddenAbsenteeismSeries.includes('value') && (
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    name="Taux d'absentéisme (%)"
                    activeDot={{ r: 8 }} 
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Productivity Metrics */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Indicateurs de Productivité
          </CardTitle>
          <CardDescription>Tendance de productivité agrégée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={productivityData} 
                margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <ChartInteractiveLegend
                  onToggleSeries={handleToggleProductivitySeries}
                  hiddenSeries={hiddenProductivitySeries}
                  verticalAlign={isMobile ? "bottom" : "top"}
                  align="right"
                  layout={isMobile ? "vertical" : "horizontal"}
                />
                {!hiddenProductivitySeries.includes('value') && (
                  <Bar 
                    dataKey="value" 
                    fill="#82ca9d" 
                    name="Indice de productivité" 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminChartSection;
