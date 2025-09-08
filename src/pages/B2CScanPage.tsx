/**
 * PAGE SCAN B2C - SCANNER ÉMOTIONNEL PREMIUM
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, History, Settings, Download, Share2, TrendingUp, Heart, Sparkles } from 'lucide-react';
import EmotionScannerPremium from '@/components/scan/EmotionScannerPremium';
import { EmotionResult } from '@/types';
import { useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';
import EmotionsCareMusicPlayer from '@/components/music/emotionscare/EmotionsCareMusicPlayer';
import { useToast } from '@/hooks/use-toast';

const B2CScanPage: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const { state: musicState, generateEmotionPlaylist } = useEmotionsCareMusicContext();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Scanner Émotionnel
            </h1>
            <p className="text-muted-foreground mt-1">
              Analysez vos émotions en temps réel avec l'IA
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm" disabled={scanHistory.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats rapides */}
        {scanHistory.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Scans</span>
              </div>
              <p className="text-2xl font-bold mt-1">{scanHistory.length}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Confiance</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {Math.round(scanHistory.reduce((acc, r) => acc + (typeof r.confidence === 'number' ? r.confidence : 0.5), 0) / scanHistory.length * 100)}%
              </p>
            </Card>
          </div>
        )}

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EmotionScannerPremium
              onEmotionDetected={handleEmotionDetected}
              autoGenerateMusic={true}
              showRecommendations={true}
            />
          </div>

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanHistory.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {scanHistory.slice(0, 5).map((result) => (
                    <div key={result.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getEmotionEmoji(result.emotion)}</span>
                          <span className="font-medium capitalize">{result.emotion}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((typeof result.confidence === 'number' ? result.confidence : 0.5) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Aucune analyse effectuée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lecteur musique */}
        {showMusicPlayer && musicState.currentPlaylist && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Musique Thérapeutique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionsCareMusicPlayer compact={false} showPlaylist={true} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2CScanPage;