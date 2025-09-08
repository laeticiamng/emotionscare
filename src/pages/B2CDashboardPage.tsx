/**
 * DASHBOARD B2C PREMIUM - EMOTIONSCARE
 * Dashboard principal avec widgets interactifs pour le bien-être émotionnel
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Music, 
  Brain, 
  TrendingUp, 
  Calendar,
  Zap,
  Mic,
  Camera,
  BookOpen,
  Activity,
  Target,
  Bell,
  Settings,
  Plus,
  BarChart3,
  Sparkles,
  Timer,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';
import EmotionsCareMusicPlayer from '@/components/music/emotionscare/EmotionsCareMusicPlayer';
import { EmotionResult, MoodData } from '@/types';

// === DONNÉES MOCK ===
const mockEmotionData: EmotionResult[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    emotion: 'calm',
    confidence: 0.85,
    intensity: 0.6,
    source: 'facial_analysis',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    emotion: 'happy',
    confidence: 0.92,
    intensity: 0.8,
    source: 'voice_analysis',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    emotion: 'focused',
    confidence: 0.78,
    intensity: 0.7,
    source: 'text_analysis',
  }
];

const mockMoodData: MoodData[] = [
  { id: '1', userId: 'user1', date: new Date(), mood: 7.5, energy: 6.2, anxiety: 3.1 },
  { id: '2', userId: 'user1', date: new Date(Date.now() - 86400000), mood: 6.8, energy: 5.9, anxiety: 4.2 },
  { id: '3', userId: 'user1', date: new Date(Date.now() - 172800000), mood: 8.1, energy: 7.3, anxiety: 2.8 }
];

const wellbeingScore = 78;
const weeklyGoal = 85;

const B2CDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [recentMood, setRecentMood] = useState<MoodData | null>(null);
  const { state: musicState, generateEmotionPlaylist } = useEmotionsCareMusicContext();

  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentEmotion(mockEmotionData[0]);
      setRecentMood(mockMoodData[0]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleQuickScan = async (type: 'facial' | 'voice' | 'text') => {
    setIsLoading(true);
    
    try {
      // Simuler une analyse rapide
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEmotion: EmotionResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        emotion: ['calm', 'happy', 'focused', 'energetic'][Math.floor(Math.random() * 4)],
        confidence: 0.8 + Math.random() * 0.2,
        intensity: 0.5 + Math.random() * 0.5,
        source: `${type}_analysis` as any,
      };
      
      setCurrentEmotion(newEmotion);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!currentEmotion) return;
    
    await generateEmotionPlaylist({
      emotion: currentEmotion.emotion,
      intensity: currentEmotion.intensity
    });
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950',
      calm: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
      focused: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
      energetic: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
      sad: 'text-gray-500 bg-gray-50 dark:bg-gray-950',
      anxious: 'text-red-500 bg-red-50 dark:bg-red-950'
    };
    return colors[emotion] || 'text-gray-500 bg-gray-50 dark:bg-gray-950';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      calm: '😌',
      focused: '🎯',
      energetic: '⚡',
      sad: '😔',
      anxious: '😰'
    };
    return emojis[emotion] || '😐';
  };

  if (isLoading && !currentEmotion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Chargement de votre dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Bonjour ! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Voici votre tableau de bord bien-être du {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* === WIDGETS PRINCIPAUX === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Score de bien-être */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Score Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {wellbeingScore}%
              </div>
              <Progress value={wellbeingScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Objectif: {weeklyGoal}% cette semaine
              </p>
            </CardContent>
          </Card>

          {/* Émotion actuelle */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                État Actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentEmotion ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getEmotionEmoji(currentEmotion.emotion)}
                    </span>
                    <div>
                      <p className="font-semibold capitalize">
                        {currentEmotion.emotion}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((typeof currentEmotion.confidence === 'number' ? currentEmotion.confidence : 0.5) * 100)}% confiance
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Analysé il y a 1h
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Aucune analyse récente
                  </p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Analyser maintenant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Musique active */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-500" />
                Musique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {musicState.currentTrack ? (
                <div className="space-y-2">
                  <p className="font-medium truncate">
                    {musicState.currentTrack.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {musicState.currentTrack.artist}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {musicState.isPlaying ? 'En lecture' : 'En pause'}
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Aucune musique active
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleGenerateMusic}
                    disabled={!currentEmotion}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Générer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Cette Semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Sessions</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Temps total</span>
                <span className="font-semibold">2h 45m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Amélioration</span>
                <span className="font-semibold text-green-600">+15%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === ACTIONS RAPIDES === */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickScan('facial')}
                disabled={isLoading}
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Scan Facial</span>
                {isLoading && <LoadingSpinner size="sm" />}
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => handleQuickScan('voice')}
                disabled={isLoading}
              >
                <Mic className="w-6 h-6" />
                <span className="text-sm">Analyse Vocale</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Journal</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Activity className="w-6 h-6" />
                <span className="text-sm">Respiration</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* === LECTEUR MUSIQUE === */}
        {musicState.currentPlaylist && (
          <Card>
            <CardHeader>
              <CardTitle>Lecteur EmotionsCare</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionsCareMusicPlayer compact={false} showPlaylist={true} />
            </CardContent>
          </Card>
        )}

        {/* === GRAPHIQUES ET TENDANCES === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Tendances Émotionnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Joie', 'Calme', 'Focus', 'Énergie'].map((emotion, index) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-sm">{emotion}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={[75, 60, 85, 45][index]} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium w-8">
                        {[75, 60, 85, 45][index]}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectifs Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Méditation quotidienne</p>
                    <p className="text-sm text-muted-foreground">10 min/jour</p>
                  </div>
                  <Badge variant="outline">7/7</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sessions de musique</p>
                    <p className="text-sm text-muted-foreground">3/semaine</p>
                  </div>
                  <Badge variant="secondary">2/3</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Journal émotionnel</p>
                    <p className="text-sm text-muted-foreground">Quotidien</p>
                  </div>
                  <Badge variant="outline">En cours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;