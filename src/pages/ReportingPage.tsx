import React from 'react';
import Shell from '@/Shell';
import EmotionPieChart from '@/components/dashboard/charts/EmotionPieChart';
import WeeklyActivityChart from '@/components/dashboard/charts/WeeklyActivityChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { weeklyActivityData } from '@/data/line-chart-data';
import mockEmotions from '@/data/mockEmotions';

const emotionColors: Record<string, string> = {
  happy: '#FBBF24',
  calm: '#34D399',
  focused: '#60A5FA',
  anxious: '#F87171',
  sad: '#A78BFA'
};

const ReportingPage: React.FC = () => {
  const counts = mockEmotions.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.emotion] = (acc[cur.emotion] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    color: emotionColors[name] || '#8884d8'
  }));

  return (
    <Shell>
      <div className="container py-6 max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Mon reporting</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des émotions</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <EmotionPieChart data={pieData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activité hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <WeeklyActivityChart data={weeklyActivityData.map(d => ({
                day: d.day,
                journal: d.journalEntries,
                scan: d.emotionScans,
                music: d.musicSessions
              }))} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default ReportingPage;
