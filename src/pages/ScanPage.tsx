
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Brain, TrendingUp, Calendar, Users, Award, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { EmotionResult } from '@/types';
import ScanTabContent from '@/components/scan/ScanTabContent';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import HistoryTabContent from '@/components/scan/HistoryTabContent';
import EmotionHistory from '@/components/scan/EmotionHistory';
import EmotionTrendChart from '@/components/scan/EmotionTrendChart';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const [activeTab, setActiveTab] = useState('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [scanStats, setScanStats] = useState({
    totalScans: 45,
    weeklyScans: 12,
    averageScore: 78,
    streakDays: 7,
    improvement: 15
  });

  // Données pour les graphiques
  const trendData = [
    { date: '01/01', score: 65, mood: 'Neutre' },
    { date: '02/01', score: 72, mood: 'Positif' },
    { date: '03/01', score: 68, mood: 'Calme' },
    { date: '04/01', score: 85, mood: 'Joyeux' },
    { date: '05/01', score: 78, mood: 'Serein' },
    { date: '06/01', score: 82, mood: 'Confiant' },
    { date: '07/01', score: 88, mood: 'Épanoui' },
  ];

  const weeklyData = [
    { day: 'Lun', scans: 3, avgScore: 75 },
    { day: 'Mar', scans: 2, avgScore: 82 },
    { day: 'Mer', scans: 4, avgScore: 78 },
    { day: 'Jeu', scans: 1, avgScore: 71 },
    { day: 'Ven', scans: 3, avgScore: 85 },
    { day: 'Sam', scans: 2, avgScore: 79 },
    { day: 'Dim', scans: 1, avgScore: 88 },
  ];

  const emotionDistribution = [
    { emotion: 'Joie', count: 15, percentage: 33 },
    { emotion: 'Calme', count: 12, percentage: 27 },
    { emotion: 'Confiance', count: 8, percentage: 18 },
    { emotion: 'Sérénité', count: 6, percentage: 13 },
    { emotion: 'Optimisme', count: 4, percentage: 9 },
  ];

  const handleScanComplete = (result: EmotionResult) => {
    setEmotionHistory(prev => [result, ...prev]);
    setShowScanForm(false);
    setScanStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      weeklyScans: prev.weeklyScans + 1
    }));
  };

  const getFormattedPath = (path: string) => {
    if (userMode === 'b2b_user') return `/b2b/user/${path}`;
    if (userMode === 'b2b_admin') return `/b2b/admin/${path}`;
    return `/b2c/${path}`;
  };

  useEffect(() => {
    // Simuler le chargement de l'historique
    const mockHistory: EmotionResult[] = [
      {
        id: '1',
        emotion: 'Joie',
        score: 85,
        confidence: 0.9,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        text: 'Excellente journée de travail, très productif',
        source: 'text'
      },
      {
        id: '2',
        emotion: 'Calme',
        score: 78,
        confidence: 0.8,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        text: 'Session de méditation très apaisante',
        source: 'voice'
      },
      {
        id: '3',
        emotion: 'Confiance',
        score: 82,
        confidence: 0.85,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        text: 'Présentation réussie devant l\'équipe',
        source: 'text'
      }
    ];
    setEmotionHistory(mockHistory);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ScanPageHeader 
        showScanForm={showScanForm}
        activeTab={activeTab}
        setShowScanForm={setShowScanForm}
      />

      {/* Statistiques en bref */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{scanStats.totalScans}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-2xl font-bold">{scanStats.weeklyScans}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">{scanStats.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série</p>
                <p className="text-2xl font-bold">{scanStats.streakDays} jours</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progression</p>
                <p className="text-2xl font-bold text-green-600">+{scanStats.improvement}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <ScanTabContent 
            showScanForm={showScanForm}
            setShowScanForm={setShowScanForm}
            onScanComplete={handleScanComplete}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <HistoryTabContent emotionHistory={emotionHistory} />
          <EmotionHistory history={emotionHistory} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendance Émotionnelle (7 jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des Émotions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emotionDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.emotion}</span>
                      <Badge variant="secondary">{item.count} fois</Badge>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#8884d8" name="Nombre de scans" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionTrendChart data={emotionHistory} height={400} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📈 Progression Positive</h4>
                    <p className="text-sm text-blue-700">
                      Votre bien-être émotionnel s'améliore de 15% ce mois-ci. Continuez vos bonnes habitudes !
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">🎯 Objectif Atteint</h4>
                    <p className="text-sm text-green-700">
                      Félicitations ! Vous avez maintenu une série de 7 jours de scans quotidiens.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">💡 Recommandation</h4>
                    <p className="text-sm text-purple-700">
                      Vos pics de joie sont souvent le matin. Planifiez vos tâches importantes à ce moment !
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(getFormattedPath('music'))}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Session Musicothérapie
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(getFormattedPath('coach'))}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Consulter le Coach IA
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(getFormattedPath('journal'))}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Écrire dans le Journal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
