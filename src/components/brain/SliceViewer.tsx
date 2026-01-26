/**
 * SliceViewer - Vues 2D des coupes cérébrales (Axiale, Sagittale, Coronale)
 * EmotionsCare - Module DICOM
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

export interface SliceViewerProps {
  volumeData?: Float32Array | null;
  dimensions?: [number, number, number];
  voxelSize?: [number, number, number];
  onSliceChange?: (view: 'axial' | 'sagittal' | 'coronal', slice: number) => void;
  className?: string;
}

type ViewType = 'axial' | 'sagittal' | 'coronal';

interface SliceState {
  axial: number;
  sagittal: number;
  coronal: number;
}

export const SliceViewer = memo<SliceViewerProps>(({
  volumeData,
  dimensions = [256, 256, 256],
  voxelSize = [1, 1, 1],
  onSliceChange,
  className = '',
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('axial');
  const [slices, setSlices] = useState<SliceState>({
    axial: Math.floor(dimensions[2] / 2),
    sagittal: Math.floor(dimensions[0] / 2),
    coronal: Math.floor(dimensions[1] / 2),
  });
  const [zoom, setZoom] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(0);

  const handleSliceChange = useCallback((view: ViewType, value: number[]) => {
    const sliceValue = value[0];
    setSlices(prev => ({ ...prev, [view]: sliceValue }));
    onSliceChange?.(view, sliceValue);
  }, [onSliceChange]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setContrast(1);
    setBrightness(0);
    setSlices({
      axial: Math.floor(dimensions[2] / 2),
      sagittal: Math.floor(dimensions[0] / 2),
      coronal: Math.floor(dimensions[1] / 2),
    });
  }, [dimensions]);

  // Generate slice image from volume data
  const generateSliceCanvas = useCallback((view: ViewType): string => {
    if (!volumeData) {
      return '';
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    let width: number, height: number;
    const sliceIndex = slices[view];

    switch (view) {
      case 'axial':
        width = dimensions[0];
        height = dimensions[1];
        break;
      case 'sagittal':
        width = dimensions[1];
        height = dimensions[2];
        break;
      case 'coronal':
        width = dimensions[0];
        height = dimensions[2];
        break;
    }

    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let voxelIndex: number;

        switch (view) {
          case 'axial':
            voxelIndex = x + y * dimensions[0] + sliceIndex * dimensions[0] * dimensions[1];
            break;
          case 'sagittal':
            voxelIndex = sliceIndex + x * dimensions[0] + y * dimensions[0] * dimensions[1];
            break;
          case 'coronal':
            voxelIndex = x + sliceIndex * dimensions[0] + y * dimensions[0] * dimensions[1];
            break;
        }

        let value = volumeData[voxelIndex] || 0;
        
        // Apply contrast and brightness
        value = (value - 0.5) * contrast + 0.5 + brightness;
        value = Math.max(0, Math.min(1, value));

        const pixelIndex = (y * width + x) * 4;
        const intensity = Math.floor(value * 255);
        
        imageData.data[pixelIndex] = intensity;
        imageData.data[pixelIndex + 1] = intensity;
        imageData.data[pixelIndex + 2] = intensity;
        imageData.data[pixelIndex + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }, [volumeData, dimensions, slices, contrast, brightness]);

  const sliceImages = useMemo(() => ({
    axial: generateSliceCanvas('axial'),
    sagittal: generateSliceCanvas('sagittal'),
    coronal: generateSliceCanvas('coronal'),
  }), [generateSliceCanvas]);

  const viewConfigs = {
    axial: { label: 'Axiale (Z)', max: dimensions[2] - 1, shortcut: 'A' },
    sagittal: { label: 'Sagittale (X)', max: dimensions[0] - 1, shortcut: 'S' },
    coronal: { label: 'Coronale (Y)', max: dimensions[1] - 1, shortcut: 'C' },
  };

  return (
    <Card className={`bg-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Vues 2D - Coupes</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom -">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom +">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset} title="Réinitialiser">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as ViewType)}>
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(viewConfigs) as ViewType[]).map((view) => (
              <TabsTrigger key={view} value={view} className="text-xs">
                {viewConfigs[view].label} ({viewConfigs[view].shortcut})
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(viewConfigs) as ViewType[]).map((view) => (
            <TabsContent key={view} value={view} className="mt-4">
              <div className="space-y-4">
                {/* Slice Image */}
                <div 
                  className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ minHeight: '200px' }}
                >
                  {sliceImages[view] ? (
                    <img
                      src={sliceImages[view]}
                      alt={`Vue ${view}`}
                      className="max-w-full max-h-[300px] object-contain"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Aucune donnée volumétrique
                    </div>
                  )}
                  
                  {/* Crosshair overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/30" />
                  </div>

                  {/* Slice info */}
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    Coupe {slices[view] + 1}/{viewConfigs[view].max + 1}
                  </div>
                </div>

                {/* Slice Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Position de la coupe</span>
                    <span className="text-muted-foreground">{slices[view]}</span>
                  </div>
                  <Slider
                    value={[slices[view]]}
                    onValueChange={(v) => handleSliceChange(view, v)}
                    min={0}
                    max={viewConfigs[view].max}
                    step={1}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Image adjustments */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Contraste</span>
              <span className="text-muted-foreground">{contrast.toFixed(1)}</span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={(v) => setContrast(v[0])}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Luminosité</span>
              <span className="text-muted-foreground">{brightness.toFixed(2)}</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={(v) => setBrightness(v[0])}
              min={-0.5}
              max={0.5}
              step={0.05}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SliceViewer.displayName = 'SliceViewer';
export default SliceViewer;
