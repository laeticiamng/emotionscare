
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const teamMoodData = [
  { name: 'Positif', value: 45, color: '#10b981' },
  { name: 'Neutre', value: 35, color: '#f59e0b' },
  { name: 'Fatigué', value: 20, color: '#ef4444' },
];

export const TeamMoodWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ambiance Équipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamMoodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  dataKey="value"
                >
                  {teamMoodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {teamMoodData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.value}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Amélioration de 8% cette semaine</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Eye className="h-3 w-3" />
            <span>Données anonymisées - Conforme RGPD</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
