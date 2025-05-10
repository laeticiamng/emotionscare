
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lineChartData } from "@/data/line-chart-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define proper TypeScript props interface
interface TrendChartsProps {
  userId?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const TrendCharts = ({ userId, collapsed, onToggle }) => {
  // Sample chart data - normally would be fetched based on userId
  const data = lineChartData;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Tendances Émotionnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="énergie" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="calme" stroke="#82ca9d" />
              <Line type="monotone" dataKey="humeur" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCharts;
