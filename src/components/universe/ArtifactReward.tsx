import React, { useState, useEffect } from 'react';
import { Universe } from '@/types/universes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Flower, 
  Flame, 
  Circle, 
  Star, 
  Heart,
  Droplets,
  Zap,
  Sun
} from 'lucide-react';

interface ArtifactRewardProps {
  universe: Universe;
  onComplete: () => void;
  className?: string;
}

export const ArtifactReward: React.FC<ArtifactRewardProps> = ({
  universe,
  onComplete,
  className = ""
}) => {
  const [phase, setPhase] = useState<'materializing' | 'complete'>('materializing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('complete');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getArtifactIcon = () => {
    switch (universe.artifacts.type) {
      case 'aura': return <Sun className="w-8 h-8" />;
      case 'sticker': return <Star className="w-8 h-8" />;
      case 'flower': return <Flower className="w-8 h-8" />;
      case 'flame': return <Flame className="w-8 h-8" />;
      case 'pearl': return <Circle className="w-8 h-8" />;
      case 'bubble': return <Droplets className="w-8 h-8" />;
      case 'crystal': return <Zap className="w-8 h-8" />;
      case 'lantern': return <Heart className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  const getArtifactColor = () => {
    switch (universe.artifacts.type) {
      case 'aura': return 'text-yellow-500';
      case 'sticker': return 'text-purple-500';
      case 'flower': return 'text-pink-500';
      case 'flame': return 'text-orange-500';
      case 'pearl': return 'text-blue-500';
      case 'bubble': return 'text-cyan-500';
      case 'crystal': return 'text-indigo-500';
      case 'lantern': return 'text-green-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Materializing effect */}
      <div className="relative mb-8">
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-2000 ${
            phase === 'materializing' 
              ? 'scale-50 opacity-50 animate-pulse' 
              : 'scale-100 opacity-100 animate-scale-in'
          }`}
          style={{
            background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})`
          }}
        >
          <div className={`${getArtifactColor()} transition-all duration-1000`}>
            {getArtifactIcon()}
          </div>
        </div>

        {/* Sparkle effects */}
        {phase === 'complete' && (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <Sparkles
                key={i}
                className={`absolute w-4 h-4 text-yellow-400 animate-ping ${getArtifactColor()}`}
                style={{
                  left: `${50 + 30 * Math.cos((i * 45) * Math.PI / 180)}%`,
                  top: `${50 + 30 * Math.sin((i * 45) * Math.PI / 180)}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Artifact info */}
      <Card 
        className={`max-w-sm bg-card/90 backdrop-blur-sm border-0 shadow-elegant transition-all duration-1000 ${
          phase === 'complete' ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: `${universe.ambiance.colors.primary}20`,
                color: universe.ambiance.colors.primary 
              }}
            >
              {universe.artifacts.name}
            </Badge>
          </div>
          
          <p className="text-foreground font-medium mb-2">
            Nouveau trésor débloqué
          </p>
          
          <p className="text-sm text-muted-foreground mb-6">
            {universe.artifacts.description}
          </p>

          {phase === 'complete' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Ajouté à ton jardin personnel ✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-complete after animation */}
      {phase === 'complete' && (
        <div className="mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continuer →
          </button>
        </div>
      )}
    </div>
  );
};