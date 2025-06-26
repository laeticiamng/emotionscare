
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, Calendar, TrendingUp, Brain, Heart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import PostScanAnalysis from '@/components/scan/PostScanAnalysis';
import ScanPageHeader from '@/components/scan/ScanPageHeader';

const ScanPage: React.FC = () => {
  const { toast } = useToast();
  const [showScanForm, setShowScanForm] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<EmotionResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleScanComplete = (result: EmotionResult) => {
    setLastScanResult(result);
    setShowScanForm(false);
    setActiveTab('results');
    toast({
      title: 'Analyse terminée',
      description: 'Votre scan émotionnel a été enregistré avec succès.',
    });
  };

  const handleScheduleFollowUp = () => {
    toast({
      title: 'Suivi programmé',
      description: 'Un rappel a été ajouté à votre calendrier.',
    });
  };

  const handleShareWithCoach = () => {
    toast({
      title: 'Partagé avec le Coach IA',
      description: 'Vos résultats ont été transmis pour des conseils personnalisés.',
    });
  };

  // Mock data for scan history
  const scanHistory = [
    { date: '2024-01-15', emotion: 'calm', intensity: 75, time: '09:30' },
    { date: '2024-01-14', emotion: 'stress', intensity: 65, time: '14:20' },
    { date: '2024-01-13', emotion: 'joy', intensity: 85, time: '11:45' },
    { date: '2024-01-12', emotion: 'tired', intensity: 45, time: '16:10' },
  ];

  const weeklyStats = {
    totalScans: 12,
    averageMood: 72,
    improvementTrend: '+8%',
    dominantEmotion: 'calm'
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ScanPageHeader 
        showScanForm={showScanForm}
        activeTab={activeTab}
        setShowScanForm={setShowScanForm}
      />

      {showScanForm ? (
        <EmotionScanForm 
          onComplete={handleScanComplete}
          onClose={() => setShowScanForm(false)}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="results">Dernière analyse</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scans cette semaine</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.totalScans}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 depuis la semaine dernière
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humeur moyenne</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyStats.averageMood}%</div>
                  <p className="text-xs text-green-600">
                    {weeklyStats.improvementTrend} d'amélioration
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Émotion dominante</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{weeklyStats.dominantEmotion}</div>
                  <p className="text-xs text-muted-foreground">
                    Cette semaine
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Positive</div>
                  <p className="text-xs text-muted-foreground">
                    Amélioration continue
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Commencer une nouvelle analyse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Prêt à analyser votre état émotionnel actuel ? Notre scanner utilise l'IA pour 
                  comprendre vos émotions et vous fournir des conseils personnalisés.
                </p>
                <Button 
                  onClick={() => setShowScanForm(true)}
                  className="w-full md:w-auto"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Démarrer le scan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {lastScanResult ? (
              <PostScanAnalysis 
                scanResult={lastScanResult}
                onScheduleFollowUp={handleScheduleFollowUp}
                onShareWithCoach={handleShareWithCoach}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune analyse récente</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Effectuez votre premier scan pour voir les résultats détaillés ici.
                  </p>
                  <Button onClick={() => setShowScanForm(true)}>
                    Commencer maintenant
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Historique des analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="capitalize">
                          {scan.emotion}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {new Date(scan.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {scan.time}
                          </span>
                        </div>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${scan.intensity}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Intensité: {scan.intensity}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patterns Détectés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Pic de stress vers 14h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Meilleure humeur le matin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Amélioration en fin de semaine</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    • Planifiez des pauses relaxantes à 14h
                  </div>
                  <div className="text-sm">
                    • Maintenez votre routine matinale
                  </div>
                  <div className="text-sm">
                    • Utilisez la musique adaptative lors du stress
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ScanPage;
