// @ts-nocheck

import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for journal trends
const journalMoodData = [
  { date: '2023-06-01', positive: 42, neutral: 32, negative: 12 },
  { date: '2023-06-08', positive: 48, neutral: 26, negative: 15 },
  { date: '2023-06-15', positive: 38, neutral: 35, negative: 18 },
  { date: '2023-06-22', positive: 52, neutral: 33, negative: 8 },
  { date: '2023-06-29', positive: 49, neutral: 28, negative: 11 },
  { date: '2023-07-06', positive: 55, neutral: 26, negative: 9 },
  { date: '2023-07-13', positive: 48, neutral: 31, negative: 14 }
];

const journalTopicsData = [
  { topic: 'Travail', count: 87 },
  { topic: 'Relations', count: 65 },
  { topic: 'Bien-être', count: 58 },
  { topic: 'Stress', count: 42 },
  { topic: 'Équilibre', count: 37 },
  { topic: 'Sommeil', count: 29 },
  { topic: 'Nutrition', count: 24 }
];

interface JournalTrendsTabProps {
  isLoading?: boolean;
}

const JournalTrendsTab: React.FC<JournalTrendsTabProps> = ({ isLoading = false }) => {
  const [timeRange, setTimeRange] = useState<'7j' | '30j' | '90j'>('30j');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Tendances Journal</h2>
        <Tabs 
          value={timeRange} 
          onValueChange={(value) => setTimeRange(value as '7j' | '30j' | '90j')}
          className="border rounded-full p-1"
        >
          <TabsList className="bg-transparent">
            <TabsTrigger 
              value="7j" 
              className="rounded-full text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              7 jours
            </TabsTrigger>
            <TabsTrigger 
              value="30j" 
              className="rounded-full text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              30 jours
            </TabsTrigger>
            <TabsTrigger 
              value="90j" 
              className="rounded-full text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              90 jours
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journal Mood Trends Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tendances émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={journalMoodData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} entrées`, '']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="#7ED321" fill="#7ED321" fillOpacity={0.8} name="Positif" />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#F5A623" fill="#F5A623" fillOpacity={0.6} name="Neutre" />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="#FF5A5F" fill="#FF5A5F" fillOpacity={0.6} name="Négatif" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Journal Topics Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sujets fréquents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={journalTopicsData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="topic" type="category" />
                  <Tooltip formatter={(value) => [`${value} mentions`, '']} />
                  <Bar dataKey="count" fill="#4A90E2" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analyse de sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Positivité globale</span>
                  <span className="text-sm font-medium">62%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Engagement</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Clarté d'expression</span>
                  <span className="text-sm font-medium">84%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Writing Patterns */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Patterns d'écriture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Longueur moyenne</p>
                <p className="text-2xl font-bold">186 mots</p>
                <p className="text-xs text-muted-foreground mt-1">+12% vs période précédente</p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Fréquence</p>
                <p className="text-2xl font-bold">3.2 / semaine</p>
                <p className="text-xs text-muted-foreground mt-1">-5% vs période précédente</p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Moment préféré</p>
                <p className="text-2xl font-bold">21:00</p>
                <p className="text-xs text-muted-foreground mt-1">Le plus souvent le soir</p>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Jour le plus actif</p>
                <p className="text-2xl font-bold">Dimanche</p>
                <p className="text-xs text-muted-foreground mt-1">28% des entrées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalTrendsTab;
