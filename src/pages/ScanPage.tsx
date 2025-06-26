
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmotionScanLive } from '@/components/scan/EmotionScanLive';
import { EmotionHistory } from '@/components/scan/EmotionHistory';
import { MusicRecommendation } from '@/components/scan/MusicRecommendation';
import { 
  Brain, 
  History, 
  TrendingUp, 
  Download, 
  Share2, 
  Calendar,
  BarChart3,
  Target,
  Zap,
  Clock,
  Camera,
  Mic,
  FileText,
  Heart,
  Activity,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ScanPage: React.FC = () => {
  const { toast } = useToast();
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  
  // Mock data pour l'historique et les analytics
  const [emotionTrends] = useState([
    { date: '2024-01-01', calm: 75, happy: 60, anxious: 20, energetic: 80 },
    { date: '2024-01-02', calm: 80, happy: 70, anxious: 15, energetic: 75 },
    { date: '2024-01-03', calm: 65, happy: 50, anxious: 35, energetic: 60 },
    { date: '2024-01-04', calm: 85, happy: 85, anxious: 10, energetic: 90 },
    { date: '2024-01-05', calm: 70, happy: 65, anxious: 25, energetic: 70 },
    { date: '2024-01-06', calm: 90, happy: 80, anxious: 5, energetic: 85 },
    { date: '2024-01-07', calm: 85, happy: 90, anxious: 10, energetic: 95 }
  ]);

  const [emotionDistribution] = useState([
    { name: 'Calme', value: 35, color: '#3b82f6' },
    { name: 'Heureux', value: 28, color: '#10b981' },
    { name: 'Énergique', value: 22, color: '#f59e0b' },
    { name: 'Anxieux', value: 10, color: '#ef4444' },
    { name: 'Neutre', value: 5, color: '#6b7280' }
  ]);

  const [scanStats] = useState({
    totalScans: 142,
    averageScore: 78,
    improvement: 15,
    streak: 12,
    lastScan: '2024-01-15 14:30',
    dominantEmotion: 'calme',
    weeklyGoal: 7,
    weeklyCompleted: 5
  });

  const [recentScans] = useState([
    {
      id: '1',
      timestamp: '2024-01-15 14:30',
      emotion: 'calm',
      confidence: 0.85,
      score: 85,
      type: 'voice',
      notes: 'Session après méditation matinale',
      triggers: ['meditation', 'morning routine']
    },
    {
      id: '2',
      timestamp: '2024-01-15 09:15',
      emotion: 'energetic',
      confidence: 0.92,
      score: 92,
      type: 'facial',
      notes: 'Après exercice physique',
      triggers: ['exercise', 'endorphins']
    },
    {
      id: '3',
      timestamp: '2024-01-14 18:45',
      emotion: 'anxious',
      confidence: 0.78,
      score: 35,
      type: 'text',
      notes: 'Stress de fin de journée',
      triggers: ['work stress', 'deadline']
    }
  ]);

  const handleStartScan = (type: 'facial' | 'voice' | 'text') => {
    setIsScanning(true);
    toast({
      title: "Scan démarré",
      description: `Analyse ${type === 'facial' ? 'faciale' : type === 'voice' ? 'vocale' : 'textuelle'} en cours...`,
    });

    // Simulation du scan
    setTimeout(() => {
      setIsScanning(false);
      const mockResult = {
        emotion: 'calm',
        confidence: 0.87,
        score: 87,
        type,
        timestamp: new Date().toISOString(),
        recommendations: [
          'Continuez sur cette lancée avec une session de méditation',
          'Votre niveau de calme est excellent pour la productivité',
          'Partagez cette énergie positive avec votre entourage'
        ]
      };
      setCurrentScan(mockResult);
      toast({
        title: "Scan terminé",
        description: `Émotion détectée: ${mockResult.emotion} (${Math.round(mockResult.confidence * 100)}% de confiance)`,
      });
    }, 3000);
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Vos données d'analyse seront bientôt disponibles en téléchargement",
    });
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText('https://emotionscare.app/scan/results/abc123');
    toast({
      title: "Lien copié",
      description: "Le lien de vos résultats a été copié dans le presse-papiers",
    });
  };

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      calm: Heart,
      happy: CheckCircle2,
      anxious: AlertCircle,
      energetic: Zap,
      neutral: Activity
    };
    return icons[emotion as keyof typeof icons] || Activity;
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      calm: 'text-blue-500',
      happy: 'text-green-500',
      anxious: 'text-red-500',
      energetic: 'text-orange-500',
      neutral: 'text-gray-500'
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header avec statistiques */}
        <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Scan Émotionnel</h1>
                  <p className="text-blue-100 mt-1">
                    Analysez et comprenez vos émotions en temps réel
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{scanStats.totalScans}</p>
                <p className="text-blue-100">scans effectués</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{scanStats.averageScore}</p>
                <p className="text-sm text-blue-100">Score moyen</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">+{scanStats.improvement}%</p>
                <p className="text-sm text-blue-100">Amélioration</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{scanStats.streak}</p>
                <p className="text-sm text-blue-100">Jours consécutifs</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold capitalize">{scanStats.dominantEmotion}</p>
                <p className="text-sm text-blue-100">Émotion dominante</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectif hebdomadaire */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Objectif Hebdomadaire
              </CardTitle>
              <Badge variant="secondary">
                {scanStats.weeklyCompleted}/{scanStats.weeklyGoal} scans
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression cette semaine</span>
                <span>{Math.round((scanStats.weeklyCompleted / scanStats.weeklyGoal) * 100)}%</span>
              </div>
              <Progress value={(scanStats.weeklyCompleted / scanStats.weeklyGoal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Plus que {scanStats.weeklyGoal - scanStats.weeklyCompleted} scans pour atteindre votre objectif !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Onglet Scan */}
          <TabsContent value="scan" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Interface de scan */}
              <Card>
                <CardHeader>
                  <CardTitle>Nouveau Scan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleStartScan('facial')}
                      disabled={isScanning}
                    >
                      <Camera className="h-6 w-6" />
                      <span className="text-sm">Facial</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleStartScan('voice')}
                      disabled={isScanning}
                    >
                      <Mic className="h-6 w-6" />
                      <span className="text-sm">Vocal</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleStartScan('text')}
                      disabled={isScanning}
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Textuel</span>
                    </Button>
                  </div>

                  {isScanning && (
                    <div className="text-center py-6">
                      <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                    </div>
                  )}

                  {currentScan && !isScanning && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {React.createElement(getEmotionIcon(currentScan.emotion), {
                            className: `h-5 w-5 ${getEmotionColor(currentScan.emotion)}`
                          })}
                          <span className="font-medium capitalize">{currentScan.emotion}</span>
                        </div>
                        <Badge variant="secondary">
                          {Math.round(currentScan.confidence * 100)}% confiance
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Score émotionnel</span>
                          <span className="font-medium">{currentScan.score}/100</span>
                        </div>
                        <Progress value={currentScan.score} className="h-2" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={handleShareResults}>
                          <Share2 className="h-3 w-3 mr-1" />
                          Partager
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportData}>
                          <Download className="h-3 w-3 mr-1" />
                          Exporter
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommandations musicales */}
              {currentScan && (
                <MusicRecommendation emotion={currentScan.emotion} />
              )}
            </div>
          </TabsContent>

          {/* Onglet Historique */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historique des Scans</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        {React.createElement(getEmotionIcon(scan.emotion), {
                          className: `h-6 w-6 ${getEmotionColor(scan.emotion)}`
                        })}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium capitalize">{scan.emotion}</span>
                            <Badge variant="outline" className="text-xs">
                              {scan.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{scan.notes}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{scan.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{scan.score}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(scan.confidence * 100)}% confiance
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Graphique des tendances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Tendances Émotionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emotionTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="calm" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="happy" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="energetic" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="anxious" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution des émotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribution des Émotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={emotionDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
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
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métriques Détaillées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{scanStats.totalScans}</p>
                    <p className="text-sm text-muted-foreground">Total scans</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{scanStats.averageScore}</p>
                    <p className="text-sm text-muted-foreground">Score moyen</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">+{scanStats.improvement}%</p>
                    <p className="text-sm text-muted-foreground">Amélioration</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{scanStats.streak}</p>
                    <p className="text-sm text-muted-foreground">Série actuelle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentScan?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                  {!currentScan && (
                    <p className="text-muted-foreground text-center py-8">
                      Effectuez un scan pour recevoir des recommandations personnalisées
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patterns Détectés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Meilleur moment de la journée</h4>
                    <p className="text-sm text-muted-foreground">
                      Vos scores sont généralement plus élevés le matin entre 9h et 11h
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Facteurs d'amélioration</h4>
                    <p className="text-sm text-muted-foreground">
                      La méditation et l'exercice physique ont un impact positif mesurable
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Déclencheurs de stress</h4>
                    <p className="text-sm text-muted-foreground">
                      Les deadlines et les réunions longues tendent à augmenter l'anxiété
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
