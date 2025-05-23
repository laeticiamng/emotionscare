
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmotionScanner from '@/components/scan/EmotionScanner';
import MusicPlayer from '@/components/music/MusicPlayer';
import { EmotionResult } from '@/types/emotion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, BarChart3 } from 'lucide-react';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [lastScanResult, setLastScanResult] = useState<EmotionResult | null>(null);

  const handleEmotionDetected = (result: EmotionResult) => {
    setLastScanResult(result);
    console.log('Emotion detected:', result);
  };

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    // Additional logic for scan completion
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Scanner Émotionnel</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scanner */}
        <div className="lg:col-span-2">
          <EmotionScanner
            onEmotionDetected={handleEmotionDetected}
            onScanComplete={handleScanComplete}
          />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Music Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Lecteur Musical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MusicPlayer />
            </CardContent>
          </Card>

          {/* Last Result */}
          {lastScanResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Dernière Analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Émotion :</span>
                    <span className="text-sm capitalize">{lastScanResult.emotion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Confiance :</span>
                    <span className="text-sm">{Math.round(lastScanResult.confidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Source :</span>
                    <span className="text-sm">{lastScanResult.source}</span>
                  </div>
                  {lastScanResult.sentiment && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Sentiment :</span>
                      <span className="text-sm">{lastScanResult.sentiment}</span>
                    </div>
                  )}
                  {lastScanResult.transcription && (
                    <div>
                      <span className="text-sm font-medium">Transcription :</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lastScanResult.transcription}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/journal')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Voir l'historique
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/coach')}
              >
                <Music className="h-4 w-4 mr-2" />
                Coach IA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
