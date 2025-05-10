
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { emotionalClimateData } from "@/data/line-chart-data";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from 'lucide-react';

// Define proper TypeScript props interface
interface TrendChartsProps {
  userId?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  absenteeismData?: Array<{ date: string; value: number }>;
  productivityData?: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

const TrendCharts: React.FC<TrendChartsProps> = ({ 
  userId,
  collapsed, 
  onToggle,
  absenteeismData,
  productivityData,
  isLoading = false 
}) => {
  // Sample chart data - normally would be fetched based on userId
  const emotionalData = emotionalClimateData;
  const [activeTab, setActiveTab] = useState('emotional');
  
  // Provide default data if none is provided
  const defaultAbsenteeismData = [
    { date: 'Jan', value: 3.2 },
    { date: 'Fév', value: 2.8 },
    { date: 'Mar', value: 3.1 },
    { date: 'Avr', value: 2.5 },
    { date: 'Mai', value: 2.2 },
    { date: 'Juin', value: 1.8 },
    { date: 'Juil', value: 1.5 }
  ];

  const defaultProductivityData = [
    { date: 'Jan', value: 78 },
    { date: 'Fév', value: 81 },
    { date: 'Mar', value: 80 },
    { date: 'Avr', value: 85 },
    { date: 'Mai', value: 87 },
    { date: 'Juin', value: 89 },
    { date: 'Juil', value: 92 }
  ];

  // Use provided data or fall back to default
  const absData = absenteeismData || defaultAbsenteeismData;
  const prodData = productivityData || defaultProductivityData;

  const getCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="h-2.5 w-2.5 rounded-full" 
                style={{ backgroundColor: entry.stroke }} 
              />
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Tendances</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>
              {activeTab === 'emotional' ? 'Données émotionnelles' 
                : activeTab === 'absenteeism' ? 'Taux d\'absentéisme %' 
                : 'Indice de productivité'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emotional" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-2 grid grid-cols-3">
            <TabsTrigger value="emotional">Émotions</TabsTrigger>
            <TabsTrigger value="absenteeism">Absentéisme</TabsTrigger>
            <TabsTrigger value="productivity">Productivité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emotional" className="p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={emotionalData}
                  margin={{
                    top: 15,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={getCustomTooltip} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="happy" 
                    name="Énergie" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    name="Calme" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sad" 
                    name="Humeur" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="absenteeism" className="p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={absData}
                  margin={{
                    top: 15,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={getCustomTooltip} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Taux d'absentéisme" 
                    stroke="#e06666" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="productivity" className="p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prodData}
                  margin={{
                    top: 15,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip content={getCustomTooltip} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Indice de productivité" 
                    stroke="#67c23a" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrendCharts;
