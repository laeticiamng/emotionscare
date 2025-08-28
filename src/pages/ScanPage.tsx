import React from 'react';
import { useScan } from '@/hooks/useScan';
import { PhotoUploader } from '@/components/scan/PhotoUploader';
import { LiveScanner } from '@/components/scan/LiveScanner';
import { ResultCard } from '@/components/scan/ResultCard';
import { AdviceChip } from '@/components/scan/AdviceChip';
import { PrivacyNote } from '@/components/scan/PrivacyNote';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ScanPage() {
  const { analyzePhoto, analyzeCamera, result, loading, mode, setMode } = useScan();

  const handleAdviceClick = (advice: string) => {
    // Deep-link to modules based on advice
    if (advice.includes('Flash Glow')) {
      window.location.href = '/flash-glow';
    } else if (advice.includes('Screen-Silk')) {
      window.location.href = '/screen-silk';
    } else if (advice.includes('Mood Mixer')) {
      window.location.href = '/mood-mixer';
    } else if (advice.includes('Musicothérapie')) {
      window.location.href = '/music';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Scan émotionnel
          </h1>
          <p className="text-muted-foreground">
            Découvrez votre état émotionnel en temps réel
          </p>
        </header>

        <header className="flex justify-center gap-2 mb-6">
          <Button
            variant={mode === 'photo' ? 'default' : 'outline'}
            onClick={() => setMode('photo')}
            aria-pressed={mode === 'photo'}
          >
            Photo
          </Button>
          <Button
            variant={mode === 'camera' ? 'default' : 'outline'}
            onClick={() => setMode('camera')}
            aria-pressed={mode === 'camera'}
          >
            Caméra
          </Button>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                {mode === 'photo' ? (
                  <PhotoUploader 
                    onAnalyze={(b64) => analyzePhoto(b64)}
                    loading={loading}
                  />
                ) : (
                  <LiveScanner 
                    onAnalyze={(b64) => analyzeCamera(b64)}
                    loading={loading}
                  />
                )}
              </CardContent>
            </Card>

            <PrivacyNote />
          </div>

          <div className="space-y-6">
            <ResultCard 
              loading={loading} 
              result={result} 
            />

            {result?.advice && (
              <AdviceChip 
                text={result.advice} 
                onClick={() => handleAdviceClick(result.advice)} 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}