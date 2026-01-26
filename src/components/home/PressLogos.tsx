/**
 * PressLogos - Logos de presse et partenaires
 * OPTIMISÉ: CSS animations au lieu de framer-motion pour performance
 */

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PressLogo {
  id: string;
  name: string;
  logo?: string;
  mention?: string;
  url?: string;
}

const pressLogos: PressLogo[] = [
  { id: 'lemonde', name: 'Le Monde', mention: 'Solution innovante', url: 'https://www.lemonde.fr' },
  { id: 'figaro', name: 'Le Figaro', mention: 'App de l\'année', url: 'https://www.lefigaro.fr' },
  { id: 'france2', name: 'France 2', mention: 'Vu sur', url: 'https://www.france.tv/france-2' },
  { id: 'liberation', name: 'Libération', mention: 'Recommandé', url: 'https://www.liberation.fr' },
  { id: 'huffpost', name: 'HuffPost', mention: 'Top 10 Apps Santé', url: 'https://www.huffingtonpost.fr' },
];

interface PressLogosProps {
  className?: string;
  variant?: 'scroll' | 'static' | 'minimal';
}

const PressLogos: React.FC<PressLogosProps> = ({
  className,
  variant = 'static',
}) => {
  if (variant === 'minimal') {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-xs text-muted-foreground mb-3">Ils parlent de nous</p>
        <div className="flex flex-wrap justify-center gap-4">
          {pressLogos.slice(0, 4).map((logo) => (
            <span key={logo.id} className="text-sm font-medium text-muted-foreground/70">
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'scroll') {
    return (
      <div className={cn('overflow-hidden py-6', className)}>
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Newspaper className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm text-muted-foreground">Ils parlent de nous</span>
        </div>
        {/* CSS-only infinite scroll animation */}
        <div className="relative">
          <div 
            className="flex gap-12 whitespace-nowrap animate-scroll-left"
            style={{
              animation: 'scroll-left 20s linear infinite',
            }}
          >
            {[...pressLogos, ...pressLogos, ...pressLogos].map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 flex-shrink-0"
              >
                <span className="text-lg font-bold text-foreground/80">{logo.name}</span>
                {logo.mention && (
                  <Badge variant="secondary" className="text-xs">
                    {logo.mention}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    );
  }

  // Static variant (default) - CSS animations instead of framer-motion
  return (
    <section className={cn('py-12 bg-muted/20', className)}>
      <div className="container">
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center">
            <Badge variant="outline" className="gap-2 mb-4">
              <Award className="h-3 w-3" aria-hidden="true" />
              Reconnu et recommandé
            </Badge>
            <p className="text-sm text-muted-foreground">
              EmotionsCare est mentionné dans les plus grands médias
            </p>
          </div>

          {/* Logos Grid - staggered animation via CSS */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {pressLogos.map((logo, index) => (
              <div
                key={logo.id}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-card/50 border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-xl font-bold text-foreground/80">{logo.name}</span>
                {logo.mention && (
                  <span className="text-xs text-muted-foreground">"{logo.mention}"</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(PressLogos);
