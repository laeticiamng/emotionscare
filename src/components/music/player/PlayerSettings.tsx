import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Settings, Volume2, Keyboard, Eye } from 'lucide-react';

interface PlayerSettingsProps {
  visualizerEnabled: boolean;
  onVisualizerToggle: (enabled: boolean) => void;
  keyboardShortcutsEnabled: boolean;
  onKeyboardShortcutsToggle: (enabled: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  visualizerEnabled,
  onVisualizerToggle,
  keyboardShortcutsEnabled,
  onKeyboardShortcutsToggle,
  volume,
  onVolumeChange,
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Paramètres du Lecteur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualiseur Audio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label htmlFor="visualizer">Visualiseur Audio</Label>
              <p className="text-xs text-muted-foreground">
                Affiche les ondes sonores en temps réel
              </p>
            </div>
          </div>
          <Switch
            id="visualizer"
            checked={visualizerEnabled}
            onCheckedChange={onVisualizerToggle}
          />
        </div>

        {/* Raccourcis Clavier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label htmlFor="shortcuts">Raccourcis Clavier</Label>
              <p className="text-xs text-muted-foreground">
                Espace: Pause/Lecture, ←→: Navigation
              </p>
            </div>
          </div>
          <Switch
            id="shortcuts"
            checked={keyboardShortcutsEnabled}
            onCheckedChange={onKeyboardShortcutsToggle}
          />
        </div>

        {/* Volume Principal */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Label>Volume Principal</Label>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(values) => onVolumeChange(values[0] / 100)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onVolumeChange(0.5)}>
              Volume 50%
            </Button>
            <Button variant="outline" size="sm" onClick={() => onVolumeChange(0.8)}>
              Volume 80%
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerSettings;
