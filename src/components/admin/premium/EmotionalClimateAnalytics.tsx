
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emotionalClimateData, weeklyActivityData, engagementData } from '@/data/line-chart-data';

interface EmotionalClimateAnalyticsProps {
  className?: string;
}

const EmotionalClimateAnalytics: React.FC<EmotionalClimateAnalyticsProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analyse du Climat Émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emotions">
          <TabsList className="mb-4">
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emotions" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionalClimateData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="happy" name="Heureux" fill="#10b981" />
                <Bar dataKey="sad" name="Triste" fill="#f43f5e" />
                <Bar dataKey="neutral" name="Neutre" fill="#64748b" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="activity" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="journalEntries" name="Journaux" fill="#8b5cf6" />
                <Bar dataKey="emotionScans" name="Scans Émotion" fill="#06b6d4" />
                <Bar dataKey="musicSessions" name="Sessions Musique" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="engagement" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeUsers" name="Utilisateurs Actifs" fill="#10b981" />
                <Bar dataKey="newUsers" name="Nouveaux Utilisateurs" fill="#6366f1" />
                <Bar dataKey="churnedUsers" name="Utilisateurs Perdus" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionalClimateAnalytics;
