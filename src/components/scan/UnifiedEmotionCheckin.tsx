
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Heart, BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Composant pour afficher l'historique des scans récents
const UnifiedEmotionCheckin: React.FC = () => {
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    averageScore: 0,
    totalScans: 0,
    dominantEmotion: '',
    improvement: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler le chargement des données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées pour la démonstration
        const mockScans = [
          {
            id: '1',
            date: new Date(Date.now() - 86400000), // 1 jour
            emotion: 'joy',
            intensity: 0.8,
            source: 'text'
          },
          {
            id: '2',
            date: new Date(Date.now() - 172800000), // 2 jours
            emotion: 'calm',
            intensity: 0.7,
            source: 'emoji'
          },
          {
            id: '3',
            date: new Date(Date.now() - 259200000), // 3 jours
            emotion: 'anxiety',
            intensity: 0.4,
            source: 'voice'
          },
          {
            id: '4',
            date: new Date(Date.now() - 345600000), // 4 jours
            emotion: 'joy',
            intensity: 0.9,
            source: 'facial'
          },
          {
            id: '5',
            date: new Date(Date.now() - 432000000), // 5 jours
            emotion: 'sadness',
            intensity: 0.3,
            source: 'text'
          }
        ];
        
        setRecentScans(mockScans);
        
        // Calculer les statistiques
        const avgScore = mockScans.reduce((sum, scan) => sum + scan.intensity, 0) / mockScans.length;
        const emotions = mockScans.map(scan => scan.emotion);
        const emotionCounts = emotions.reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
          emotionCounts[a] > emotionCounts[b] ? a : b
        );
        
        setWeeklyStats({
          averageScore: Math.round(avgScore * 100),
          totalScans: mockScans.length,
          dominantEmotion,
          improvement: 5 // +5% par rapport à la semaine précédente
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      calm: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      sadness: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      anger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      anxiety: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      fear: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };
  
  const getEmotionLabel = (emotion: string) => {
    const labels: Record<string, string> = {
      joy: 'Joie',
      calm: 'Calme',
      sadness: 'Tristesse',
      anger: 'Colère',
      anxiety: 'Anxiété',
      fear: 'Peur'
    };
    return labels[emotion] || emotion;
  };
  
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'text': return '📝';
      case 'emoji': return '😊';
      case 'voice': return '🎤';
      case 'facial': return '📷';
      default: return '📊';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Statistiques hebdomadaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5" />
            Votre bien-être cette semaine
          </CardTitle>
          <CardDescription>
            Résumé de vos 7 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{weeklyStats.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Score moyen</div>
              {weeklyStats.improvement > 0 && (
                <div className="flex items-center justify-center mt-1 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs">+{weeklyStats.improvement}%</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{weeklyStats.totalScans}</div>
              <div className="text-sm text-muted-foreground">Scans effectués</div>
            </div>
            <div className="text-center">
              <Badge className={getEmotionColor(weeklyStats.dominantEmotion)}>
                {getEmotionLabel(weeklyStats.dominantEmotion)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Émotion dominante</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Historique récent
          </CardTitle>
          <CardDescription>
            Vos derniers scans émotionnels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentScans.length > 0 ? (
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg">{getSourceIcon(scan.source)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getEmotionColor(scan.emotion)}>
                          {getEmotionLabel(scan.emotion)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {scan.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={scan.intensity * 100} className="w-20 h-1" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(scan.intensity * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Heart className={`h-4 w-4 ${scan.intensity > 0.7 ? 'text-red-500' : 'text-muted-foreground'}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun scan récent</p>
              <p className="text-sm text-muted-foreground">Commencez par effectuer votre premier scan émotionnel</p>
            </div>
          )}
        </CardContent>
        {recentScans.length > 0 && (
          <CardContent className="pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/journal')}
            >
              Voir l'historique complet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        )}
      </Card>
      
      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
          <CardDescription>
            Basées sur vos scans récents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyStats.averageScore < 60 ? (
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm font-medium">💙 Séance de relaxation</p>
                  <p className="text-xs text-muted-foreground">
                    Une session de méditation pourrait vous aider à retrouver votre équilibre
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-sm font-medium">🎵 Musicothérapie</p>
                  <p className="text-xs text-muted-foreground">
                    Écoutez de la musique adaptée à votre humeur pour améliorer votre bien-être
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <p className="text-sm font-medium">⭐ Excellent travail !</p>
                  <p className="text-xs text-muted-foreground">
                    Votre bien-être est en bonne voie. Continuez vos bonnes habitudes
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <p className="text-sm font-medium">📈 Défis bien-être</p>
                  <p className="text-xs text-muted-foreground">
                    Relevez de nouveaux défis pour maintenir votre progression
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
