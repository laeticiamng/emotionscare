
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar as CalendarIcon, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for VR sessions
const mockSessions = [
  { id: '1', date: '2025-05-15', duration: 15, environment: 'Forêt', emotionBefore: 'Anxieux', emotionAfter: 'Calme', anxietyReduction: 35 },
  { id: '2', date: '2025-05-12', duration: 20, environment: 'Plage', emotionBefore: 'Stressé', emotionAfter: 'Détendu', anxietyReduction: 42 },
  { id: '3', date: '2025-05-08', duration: 10, environment: 'Montagne', emotionBefore: 'Nerveux', emotionAfter: 'Serein', anxietyReduction: 28 },
  { id: '4', date: '2025-05-02', duration: 25, environment: 'Forêt', emotionBefore: 'Inquiet', emotionAfter: 'Apaisé', anxietyReduction: 45 },
  { id: '5', date: '2025-04-28', duration: 15, environment: 'Plage', emotionBefore: 'Tendu', emotionAfter: 'Relaxé', anxietyReduction: 32 },
];

// Chart data
const anxietyReductionData = mockSessions.map(session => ({
  date: new Date(session.date).toLocaleDateString('fr-FR'),
  reduction: session.anxietyReduction
})).reverse();

const durationData = mockSessions.map(session => ({
  date: new Date(session.date).toLocaleDateString('fr-FR'),
  minutes: session.duration
})).reverse();

const VRAnalyticsPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('overview');

  const sessionsByEnvironment = mockSessions.reduce((acc: Record<string, number>, session) => {
    acc[session.environment] = (acc[session.environment] || 0) + 1;
    return acc;
  }, {});

  const environmentData = Object.entries(sessionsByEnvironment).map(([name, count]) => ({
    name, count
  }));

  const handleViewSession = (sessionId: string) => {
    navigate(`/vr-session/${sessionId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistiques VR</h1>
        <Button variant="outline" onClick={() => navigate("/sessions")}>
          Programmer une session <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de sessions</CardTitle>
                <CardDescription>Sessions VR complétées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockSessions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Temps total</CardTitle>
                <CardDescription>Minutes passées en VR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockSessions.reduce((sum, session) => sum + session.duration, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Réduction d'anxiété moyenne</CardTitle>
                <CardDescription>Basée sur vos rapports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(mockSessions.reduce((sum, session) => sum + session.anxietyReduction, 0) / mockSessions.length)}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Réduction d'anxiété</CardTitle>
                <CardDescription>Évolution sur les dernières sessions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anxietyReductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reduction" name="Réduction d'anxiété" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Durée des sessions</CardTitle>
                <CardDescription>Minutes par session</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="minutes" name="Durée (minutes)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Environnements VR utilisés</CardTitle>
              <CardDescription>Répartition des environnements</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={environmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Nombre de sessions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des sessions</CardTitle>
              <CardDescription>Détails de vos sessions VR précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Durée</th>
                      <th className="text-left py-3 px-4">Environnement</th>
                      <th className="text-left py-3 px-4">État initial</th>
                      <th className="text-left py-3 px-4">État final</th>
                      <th className="text-left py-3 px-4">Amélioration</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{new Date(session.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-4">{session.duration} min</td>
                        <td className="py-3 px-4">{session.environment}</td>
                        <td className="py-3 px-4">{session.emotionBefore}</td>
                        <td className="py-3 px-4">{session.emotionAfter}</td>
                        <td className="py-3 px-4">{session.anxietyReduction}%</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewSession(session.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des sessions</CardTitle>
              <CardDescription>Vue calendrier de vos sessions VR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-2"
                    modifiers={{
                      booked: mockSessions.map(s => new Date(s.date))
                    }}
                    modifiersClassNames={{
                      booked: "bg-primary text-primary-foreground font-bold"
                    }}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <h3 className="text-lg font-medium">
                      {date ? date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sélectionnez une date'}
                    </h3>
                  </div>
                  
                  {date && mockSessions.find(session => new Date(session.date).toDateString() === date.toDateString()) ? (
                    <div className="border rounded-md p-4">
                      {mockSessions
                        .filter(session => new Date(session.date).toDateString() === date.toDateString())
                        .map(session => (
                          <div key={session.id} className="space-y-2">
                            <h4 className="font-medium">Session VR - {session.environment}</h4>
                            <div className="text-sm">Durée: {session.duration} minutes</div>
                            <div className="text-sm">Amélioration: {session.anxietyReduction}%</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleViewSession(session.id)}
                            >
                              Voir les détails
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      {date ? 'Aucune session VR à cette date.' : 'Veuillez sélectionner une date pour voir les détails de la session.'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VRAnalyticsPage;
