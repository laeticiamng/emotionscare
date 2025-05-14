
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for team mood timeline
const mockMoodData = [
  { date: 'Lun', average: 65, highest: 90, lowest: 40 },
  { date: 'Mar', average: 70, highest: 95, lowest: 50 },
  { date: 'Mer', average: 60, highest: 85, lowest: 30 },
  { date: 'Jeu', average: 75, highest: 90, lowest: 55 },
  { date: 'Ven', average: 80, highest: 95, lowest: 60 },
  { date: 'Sam', average: 65, highest: 80, lowest: 50 },
  { date: 'Dim', average: 75, highest: 90, lowest: 55 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border border-border rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm text-green-600">{`Plus haut: ${payload[0].payload.highest}`}</p>
        <p className="text-sm text-blue-600">{`Moyenne: ${payload[0].payload.average}`}</p>
        <p className="text-sm text-amber-600">{`Plus bas: ${payload[0].payload.lowest}`}</p>
      </div>
    );
  }

  return null;
};

const TeamMoodTimeline: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockMoodData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorHighest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLowest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="highest" 
                stroke="#16A34A" 
                fillOpacity={1} 
                fill="url(#colorHighest)"
              />
              <Area 
                type="monotone" 
                dataKey="average" 
                stroke="#2563EB" 
                fillOpacity={1} 
                fill="url(#colorAverage)" 
              />
              <Area 
                type="monotone" 
                dataKey="lowest" 
                stroke="#D97706" 
                fillOpacity={1} 
                fill="url(#colorLowest)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className="text-sm text-muted-foreground">Score le plus élevé</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <span className="text-sm text-muted-foreground">Moyenne</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-600 mr-2" />
            <span className="text-sm text-muted-foreground">Score le plus bas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMoodTimeline;
