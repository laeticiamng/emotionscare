
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';
import { Heart, TrendingUp, Calendar, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const [showScanForm, setShowScanForm] = useState(false);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalScans: 0,
    weeklyTrend: 0
  });

  useEffect(() => {
    loadScanHistory();
  }, [user]);

  const loadScanHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: scans, error } = await supabase
        .from('emotion_results')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;

      const scanResults = scans || [];
      setScanHistory(scanResults);

      // Calculate stats
      if (scanResults.length > 0) {
        const avgScore = scanResults.reduce((sum, scan) => sum + scan.score, 0) / scanResults.length;
        
        // Calculate weekly trend (compare last 3 vs previous 3)
        const recent = scanResults.slice(0, 3);
        const previous = scanResults.slice(3, 6);
        const recentAvg = recent.length > 0 ? recent.reduce((sum, scan) => sum + scan.score, 0) / recent.length : 0;
        const previousAvg = previous.length > 0 ? previous.reduce((sum, scan) => sum + scan.score, 0) / previous.length : 0;
        const trend = recentAvg - previousAvg;

        setStats({
          averageScore: avgScore,
          totalScans: scanResults.length,
          weeklyTrend: trend
        });
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanComplete = async (result: EmotionResult) => {
    setScanHistory(prev => [result, ...prev]);
    setShowScanForm(false);
    loadScanHistory(); // Refresh to update stats
    toast.success('Analyse émotionnelle terminée !');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 bg-green-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.1) return '📈';
    if (trend < -0.1) return '📉';
    return '➡️';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement de vos données..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scanner d'émotions</h1>
          <p className="text-muted-foreground">
            Analysez vos émotions et suivez votre évolution dans le temps
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.averageScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Basé sur {stats.totalScans} analyses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <span>{getTrendIcon(stats.weeklyTrend)}</span>
                {stats.weeklyTrend > 0 ? '+' : ''}{Math.round(stats.weeklyTrend * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses totales</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">
                Depuis votre inscription
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scan Form or New Scan Button */}
          <div className="lg:col-span-2">
            {showScanForm ? (
              <EmotionScanForm 
                onComplete={handleScanComplete}
                onClose={() => setShowScanForm(false)}
              />
            ) : (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
                    Nouvelle analyse émotionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Prêt(e) à analyser vos émotions ? Choisissez votre méthode préférée :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>Texte :</strong> Décrivez comment vous vous sentez
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Audio :</strong> Enregistrez un message vocal
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <strong>Émojis :</strong> Sélectionnez des émojis représentatifs
                    </li>
                  </ul>
                  <Button 
                    onClick={() => setShowScanForm(true)}
                    className="w-full"
                    size="lg"
                  >
                    Commencer une nouvelle analyse
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Scan History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historique récent
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scanHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Aucune analyse pour le moment
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Commencez votre première analyse pour voir vos résultats ici
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scanHistory.map((scan) => (
                      <div key={scan.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(scan.score)}`}>
                            {Math.round(scan.score * 100)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(scan.date)}
                          </span>
                        </div>
                        {scan.text && (
                          <p className="text-sm text-muted-foreground truncate">
                            {scan.text}
                          </p>
                        )}
                        {scan.emojis && (
                          <p className="text-lg">
                            {scan.emojis}
                          </p>
                        )}
                        {scan.ai_feedback && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {scan.ai_feedback.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      Voir tout l'historique
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CScanPage;
