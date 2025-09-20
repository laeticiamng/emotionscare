import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain, History, Download, Settings, TrendingUp,
  Activity, Heart, Sparkles, Music
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';
import EmotionScannerPremium from '@/components/emotion/EmotionScannerPremium';
import EmotionsCareMusicPlayer from '@/components/music/emotionscare/EmotionsCareMusicPlayer';
import SamInstantMood from '@/components/scan/SamInstantMood';
import { useMusic } from '@/contexts/MusicContext';
import type { EmotionResult } from '@/types/emotion';
import { ClinicalOptIn } from '@/components/consent/ClinicalOptIn';
import { useClinicalConsent } from '@/hooks/useClinicalConsent';

const B2CScanPage: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const { state: musicState, generateEmotionPlaylist } = useMusic();
  const { toast } = useToast();
  const samConsent = useClinicalConsent('SAM');

  const handleEmotionDetected = async (result: EmotionResult) => {
    setScanHistory(prev => [result, ...prev.slice(0, 9)]);
    
    try {
      await generateEmotionPlaylist({
        emotion: result.emotion,
        intensity: result.intensity
      });
      setShowMusicPlayer(true);
      
      toast({
        title: "Analyse terminée !",
        description: `Émotion "${result.emotion}" détectée. Musique thérapeutique générée.`,
      });
    } catch (error) {
      console.error('❌ Erreur génération musique:', error);
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: '😊', calm: '😌', focused: '🎯', energetic: '⚡', sad: '😔', anxious: '😰'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Enhanced Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Brain className="h-12 w-12 text-primary" />
                <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Scanner Émotionnel IA
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Analysez vos émotions en temps réel avec l'intelligence artificielle avancée
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={scanHistory.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <SamInstantMood />
          </div>
          {samConsent.shouldPrompt && (
            <ClinicalOptIn
              title="Activer l'évaluation SAM"
              description="Le suivi de votre intensité émotionnelle améliore les recommandations du scanner. Votre décision est mémorisée."
              acceptLabel="Oui, activer"
              declineLabel="Non merci"
              onAccept={samConsent.grantConsent}
              onDecline={samConsent.declineConsent}
              isProcessing={samConsent.isSaving}
              error={samConsent.error}
            />
          )}

          {/* Enhanced Stats */}
          {scanHistory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Analyses</span>
                  </div>
                  <p className="text-3xl font-bold text-primary">{scanHistory.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total effectuées</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-muted-foreground">Précision</span>
                  </div>
                  <p className="text-3xl font-bold text-green-500">
                    {Math.round(scanHistory.reduce((acc, r) => acc + (typeof r.confidence === 'number' ? r.confidence : 0.5), 0) / scanHistory.length * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Confiance moyenne</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Bien-être</span>
                  </div>
                  <p className="text-3xl font-bold text-red-500">8.4</p>
                  <p className="text-xs text-muted-foreground mt-1">Score moyen</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium text-muted-foreground">Musiques</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-500">{scanHistory.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Générées</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Layout with enhanced design */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Scanner */}
            <div className="lg:col-span-2">
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Analyse Émotionnelle</h2>
                      <p className="text-sm text-muted-foreground font-normal">
                        Utilisez votre caméra ou microphone pour une analyse précise
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmotionScannerPremium
                    onEmotionDetected={handleEmotionDetected}
                    autoGenerateMusic={true}
                    showRecommendations={true}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Enhanced History */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Historique des Analyses
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Vos {scanHistory.length} dernières analyses émotionnelles
                </p>
              </CardHeader>
              <CardContent>
                {scanHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {scanHistory.slice(0, 8).map((result, index) => (
                      <div key={result.id} className="p-4 rounded-xl border bg-gradient-to-r from-muted/50 to-transparent hover:from-primary/5 hover:to-primary/10 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getEmotionEmoji(result.emotion)}</span>
                            <div>
                              <span className="font-semibold capitalize text-lg">{result.emotion}</span>
                              <p className="text-xs text-muted-foreground">
                                Il y a {index === 0 ? 'quelques instants' : `${index * 2} minutes`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {Math.round((typeof result.confidence === 'number' ? result.confidence : 0.5) * 100)}%
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Intensité: {result.intensity || 'Moyenne'}
                            </p>
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="mt-2 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Réanalyser cette émotion
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium mb-2">Aucune analyse effectuée</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Commencez votre première analyse émotionnelle
                    </p>
                    <Button variant="outline" size="sm">
                      Démarrer l'analyse
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Music Player */}
          {showMusicPlayer && musicState.currentPlaylist && (
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  <div>
                    Musique Thérapeutique Générée
                    <p className="text-sm text-muted-foreground font-normal">
                      Playlist personnalisée basée sur votre émotion détectée
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionsCareMusicPlayer compact={false} showPlaylist={true} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CScanPage;