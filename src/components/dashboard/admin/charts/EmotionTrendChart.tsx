
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmotionTrendChartProps {
  data?: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ data = [] }) => {
  const defaultData = [
    { date: '1/5', positive: 65, neutral: 28, negative: 7 },
    { date: '2/5', positive: 59, neutral: 32, negative: 9 },
    { date: '3/5', positive: 70, neutral: 25, negative: 5 },
    { date: '4/5', positive: 63, neutral: 30, negative: 7 },
    { date: '5/5', positive: 68, neutral: 27, negative: 5 },
    { date: '6/5', positive: 62, neutral: 31, negative: 7 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Tendances Émotionnelles</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="positive" 
              name="Positif" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="neutral" 
              name="Neutre" 
              stroke="#6B7280" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="negative" 
              name="Négatif" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmotionTrendChart;
