/**
 * BrainViewerPage - Page principale du visualiseur 3D cérébral
 * Intégration DICOM/NIfTI + Overlay émotionnel Hume AI
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  ArrowLeft, 
  Settings2,
  Maximize2,
  Minimize2,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Components Brain Viewer
import { 
  BrainViewer3D,
  BrainControls,
  EmotionOverlayPanel,
  ScanUploadDialog,
  RegionInfoPanel,
  type ScanModality,
} from '@/components/brain';

// Hooks
import { useBrainData } from '@/hooks/brain/useBrainData';
import { useEmotionOverlay } from '@/hooks/brain/useEmotionOverlay';

// ============================================================================
// Page Component
// ============================================================================

const BrainViewerPage: React.FC = () => {
  const { toast } = useToast();
  
  // États UI
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'emotions' | 'region'>('emotions');
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  
  // États de visualisation
  const [viewMode, setViewMode] = useState<'axial' | 'sagittal' | 'coronal' | '3d'>('3d');
  const [opacity, setOpacity] = useState(0.85);
  const [showLabels, setShowLabels] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showEmotionOverlay, setShowEmotionOverlay] = useState(true);
  const [emotionIntensityThreshold, setEmotionIntensityThreshold] = useState(0.2);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Données brain
  const { 
    currentScan,
    regions,
    isLoading: isScanLoading,
    isProcessing: isUploading,
    error: uploadError,
    uploadScan,
  } = useBrainData();

  // État local pour le progress (simulé)
  const [uploadProgress, setUploadProgress] = useState(0);

  // Données émotionnelles
  const {
    emotionData,
    isRealtimeMode: isRealtime,
    isOverlayActive: isPlaying,
    toggleRealtimeMode: toggleRealtime,
    refreshEmotions,
  } = useEmotionOverlay();

  // Filtrer les émotions par seuil
  const filteredEmotions = React.useMemo(() => {
    if (!emotionData?.mappings) return {};
    
    const filtered: typeof emotionData.mappings = {};
    Object.entries(emotionData.mappings).forEach(([key, value]) => {
      if (value && value.intensity >= emotionIntensityThreshold) {
        filtered[key] = value;
      }
    });
    return filtered;
  }, [emotionData?.mappings, emotionIntensityThreshold]);

  // Handlers
  const handleUpload = useCallback(async (
    file: File, 
    options: { modality: ScanModality; anonymize: boolean; seriesDescription?: string }
  ) => {
    try {
      setUploadProgress(0);
      // Simuler le progress
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      await uploadScan(file, options.anonymize);
      clearInterval(interval);
      setUploadProgress(100);
      setShowUploadDialog(false);
      toast({
        title: 'Scan importé',
        description: 'Le scan cérébral a été importé avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'importer le scan.',
        variant: 'destructive',
      });
    }
  }, [uploadScan, toast]);

  const handleExportView = useCallback(() => {
    toast({
      title: 'Export',
      description: 'Fonctionnalité d\'export en cours de développement.',
    });
  }, [toast]);

  const handleScreenshot = useCallback(() => {
    toast({
      title: 'Capture',
      description: 'Fonctionnalité de capture en cours de développement.',
    });
  }, [toast]);

  const handleResetView = useCallback(() => {
    setViewMode('3d');
    setOpacity(0.85);
    setSelectedRegion(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toUpperCase()) {
        case 'A':
          setViewMode('axial');
          break;
        case 'S':
          setViewMode('sagittal');
          break;
        case 'C':
          setViewMode('coronal');
          break;
        case 'D':
          setViewMode('3d');
          break;
        case 'L':
          setShowLabels(prev => !prev);
          break;
        case 'W':
          setWireframe(prev => !prev);
          break;
        case 'ESCAPE':
          setSelectedRegion(null);
          break;
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  return (
    <div className={`h-screen flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/app/home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="font-semibold text-lg hidden sm:block">
                Brain Viewer 3D
              </h1>
            </div>

            {currentScan && (
              <Badge variant="outline" className="hidden md:flex">
                {currentScan.modality.replace('_', ' ')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle fullscreen */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleFullscreen}
              className="hidden sm:flex"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileControlsOpen} onOpenChange={setMobileControlsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="h-full overflow-auto">
                  <div className="p-4">
                    <BrainControls
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      opacity={opacity}
                      onOpacityChange={setOpacity}
                      showLabels={showLabels}
                      onShowLabelsChange={setShowLabels}
                      wireframe={wireframe}
                      onWireframeChange={setWireframe}
                      showEmotionOverlay={showEmotionOverlay}
                      onShowEmotionOverlayChange={setShowEmotionOverlay}
                      emotionIntensityThreshold={emotionIntensityThreshold}
                      onEmotionIntensityThresholdChange={setEmotionIntensityThreshold}
                      scanModality={currentScan?.modality}
                      scanStatus={currentScan?.status}
                      onUploadScan={() => setShowUploadDialog(true)}
                      onExportView={handleExportView}
                      onResetView={handleResetView}
                      onFullscreen={toggleFullscreen}
                      onScreenshot={handleScreenshot}
                      isLoading={isScanLoading}
                      hasActiveScan={!!currentScan}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Controls (desktop) */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-border overflow-auto">
          <div className="p-4 w-full">
            <BrainControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              opacity={opacity}
              onOpacityChange={setOpacity}
              showLabels={showLabels}
              onShowLabelsChange={setShowLabels}
              wireframe={wireframe}
              onWireframeChange={setWireframe}
              showEmotionOverlay={showEmotionOverlay}
              onShowEmotionOverlayChange={setShowEmotionOverlay}
              emotionIntensityThreshold={emotionIntensityThreshold}
              onEmotionIntensityThresholdChange={setEmotionIntensityThreshold}
              scanModality={currentScan?.modality}
              scanStatus={currentScan?.status}
              onUploadScan={() => setShowUploadDialog(true)}
              onExportView={handleExportView}
              onResetView={handleResetView}
              onFullscreen={toggleFullscreen}
              onScreenshot={handleScreenshot}
              isLoading={isScanLoading}
              hasActiveScan={!!currentScan}
            />
          </div>
        </aside>

        {/* Center - 3D Viewer */}
        <div className="flex-1 relative">
          <BrainViewer3D
            scan={currentScan}
            regions={regions}
            emotionOverlay={showEmotionOverlay ? filteredEmotions : undefined}
            selectedRegion={selectedRegion}
            onRegionSelect={setSelectedRegion}
            viewMode={viewMode}
            showLabels={showLabels}
            opacity={opacity}
            wireframe={wireframe}
            isLoading={isScanLoading}
          />

          {/* View mode indicator */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
              Vue: {viewMode.toUpperCase()}
            </Badge>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm rounded px-2 py-1 hidden md:block">
            A/S/C/D: Vues • L: Labels • W: Filaire • Esc: Désélectionner
          </div>
        </div>

        {/* Right sidebar - Emotions & Region info */}
        <aside className="hidden md:flex w-80 flex-shrink-0 border-l border-border flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border">
              <TabsTrigger value="emotions" className="flex-1">Émotions</TabsTrigger>
              <TabsTrigger value="region" className="flex-1">Région</TabsTrigger>
            </TabsList>
            
            <TabsContent value="emotions" className="flex-1 m-0 overflow-hidden">
              <EmotionOverlayPanel
                emotions={filteredEmotions}
                dominantEmotion={emotionData?.dominantEmotion}
                overallIntensity={emotionData?.overallIntensity}
                timestamp={emotionData?.timestamp}
                isRealtime={isRealtime}
                isPlaying={isPlaying}
                onToggleRealtime={toggleRealtime}
                onRefresh={refreshEmotions}
                onRegionClick={setSelectedRegion}
                selectedRegion={selectedRegion}
              />
            </TabsContent>
            
            <TabsContent value="region" className="flex-1 m-0 overflow-hidden">
              <RegionInfoPanel
                selectedRegionCode={selectedRegion}
                emotionOverlay={filteredEmotions}
              />
            </TabsContent>
          </Tabs>
        </aside>
      </main>

      {/* Upload Dialog */}
      <ScanUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        error={uploadError}
      />
    </div>
  );
};

export default BrainViewerPage;
