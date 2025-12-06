import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Move, Type, Glasses } from 'lucide-react';
import { type A11y } from '@/store/settings.store';

interface A11yPanelProps {
  value: A11y;
  onChange: (key: keyof A11y, value: boolean | number) => void;
}

export const A11yPanel: React.FC<A11yPanelProps> = ({ value, onChange }) => {
  const fontScalePercentage = Math.round(value.font_scale * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Accessibilité
        </CardTitle>
        <CardDescription>
          Personnalisez l'expérience selon vos besoins
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Move className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="reduced-motion" className="font-medium">
                Réduire les animations
              </Label>
              <p className="text-xs text-muted-foreground">
                Remplace les animations complexes par des transitions simples
              </p>
            </div>
          </div>
          
          <Switch
            id="reduced-motion"
            checked={value.reduced_motion}
            onCheckedChange={(checked) => onChange('reduced_motion', checked)}
            aria-describedby="reduced-motion-desc"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="high-contrast" className="font-medium">
                Contraste élevé
              </Label>
              <p className="text-xs text-muted-foreground">
                Augmente les contrastes pour une meilleure lisibilité
              </p>
            </div>
          </div>
          
          <Switch
            id="high-contrast"
            checked={value.high_contrast}
            onCheckedChange={(checked) => onChange('high_contrast', checked)}
            aria-describedby="high-contrast-desc"
          />
        </div>

        {/* Font Scale */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Type className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="font-scale" className="font-medium">
                Taille de police
              </Label>
              <p className="text-xs text-muted-foreground">
                Ajustez la taille du texte : {fontScalePercentage}%
              </p>
            </div>
          </div>
          
          <div className="px-3">
            <Slider
              id="font-scale"
              min={1.0}
              max={1.5}
              step={0.125}
              value={[value.font_scale]}
              onValueChange={([scale]) => onChange('font_scale', scale)}
              className="w-full"
              aria-valuemin={100}
              aria-valuemax={150}
              aria-valuenow={fontScalePercentage}
              aria-label="Taille de police en pourcentage"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>100%</span>
              <span>125%</span>
              <span>150%</span>
            </div>
          </div>
        </div>

        {/* Dyslexic Font */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Glasses className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="dyslexic-font" className="font-medium">
                Police adaptée à la dyslexie
              </Label>
              <p className="text-xs text-muted-foreground">
                Utilise OpenDyslexic pour faciliter la lecture
              </p>
            </div>
          </div>
          
          <Switch
            id="dyslexic-font"
            checked={value.dyslexic_font}
            onCheckedChange={(checked) => onChange('dyslexic_font', checked)}
            aria-describedby="dyslexic-font-desc"
          />
        </div>

        {/* Preview hint */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Aperçu en direct :</strong> Les modifications s'appliquent immédiatement 
            pour que vous puissiez voir le résultat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};