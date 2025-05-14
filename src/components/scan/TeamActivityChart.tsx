
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Dummy data for the chart
const mockActivityData = [
  { date: '01/05', activities: 12, scans: 8, journals: 4 },
  { date: '02/05', activities: 15, scans: 10, journals: 5 },
  { date: '03/05', activities: 10, scans: 7, journals: 3 },
  { date: '04/05', activities: 18, scans: 12, journals: 6 },
  { date: '05/05', activities: 20, scans: 14, journals: 6 },
  { date: '06/05', activities: 25, scans: 16, journals: 9 },
  { date: '07/05', activities: 22, scans: 15, journals: 7 }
];

const TeamActivityChart: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockActivityData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Line 
                type="monotone" 
                dataKey="activities" 
                stroke="var(--primary)" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                name="Activités"
              />
              <Line 
                type="monotone" 
                dataKey="scans" 
                stroke="var(--cyan-700)" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                name="Scans"
              />
              <Line 
                type="monotone" 
                dataKey="journals" 
                stroke="var(--amber-500)" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                name="Journaux"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2" />
            <span className="text-sm text-muted-foreground">Activités</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyan-700 mr-2" />
            <span className="text-sm text-muted-foreground">Scans</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
            <span className="text-sm text-muted-foreground">Journaux</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivityChart;
