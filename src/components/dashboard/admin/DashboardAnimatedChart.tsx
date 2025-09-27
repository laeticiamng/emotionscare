
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Sample data for the chart
const data = [
  { name: '01/05', satisfaction: 65, engagement: 58, stress: 40 },
  { name: '02/05', satisfaction: 68, engagement: 60, stress: 37 },
  { name: '03/05', satisfaction: 70, engagement: 65, stress: 35 },
  { name: '04/05', satisfaction: 72, engagement: 70, stress: 33 },
  { name: '05/05', satisfaction: 68, engagement: 68, stress: 38 },
  { name: '06/05', satisfaction: 65, engagement: 60, stress: 42 },
  { name: '07/05', satisfaction: 63, engagement: 55, stress: 45 },
  { name: '08/05', satisfaction: 60, engagement: 50, stress: 49 },
  { name: '09/05', satisfaction: 62, engagement: 53, stress: 47 },
  { name: '10/05', satisfaction: 65, engagement: 57, stress: 45 },
  { name: '11/05', satisfaction: 70, engagement: 62, stress: 40 },
  { name: '12/05', satisfaction: 75, engagement: 68, stress: 35 },
  { name: '13/05', satisfaction: 80, engagement: 75, stress: 30 },
  { name: '14/05', satisfaction: 85, engagement: 82, stress: 25 },
];

const monthlyData = [
  { name: 'Jan', satisfaction: 60, engagement: 55, stress: 45 },
  { name: 'Fév', satisfaction: 62, engagement: 58, stress: 43 },
  { name: 'Mar', satisfaction: 65, engagement: 60, stress: 40 },
  { name: 'Avr', satisfaction: 70, engagement: 65, stress: 35 },
  { name: 'Mai', satisfaction: 75, engagement: 70, stress: 30 },
];

const DashboardAnimatedChart: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'daily' | 'monthly'>('daily');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleDatasetChange = (dataset: 'daily' | 'monthly') => {
    if (dataset !== activeDataset && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveDataset(dataset);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  const currentData = activeDataset === 'daily' ? data : monthlyData;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={activeDataset === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDatasetChange('daily')}
            disabled={isAnimating}
          >
            Quotidien
          </Button>
          <Button
            variant={activeDataset === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDatasetChange('monthly')}
            disabled={isAnimating}
          >
            Mensuel
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Dernière mise à jour: aujourd'hui à 10:45
        </div>
      </div>
      
      <motion.div
        key={`chart-${activeDataset}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={currentData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis 
              dataKey="name" 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="satisfaction"
              name="Satisfaction"
              stroke="#10b981"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              dot={{ r: 3 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              name="Engagement"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="stress"
              name="Stress"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Satisfaction</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {currentData[currentData.length - 1].satisfaction}%
          </p>
        </div>
        
        <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Engagement</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {currentData[currentData.length - 1].engagement}%
          </p>
        </div>
        
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">Stress</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {currentData[currentData.length - 1].stress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnimatedChart;
