
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Target, Download, Filter, Search } from 'lucide-react';
import { EmotionScanForm } from '@/components/scan';
import { UnifiedEmotionCheckin } from '@/components/scan';
import { EmotionTrendChart } from '@/components/scan/EmotionTrendChart';
import { EmotionResult } from '@/types/emotion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const ScanPage: React.FC = () => {
  const [showScanForm, setShowScanForm] = useState(false);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<EmotionResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emotionFilter, setEmotionFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [loading, setLoading] = useState(false);

  // Données de démonstration
  const mockScanHistory: EmotionResult[] = [
    {
      id: '1',
      userId: 'user1',
      timestamp: new Date('2024-01-15'),
      overallMood: 'positive',
      emotions: [{ emotion: 'happy', confidence: 0.85, intensity: 0.8 }],
      dominantEmotion: 'happy',
      confidence: 0.85,
      source: 'text',
      recommendations: ['Continuer cette énergie positive']
    },
    {
      id: '2',
      userId: 'user1',
      timestamp: new Date('2024-01-14'),
      overallMood: 'neutral',
      emotions: [{ emotion: 'calm', confidence: 0.75, intensity: 0.6 }],
      dominantEmotion: 'calm',
      confidence: 0.75,
      source: 'facial',
      recommendations: ['Moment de détente recommandé']
    },
    {
      id: '3',
      userId: 'user1',
      timestamp: new Date('2024-01-13'),
      overallMood: 'negative',
      emotions: [{ emotion: 'stressed', confidence: 0.70, intensity: 0.7 }],
      dominantEmotion: 'stressed',
      confidence: 0.70,
      source: 'voice',
      recommendations: ['Exercices de respiration', 'Pause recommandée']
    }
  ];

  const chartData = mockScanHistory.map(scan => ({
    date: scan.timestamp.toLocaleDateString(),
    score: scan.confidence * 100,
    emotion: scan.dominantEmotion
  }));

  const emotionDistribution = [
    { name: 'Heureux', value: 35, color: '#22c55e' },
    { name: 'Calme', value: 25, color: '#3b82f6' },
    { name: 'Stressé', value: 20, color: '#ef4444' },
    { name: 'Neutre', value: 20, color: '#94a3b8' }
  ];

  const weeklyProgress = [
    { day: 'Lun', scans: 3, mood: 7.5 },
    { day: 'Mar', scans: 2, mood: 6.8 },
    { day: 'Mer', scans: 4, mood: 8.2 },
    { day: 'Jeu', scans: 1, mood: 5.5 },
    { day: 'Ven', scans: 5, mood: 8.8 },
    { day: 'Sam', scans: 2, mood: 7.2 },
    { day: 'Dim', scans: 3, mood: 7.8 }
  ];

  useEffect(() => {
    setScanHistory(mockScanHistory);
    setFilteredHistory(mockScanHistory);
  }, []);

  useEffect(() => {
    let filtered = scanHistory;

    if (searchTerm) {
      filtered = filtered.filter(scan =>
        scan.dominantEmotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (emotionFilter !== 'all') {
      filtered = filtered.filter(scan => scan.dominantEmotion === emotionFilter);
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(scan =>
        scan.timestamp >= dateRange.from && scan.timestamp <= dateRange.to
      );
    }

    setFilteredHistory(filtered);
  }, [searchTerm, emotionFilter, dateRange, scanHistory]);

  const handleScanComplete = (result: EmotionResult) => {
    setScanHistory(prev => [result, ...prev]);
    setShowScanForm(false);
    toast.success('Scan émotionnel complété avec succès !');
  };

  const exportData = () => {
    setLoading(true);
    setTimeout(() => {
      const dataStr = JSON.stringify(filteredHistory, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'scan-history.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      setLoading(false);
      toast.success('Données exportées avec succès !');
    }, 1000);
  };

  const averageScore = filteredHistory.reduce((acc, scan) => acc + scan.confidence, 0) / filteredHistory.length || 0;
  const totalScans = filteredHistory.length;
  const positiveScans = filteredHistory.filter(scan => scan.overallMood === 'positive').length;
  const improvementRate = positiveScans / totalScans * 100 || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scan Émotionnel</h1>
          <p className="text-muted-foreground">Analysez et suivez votre état émotionnel</p>
        </div>
        <Button onClick={() => setShowScanForm(true)} className="bg-gradient-to-r from-blue-500 to-purple-600">
          Nouveau Scan
        </Button>
      </div>

      {/* Statistiques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Score Moyen</p>
                <p className="text-2xl font-bold">{(averageScore * 100).toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={averageScore * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Taux Positif</p>
                <p className="text-2xl font-bold">{improvementRate.toFixed(1)}%</p>
              </div>
            </div>
            <Progress value={improvementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-orange-500" />
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportData}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Export...' : 'Exporter'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan">Nouveau Scan</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          {showScanForm ? (
            <EmotionScanForm
              onComplete={handleScanComplete}
              onClose={() => setShowScanForm(false)}
            />
          ) : (
            <UnifiedEmotionCheckin />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtres et Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Émotion</label>
                  <Select value={emotionFilter} onValueChange={setEmotionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les émotions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="happy">Heureux</SelectItem>
                      <SelectItem value="calm">Calme</SelectItem>
                      <SelectItem value="stressed">Stressé</SelectItem>
                      <SelectItem value="sad">Triste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setEmotionFilter('all');
                    setDateRange(undefined);
                  }}>
                    <Filter className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Scans ({filteredHistory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {scan.timestamp.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {scan.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {scan.dominantEmotion}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Confiance: {(scan.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={scan.overallMood === 'positive' ? 'default' : 
                                   scan.overallMood === 'negative' ? 'destructive' : 'secondary'}>
                        {scan.overallMood}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: {scan.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendance Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des Émotions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Activité Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="scans" fill="#8884d8" name="Nombre de scans" />
                    <Bar yAxisId="right" dataKey="mood" fill="#82ca9d" name="Humeur moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights IA Personnalisés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900">Tendance Positive Détectée</h4>
                <p className="text-blue-800">
                  Votre humeur s'améliore de 15% cette semaine. Continuez vos pratiques actuelles !
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900">Recommandation Musicale</h4>
                <p className="text-green-800">
                  Basé sur vos scans, des playlists relaxantes pourraient vous aider les matins.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-900">Optimisation Suggérée</h4>
                <p className="text-orange-800">
                  Vos scans montrent plus de stress les jeudis. Programmez une pause détente ce jour-là.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900">Objectif Personnalisé</h4>
                <p className="text-purple-800">
                  Objectif: Atteindre 85% de scans positifs ce mois. Actuel: {improvementRate.toFixed(1)}%
                </p>
                <Progress value={improvementRate} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
