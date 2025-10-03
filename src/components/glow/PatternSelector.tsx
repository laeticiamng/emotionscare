import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Zap, Heart, Waves } from 'lucide-react';
import { type GlowPattern } from '@/store/glow.store';

interface PatternSelectorProps {
  value: GlowPattern;
  onChange: (pattern: GlowPattern) => void;
  disabled?: boolean;
  className?: string;
}

interface PatternInfo {
  pattern: GlowPattern;
  name: string;
  description: string;
  duration: string;
  benefit: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  color: string;
}

const patterns: PatternInfo[] = [
  {
    pattern: '4-2-4',
    name: 'Équilibre',
    description: 'Respiration équilibrée pour un recentrage rapide',
    duration: '60-90s',
    benefit: 'Clarté mentale',
    icon: Heart,
    difficulty: 'Débutant',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    pattern: '4-6-8',
    name: 'Relaxation',
    description: 'Technique avancée pour réduction du stress',
    duration: '90-120s', 
    benefit: 'Calme profond',
    icon: Waves,
    difficulty: 'Avancé',
    color: 'from-green-500/20 to-teal-500/20',
  },
  {
    pattern: '5-5',
    name: 'Énergie',
    description: 'Respiration dynamique pour boost d\'énergie',
    duration: '45-75s',
    benefit: 'Vitalité',
    icon: Zap,
    difficulty: 'Intermédiaire',
    color: 'from-orange-500/20 to-red-500/20',
  },
];

const PatternSelector: React.FC<PatternSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`pattern-selector space-y-4 ${className}`}>
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Choisissez votre rythme
        </h3>
        <p className="text-xs text-muted-foreground">
          Chaque pattern adapte le cycle respiration à votre besoin du moment
        </p>
      </div>

      <div className="grid gap-3">
        {patterns.map((pattern) => {
          const Icon = pattern.icon;
          const isSelected = value === pattern.pattern;
          
          return (
            <Card
              key={pattern.pattern}
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-md
                ${isSelected ? 
                  'border-primary bg-gradient-to-r ' + pattern.color + ' shadow-lg' : 
                  'hover:border-primary/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onChange(pattern.pattern)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isSelected ? 'bg-primary/20' : 'bg-muted'}
                    `}>
                      <Icon className={`
                        h-5 w-5 
                        ${isSelected ? 'text-primary' : 'text-muted-foreground'}
                      `} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{pattern.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            isSelected ? 'border-primary text-primary' : ''
                          }`}
                        >
                          {pattern.pattern}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {pattern.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pattern.duration}
                        </span>
                        <span>• {pattern.benefit}</span>
                        <span>• {pattern.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de sélection */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 
                      'border-primary bg-primary' : 
                      'border-muted-foreground/30'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Boutons rapides */}
      <div className="flex gap-2 pt-2">
        {patterns.map((pattern) => (
          <Button
            key={pattern.pattern}
            variant={value === pattern.pattern ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(pattern.pattern)}
            disabled={disabled}
            className="flex-1 text-xs"
          >
            {pattern.pattern}
          </Button>
        ))}
      </div>

      {/* Info pattern sélectionné */}
      <div className="text-center p-3 bg-muted/30 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Pattern actuel :</span> {
            patterns.find(p => p.pattern === value)?.name || value
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {patterns.find(p => p.pattern === value)?.benefit}
        </p>
      </div>
    </div>
  );
};

export default PatternSelector;