import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAdaptiveMusic } from '@/hooks/useAdaptiveMusic';
import { Settings } from 'lucide-react';

interface AdaptiveMusicSettingsProps {
  className?: string;
}

const AdaptiveMusicSettings: React.FC<AdaptiveMusicSettingsProps> = ({
  className = ""
}) => {
  const { config, updateConfig } = useAdaptiveMusic();

  const handleSensitivityChange = (values: number[]) => {
    updateConfig({ emotionSensitivity: values[0] / 100 });
  };

  const handleFadeInChange = (values: number[]) => {
    updateConfig({ fadeInDuration: values[0] * 100 });
  };

  const handleFadeOutChange = (values: number[]) => {
    updateConfig({ fadeOutDuration: values[0] * 100 });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres de musique adaptative
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Activation */}
        <div className="flex items-center justify-between">
          <Label htmlFor="adaptive-enabled">Musique adaptative</Label>
          <Switch
            id="adaptive-enabled"
            checked={config.enabled}
            onCheckedChange={(enabled) => updateConfig({ enabled })}
          />
        </div>

        {config.enabled && (
          <>
            {/* Sensibilité */}
            <div className="space-y-2">
              <Label>Sensibilité émotionnelle: {Math.round((config.emotionSensitivity ?? 0.7) * 100)}%</Label>
              <Slider
                value={[(config.emotionSensitivity ?? 0.7) * 100]}
                onValueChange={handleSensitivityChange}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Plus la sensibilité est élevée, plus la musique s'adapte rapidement aux changements d'émotion
              </p>
            </div>

            {/* Transitions automatiques */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-transition">Transitions automatiques</Label>
                <p className="text-xs text-muted-foreground">
                  Transition douce entre les morceaux
                </p>
              </div>
              <Switch
                id="auto-transition"
                checked={config.autoTransition ?? true}
                onCheckedChange={(autoTransition) => updateConfig({ autoTransition })}
              />
            </div>

            {(config.autoTransition ?? true) && (
              <>
                {/* Durée fade in */}
                <div className="space-y-2">
                  <Label>Durée d'apparition: {config.fadeInDuration ?? 2000}ms</Label>
                  <Slider
                    value={[(config.fadeInDuration ?? 2000) / 100]}
                    onValueChange={handleFadeInChange}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Durée fade out */}
                <div className="space-y-2">
                  <Label>Durée de disparition: {config.fadeOutDuration ?? 1500}ms</Label>
                  <Slider
                    value={[(config.fadeOutDuration ?? 1500) / 100]}
                    onValueChange={handleFadeOutChange}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="volume-adjustment">Ajustement automatique du volume</Label>
                <p className="text-xs text-muted-foreground">
                  Ajuste le volume selon l'émotion
                </p>
              </div>
              <Switch
                id="volume-adjustment"
                checked={config.volumeAdjustment ?? true}
                onCheckedChange={(volumeAdjustment) => updateConfig({ volumeAdjustment })}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveMusicSettings;
