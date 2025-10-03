
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface TeamEmotionDistributionProps {
  emotions: Array<{
    emotion: string;
    percentage: number;
    color: string;
  }>;
  period?: string;
  className?: string;
}

const TeamEmotionDistribution: React.FC<TeamEmotionDistributionProps> = ({ 
  emotions,
  period = '7 derniers jours',
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distribution émotionnelle</CardTitle>
        <CardDescription>Répartition des émotions sur les {period}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emotions}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                dataKey="percentage"
                label={({ emotion, percentage }) => `${emotion} ${percentage}%`}
              >
                {emotions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Pourcentage']}
                labelFormatter={(name) => `Émotion: ${name}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {emotions.map((item, index) => (
            <motion.div 
              key={item.emotion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm">{item.emotion}</span>
              <span className="text-sm font-medium ml-auto">{item.percentage}%</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamEmotionDistribution;
