// @ts-nocheck
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { useUserMode } from '@/contexts/UserModeContext';

/**
 * Preview miniature du Bubble Beat avec animation de démo
 */
export const BubbleBeatMini: React.FC = () => {
  const router = useRouter();
  const { userMode } = useUserMode();

  const getFormattedPath = (path: string) => {
    // Utiliser les routes canoniques
    return `/app/${path}`;
  };

  const handleClick = () => {
    router.push(getFormattedPath('bubble-beat'));
  };

  // Animation simple avec CSS
  const bubbles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.2,
      size: Math.random() * 0.5 + 0.5,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    })), []
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive" />
          Bubble Beat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone d'animation */}
        <div 
          className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden cursor-pointer group"
          onClick={handleClick}
          role="img"
          aria-label="Animation de rythme cardiaque"
        >
          {/* Bulles animées */}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              className="absolute rounded-full bg-primary/30 animate-pulse"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size * 20}px`,
                height: `${bubble.size * 20}px`,
                animationDelay: `${bubble.delay}s`,
                animationDuration: '2s'
              }}
            />
          ))}

          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-background/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-sm font-medium text-foreground">
              Cliquer pour voir plus
            </div>
          </div>

          {/* Indicateur de démonstration */}
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-background/80 px-2 py-1 rounded-full">
              Mode démo
            </span>
          </div>
        </div>

        {/* Description et CTA */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Visualisez votre rythme cardiaque en temps réel avec des animations apaisantes.
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="w-full"
          >
            Essayer maintenant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Note capteur */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          💡 Connectez un capteur de fréquence cardiaque pour une expérience personnalisée
        </div>
      </CardContent>
    </Card>
  );
};