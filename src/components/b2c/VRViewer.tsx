import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface VRViewerProps {
  type: 'vr' | 'ambilight' | 'audio';
  theme: string;
  intensity: number;
  onIntensityChange?: (value: number) => void;
  isActive: boolean;
}

export const VRViewer: React.FC<VRViewerProps> = ({
  type,
  theme,
  intensity,
  onIntensityChange,
  isActive,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getGradientColors = () => {
    const themeColors: Record<string, string[]> = {
      forest: ['from-green-400', 'via-emerald-500', 'to-teal-600'],
      ocean: ['from-blue-400', 'via-cyan-500', 'to-indigo-600'],
      sunset: ['from-orange-400', 'via-pink-500', 'to-purple-600'],
      night: ['from-purple-900', 'via-blue-900', 'to-indigo-950'],
      calm: ['from-blue-200', 'via-purple-200', 'to-pink-200'],
    };
    return themeColors[theme] || themeColors.calm;
  };

  const getTypeContent = () => {
    switch (type) {
      case 'vr':
        return (
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getGradientColors().join(' ')} opacity-${Math.round(intensity * 100)}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.05s linear',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm animate-pulse"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold bg-black/10">
              Environnement VR: {theme}
            </div>
          </div>
        );
      
      case 'ambilight':
        return (
          <div className="relative w-full h-full">
            <div className={`w-full h-full bg-gradient-to-br ${getGradientColors().join(' ')} rounded-lg`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 text-white">
                  <div className="text-4xl font-light">Ambilight</div>
                  <div className="text-xl opacity-80">{theme}</div>
                  <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-12 bg-white/40 rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          opacity: intensity,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 mx-1 bg-primary rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.random() * 100 * intensity}px`,
                      animation: 'pulse 0.8s ease-in-out infinite',
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
              <div className="text-white text-xl">Session audio immersive</div>
              <div className="text-gray-400">{theme}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`relative ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'}`}>
      <div className={`${isFullscreen ? 'h-screen' : 'h-96'} p-6 space-y-4`}>
        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Paramètres"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {showSettings && (
            <div className="absolute top-16 right-6 z-10 bg-card border rounded-lg p-4 shadow-lg space-y-4 min-w-[200px]">
              <div className="space-y-2">
                <Label>Intensité</Label>
                <Slider
                  value={[intensity]}
                  max={1}
                  step={0.1}
                  onValueChange={(v) => onIntensityChange?.(v[0])}
                />
              </div>
            </div>
          )}
        </div>

        {/* Viewer */}
        <div className="h-full">
          {getTypeContent()}
        </div>
      </div>
    </Card>
  );
};
