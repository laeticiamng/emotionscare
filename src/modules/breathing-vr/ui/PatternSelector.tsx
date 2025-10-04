/**
 * Sélecteur de pattern de respiration
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreathingPattern } from '../types';
import { BREATHING_PATTERNS } from '../types';

interface PatternSelectorProps {
  selected: BreathingPattern;
  onSelect: (pattern: BreathingPattern) => void;
}

export const PatternSelector = ({ selected, onSelect }: PatternSelectorProps) => {
  const patternInfo: Record<BreathingPattern, { name: string; description: string; benefit: string }> = {
    box: {
      name: 'Box Breathing',
      description: '4-4-4-4 : Équilibre et calme',
      benefit: 'Idéal pour la concentration'
    },
    calm: {
      name: 'Calme',
      description: '4-6 : Expiration prolongée',
      benefit: 'Réduit le stress rapidement'
    },
    '478': {
      name: '4-7-8',
      description: 'Technique anti-stress',
      benefit: 'Favorise l\'endormissement'
    },
    energy: {
      name: 'Énergie',
      description: '2-1-2 : Rapide et dynamique',
      benefit: 'Boost d\'énergie'
    },
    coherence: {
      name: 'Cohérence',
      description: '5-5 : Rythme régulier',
      benefit: 'Cohérence cardiaque'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(Object.keys(BREATHING_PATTERNS) as BreathingPattern[]).map((pattern) => {
        const info = patternInfo[pattern];
        const isSelected = selected === pattern;

        return (
          <Card
            key={pattern}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(pattern)}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{info.name}</h3>
                {isSelected && (
                  <Badge variant="default" className="text-xs">
                    Sélectionné
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{info.description}</p>
              <p className="text-xs text-primary font-medium">✓ {info.benefit}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
