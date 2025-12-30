import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Image, History, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useARFilters } from '@/modules/ar-filters/hooks/useARFilters';
import { ARCamera } from '@/modules/ar-filters/components/ARCamera';
import { ARFilterSelector } from '@/modules/ar-filters/components/ARFilterSelector';
import { ARPhotoGallery } from '@/modules/ar-filters/components/ARPhotoGallery';
import { ARStats } from '@/modules/ar-filters/components/ARStats';
import { ARSessionControls } from '@/modules/ar-filters/components/ARSessionControls';
import { ARHistory } from '@/modules/ar-filters/components/ARHistory';

const B2CARFiltersPage: React.FC = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    filters,
    currentFilter,
    selectFilter,
    isCameraActive,
    startCamera,
    stopCamera,
    isSessionActive,
    startSession,
    endSession,
    sessionDuration,
    capturedPhotos,
    capturePhoto,
    clearPhotos,
    stats,
    history,
    isLoadingStats,
  } = useARFilters(user?.id);

  // Sync video ref
  useEffect(() => {
    if (videoRef.current && isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }
  }, [isCameraActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 rounded-full mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Filtres AR Émotionnels
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expérimentez avec nos filtres de réalité augmentée conçus pour influencer positivement votre état émotionnel.
          </p>
        </motion.div>

        <Tabs defaultValue="camera" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="camera" className="gap-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Caméra</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Galerie</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Camera Tab */}
          <TabsContent value="camera" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ARCamera
                  currentFilter={currentFilter}
                  isCameraActive={isCameraActive}
                  isSessionActive={isSessionActive}
                  sessionDuration={sessionDuration}
                  onStartCamera={startCamera}
                  onStopCamera={stopCamera}
                  onCapturePhoto={capturePhoto}
                  videoRef={videoRef}
                />
              </div>
              
              <div className="space-y-6">
                <ARFilterSelector
                  filters={filters}
                  currentFilter={currentFilter}
                  onSelectFilter={selectFilter}
                  disabled={isSessionActive}
                />
                <ARSessionControls
                  currentFilter={currentFilter}
                  isSessionActive={isSessionActive}
                  isCameraActive={isCameraActive}
                  sessionDuration={sessionDuration}
                  onStartSession={startSession}
                  onEndSession={endSession}
                />
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <ARPhotoGallery photos={capturedPhotos} onClearPhotos={clearPhotos} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <ARHistory sessions={history} />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <ARStats stats={stats} isLoading={isLoadingStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CARFiltersPage;