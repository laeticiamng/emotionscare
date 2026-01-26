/**
 * BrainControls - Panneau de contrôle pour la visualisation 3D
 * Contrôles de vue, opacité, filtres, export
 */

import React, { memo } from 'react';
import { 
  Eye, 
  EyeOff, 
  Grid3X3, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Download,
  Upload,
  Layers,
  Brain,
  Activity,
  Settings2,
  Maximize2,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VIEW_MODES, type ViewMode, type ScanModality } from './types';

// ============================================================================
// Types
// ============================================================================

interface BrainControlsProps {
  // Vue
  viewMode: 'axial' | 'sagittal' | 'coronal' | '3d';
  onViewModeChange: (mode: 'axial' | 'sagittal' | 'coronal' | '3d') => void;
  
  // Affichage
  opacity: number;
  onOpacityChange: (value: number) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  wireframe: boolean;
  onWireframeChange: (enabled: boolean) => void;
  
  // Overlay émotionnel
  showEmotionOverlay: boolean;
  onShowEmotionOverlayChange: (show: boolean) => void;
  emotionIntensityThreshold: number;
  onEmotionIntensityThresholdChange: (value: number) => void;
  
  // Scan info
  scanModality?: ScanModality;
  scanStatus?: string;
  
  // Actions
  onUploadScan?: () => void;
  onExportView?: () => void;
  onResetView?: () => void;
  onFullscreen?: () => void;
  onScreenshot?: () => void;
  
  // État
  isLoading?: boolean;
  hasActiveScan?: boolean;
}

// ============================================================================
// Composant principal
// ============================================================================

export const BrainControls: React.FC<BrainControlsProps> = memo(({
  viewMode,
  onViewModeChange,
  opacity,
  onOpacityChange,
  showLabels,
  onShowLabelsChange,
  wireframe,
  onWireframeChange,
  showEmotionOverlay,
  onShowEmotionOverlayChange,
  emotionIntensityThreshold,
  onEmotionIntensityThresholdChange,
  scanModality,
  scanStatus,
  onUploadScan,
  onExportView,
  onResetView,
  onFullscreen,
  onScreenshot,
  isLoading = false,
  hasActiveScan = false,
}) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-border">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Contrôles 3D</h3>
          </div>
          {scanModality && (
            <Badge variant="outline" className="text-xs">
              {scanModality.replace('_', ' ')}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Mode de vue */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mode de vue</Label>
          <div className="grid grid-cols-4 gap-1">
            {VIEW_MODES.map((mode) => (
              <Tooltip key={mode.type}>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === mode.type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange(mode.type)}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    {mode.shortcut}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mode.label} ({mode.shortcut})</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Opacité */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Opacité</Label>
            <span className="text-xs text-muted-foreground">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <Slider
            value={[opacity * 100]}
            onValueChange={([v]) => onOpacityChange(v / 100)}
            min={10}
            max={100}
            step={5}
            disabled={isLoading}
          />
        </div>

        {/* Options d'affichage */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Affichage</Label>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Labels régions</span>
            </div>
            <Switch
              checked={showLabels}
              onCheckedChange={onShowLabelsChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Mode filaire</span>
            </div>
            <Switch
              checked={wireframe}
              onCheckedChange={onWireframeChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <Separator />

        {/* Overlay émotionnel */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Overlay Émotionnel</CardTitle>
              </div>
              <Switch
                checked={showEmotionOverlay}
                onCheckedChange={onShowEmotionOverlayChange}
                disabled={isLoading}
              />
            </div>
          </CardHeader>
          
          {showEmotionOverlay && (
            <CardContent className="py-2 px-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Seuil d'intensité
                  </span>
                  <span className="text-xs font-medium">
                    {Math.round(emotionIntensityThreshold * 100)}%
                  </span>
                </div>
                <Slider
                  value={[emotionIntensityThreshold * 100]}
                  onValueChange={([v]) => onEmotionIntensityThresholdChange(v / 100)}
                  min={0}
                  max={100}
                  step={5}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Separator />

        {/* Actions rapides */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Actions</Label>
          <div className="grid grid-cols-2 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUploadScan}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>Importer un scan DICOM/NIfTI</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportView}
                  disabled={isLoading || !hasActiveScan}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exporter la vue (glTF/PDF)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onScreenshot}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Capture
                </Button>
              </TooltipTrigger>
              <TooltipContent>Capturer une image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetView}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>Réinitialiser la vue</TooltipContent>
            </Tooltip>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onFullscreen}
            disabled={isLoading}
            className="w-full gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Plein écran
          </Button>
        </div>

        {/* Status */}
        {scanStatus && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                scanStatus === 'ready' ? 'bg-green-500' :
                scanStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                scanStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className="text-xs text-muted-foreground capitalize">
                {scanStatus === 'ready' ? 'Prêt' :
                 scanStatus === 'processing' ? 'Traitement...' :
                 scanStatus === 'error' ? 'Erreur' : scanStatus}
              </span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});

BrainControls.displayName = 'BrainControls';

export default BrainControls;
