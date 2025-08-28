import React from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Camera } from 'lucide-react';
import FaceFilterAR from '@/components/ar/FaceFilterAR';
import EmotionBubble from '@/components/ar/EmotionBubble';
import NoCamFallback from '@/components/ar/NoCamFallback';
import { useHumeVision } from '@/hooks/useHumeVision';
import { useARStore } from '@/store/ar.store';

const FaceFilterPage: React.FC = () => {
  const store = useARStore();
  const { startSession, stopSession } = useHumeVision();

  const handleStart = async () => {
    await startSession();
  };

  const handleStop = () => {
    stopSession();
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Camera className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Filtres Visage AR</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Détection d'émotion en temps réel avec filtres visuels doux
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {store.cameraPermission === 'denied' || !store.hasCamera ? (
                  <NoCamFallback />
                ) : (
                  <FaceFilterAR onStart={handleStart} onStop={handleStop} />
                )}
              </div>
              
              <div className="space-y-6">
                <EmotionBubble 
                  emotion={store.currentEmotion?.emotion} 
                  comment={store.comment}
                />
              </div>
            </div>
          </div>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default FaceFilterPage;