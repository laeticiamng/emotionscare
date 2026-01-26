// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useReporting } from '@/contexts/ReportingContext';

interface ChartContainerProps {
  type: 'overview' | 'emotions' | 'progress';
  period: string;
  height?: number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  type, 
  period,
  height = 400
}) => {
  const { chartData, isLoading, loadData } = useReporting();
  const [animation, setAnimation] = useState(false);
  
  useEffect(() => {
    // Animate chart when period changes
    if (chartData) {
      setAnimation(true);
      loadData(period);
      
      const timer = setTimeout(() => {
        setAnimation(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      loadData(period);
    }
  }, [period, loadData]);

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />;
  }

  const renderChart = () => {
    switch (type) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={chartData.overview}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)'
                }} 
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name="Score émotionnel"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorScore)"
                isAnimationActive={animation}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'emotions':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData.emotions}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                isAnimationActive={animation}
              >
                {chartData.emotions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Proportion']}
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData.progress}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)'
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                isAnimationActive={animation}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Objectif"
                stroke="#82ca9d"
                strokeDasharray="5 5"
                isAnimationActive={animation}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderChart()}
    </motion.div>
  );
};

export default ChartContainer;
