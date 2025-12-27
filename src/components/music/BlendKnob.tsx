import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Heart } from 'lucide-react';

export interface Blend {
  valence: number; // 0-1 (négatif -> positif)
  arousal: number; // 0-1 (calme -> énergique)
}

interface BlendKnobProps {
  value: Blend;
  disabled?: boolean;
  onChange?: (blend: Blend) => void;
}

export const BlendKnob: React.FC<BlendKnobProps> = ({
  value,
  disabled = false,
  onChange
}) => {
  const handleValenceChange = (newValue: number[]) => {
    onChange?.({
      ...value,
      valence: newValue[0] / 100
    });
  };

  const handleArousalChange = (newValue: number[]) => {
    onChange?.({
      ...value,
      arousal: newValue[0] / 100
    });
  };

  const getValenceLabel = (valence: number) => {
    if (valence < 0.3) return 'Plus doux';
    if (valence > 0.7) return 'Plus positif';
    return 'Équilibré';
  };

  const getArousalLabel = (arousal: number) => {
    if (arousal < 0.3) return 'Plus calme';
    if (arousal > 0.7) return 'Plus énergique';
    return 'Modéré';
  };

  return (
    <Card className="bg-gradient-to-br from-secondary/5 to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-secondary" />
          Adaptation émotionnelle
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ajustement automatique basé sur votre état émotionnel
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Valence Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <label className="text-sm font-medium">Humeur</label>
            </div>
            <Badge variant="outline" className="text-xs">
              {getValenceLabel(value.valence)}
            </Badge>
          </div>
          
          <Slider
            value={[value.valence * 100]}
            onValueChange={handleValenceChange}
            disabled={disabled}
            max={100}
            step={1}
            className="w-full"
            aria-label="Réglage d'humeur"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Doux</span>
            <span>Positif</span>
          </div>
        </div>

        {/* Arousal Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <label className="text-sm font-medium">Énergie</label>
            </div>
            <Badge variant="outline" className="text-xs">
              {getArousalLabel(value.arousal)}
            </Badge>
          </div>
          
          <Slider
            value={[value.arousal * 100]}
            onValueChange={handleArousalChange}
            disabled={disabled}
            max={100}
            step={1}
            className="w-full"
            aria-label="Réglage d'énergie"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Calme</span>
            <span>Énergique</span>
          </div>
        </div>

        {/* Current State Display */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">
                {Math.round(value.valence * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Positivité</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary">
                {Math.round(value.arousal * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Énergie</div>
            </div>
          </div>
        </div>

        {disabled && (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Détection émotionnelle désactivée
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};