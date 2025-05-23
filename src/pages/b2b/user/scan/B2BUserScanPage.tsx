
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';
import { Heart, TrendingUp, Users, BarChart2, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const B2BUserScanPage: React.FC = () => {
  const { user } = useAuth();
  const [showScanForm, setShowScanForm] = useState(false);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    personalScore: 0,
    teamAverage: 0,
    weeklyProgress: 0,
    totalScans: 0
  });

  useEffect(() => {
    loadScanData();
  }, [user]);

  const loadScanData = async () => {
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

      // Calculate personal stats
      if (scanResults.length > 0) {
        const avgScore = scanResults.reduce((sum, scan) => sum + scan.score, 0) / scanResults.length;
        
        // Calculate weekly progress
        const thisWeek = scanResults.filter(scan => {
          const scanDate = new Date(scan.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return scanDate >= weekAgo;
        });
        
        const lastWeek = scanResults.filter(scan => {
          const scanDate = new Date(scan.date);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return scanDate >= twoWeeksAgo && scanDate < weekAgo;
        });

        const thisWeekAvg = thisWeek.length > 0 ? thisWeek.reduce((sum, scan) => sum + scan.score, 0) / thisWeek.length : 0;
        const lastWeekAvg = lastWeek.length > 0 ? lastWeek.reduce((sum, scan) => sum + scan.score, 0) / lastWeek.length : 0;
        const progress = thisWeekAvg - lastWeekAvg;

        setStats({
          personalScore: avgScore,
          teamAverage: 0.72, // Mock team average
          weeklyProgress: progress,
          totalScans: scanResults.length
        });
      }
    } catch (error) {
      console.error('Error loading scan data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanComplete = async (result: EmotionResult) => {
    setScanHistory(prev => [result, ...prev]);
    setShowScanForm(false);
    loadScanData(); // Refresh to update stats
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

  const getProgressIcon = (progress: number) => {
    if (progress > 0.05) return '📈';
    if (progress < -0.05) return '📉';
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
          <h1 className="text-3xl font-bold mb-2">Scanner émotionnel professionnel</h1>
          <p className="text-muted-foreground">
            Analysez votre bien-être au travail et comparez avec votre équipe
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mon score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.personalScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Score personnel moyen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.teamAverage * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne de l'équipe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progression</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <span>{getProgressIcon(stats.weeklyProgress)}</span>
                {stats.weeklyProgress > 0 ? '+' : ''}{Math.round(stats.weeklyProgress * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">
                Total effectué
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Comparaison avec l'équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Votre score</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${stats.personalScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-12">
                    {Math.round(stats.personalScore * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moyenne équipe</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${stats.teamAverage * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-12">
                    {Math.round(stats.teamAverage * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {stats.personalScore > stats.teamAverage 
                  ? `🎉 Félicitations ! Votre bien-être est supérieur à la moyenne de l'équipe de ${Math.round((stats.personalScore - stats.teamAverage) * 100)}%.`
                  : stats.personalScore === stats.teamAverage
                  ? `👍 Votre bien-être est aligné avec la moyenne de l'équipe.`
                  : `💪 Votre score est légèrement en dessous de la moyenne. Considérez participer aux activités bien-être proposées.`
                }
              </p>
            </div>
          </CardContent>
        </Card>

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
                    Comment vous sentez-vous aujourd'hui au travail ? Effectuez une analyse pour:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>Suivre votre évolution</strong> personnelle
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Contribuer aux statistiques</strong> d'équipe
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <strong>Recevoir des conseils</strong> personnalisés
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
                  <BarChart2 className="h-5 w-5" />
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
                      Commencez votre première analyse professionnelle
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

export default B2BUserScanPage;
