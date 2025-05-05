
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ChartTimeToggle } from '@/components/dashboard/charts/ChartTimeToggle';
import VRPageHeader from '@/components/vr/VRPageHeader';
import { LineChart, BarChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { getFilteredData } from '@/utils/chartHelpers';

const mockSessionTrends = [
  { date: '01/05', completions: 15, avgHeartRateDrop: 8 },
  { date: '02/05', completions: 22, avgHeartRateDrop: 10 },
  { date: '03/05', completions: 18, avgHeartRateDrop: 7 },
  { date: '04/05', completions: 25, avgHeartRateDrop: 12 },
  { date: '05/05', completions: 30, avgHeartRateDrop: 15 },
  { date: '06/05', completions: 28, avgHeartRateDrop: 11 },
  { date: '07/05', completions: 35, avgHeartRateDrop: 14 }
];

const mockTemplatePopularity = [
  { name: 'Forêt Zen', sessions: 45, avgImpact: 12 },
  { name: 'Océan Relaxant', sessions: 38, avgImpact: 10 },
  { name: 'Méditation Guidée', sessions: 32, avgImpact: 15 },
  { name: 'Montagne Paisible', sessions: 25, avgImpact: 9 },
  { name: 'Espace Cosmique', sessions: 20, avgImpact: 11 }
];

const mockTemplateEffectiveness = [
  { name: 'Méditation Guidée', effectiveness: 85 },
  { name: 'Forêt Zen', effectiveness: 78 },
  { name: 'Océan Relaxant', effectiveness: 72 },
  { name: 'Espace Cosmique', effectiveness: 68 },
  { name: 'Montagne Paisible', effectiveness: 65 }
];

const VRAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7j' | '30j' | '90j'>('7j');
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'export au format CSV.",
    });
  };

  const handleTimeRangeChange = (range: '7j' | '30j' | '90j') => {
    setTimeRange(range);
  };

  const filteredData = getFilteredData(mockSessionTrends.map(item => ({
    date: item.date,
    value: item.completions
  })), timeRange);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <VRPageHeader 
        title="Analytique VR" 
        description="Statistiques d'utilisation et impact des sessions VR"
        showBackLink={false}
      />

      <div className="flex justify-between items-center">
        <ChartTimeToggle 
          selectedRange={timeRange} 
          onRangeChange={handleTimeRangeChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisation Quotidienne</CardTitle>
            <CardDescription>Nombre de sessions VR complétées par jour</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSessionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completions" stroke="#8884d8" activeDot={{ r: 8 }} name="Sessions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact sur le Bien-être</CardTitle>
            <CardDescription>Baisse moyenne de la fréquence cardiaque après session</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSessionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgHeartRateDrop" stroke="#82ca9d" activeDot={{ r: 8 }} name="Baisse BPM" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyse des Expériences VR</CardTitle>
          <CardDescription>Popularité et efficacité des différentes expériences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="popularity">
            <TabsList className="mb-4">
              <TabsTrigger value="popularity">Popularité</TabsTrigger>
              <TabsTrigger value="effectiveness">Efficacité</TabsTrigger>
            </TabsList>
            <TabsContent value="popularity" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTemplatePopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sessions" fill="#8884d8" name="Nombre de sessions" />
                  <Bar dataKey="avgImpact" fill="#82ca9d" name="Impact moyen (BPM)" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="effectiveness" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTemplateEffectiveness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="effectiveness" fill="#82ca9d" name="Score d'efficacité (%)" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRAnalyticsPage;
