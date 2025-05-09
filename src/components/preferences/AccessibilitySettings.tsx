
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';

const AccessibilitySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 2,
    reducedAnimations: false,
    screenReader: false,
    keyboardNavigation: true,
    audioGuidance: false,
    interactionSpeed: 1, // 0 = slow, 1 = normal, 2 = fast
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 3) {
      handleChange('fontSize', settings.fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 1) {
      handleChange('fontSize', settings.fontSize - 1);
    }
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres d'accessibilité mis à jour",
      description: "Vos préférences d'accessibilité ont été enregistrées."
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Taille du texte</label>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={decreaseFontSize}
          >
            <Minus size={18} />
          </Button>
          <div className="flex-1 h-2 bg-secondary rounded-full">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${(settings.fontSize / 3) * 100}%` }}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-lg"
            onClick={increaseFontSize}
          >
            <Plus size={18} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {settings.fontSize === 1 ? 'Petite' : settings.fontSize === 2 ? 'Moyenne' : 'Grande'}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="high-contrast">Contraste renforcé</Label>
          <p className="text-xs text-muted-foreground">Améliore la lisibilité des textes</p>
        </div>
        <Switch 
          id="high-contrast"
          checked={settings.highContrast}
          onCheckedChange={(checked) => handleChange('highContrast', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="reduced-animations">Réduction des animations</Label>
          <p className="text-xs text-muted-foreground">Mode zen avec animations minimales</p>
        </div>
        <Switch 
          id="reduced-animations"
          checked={settings.reducedAnimations}
          onCheckedChange={(checked) => handleChange('reducedAnimations', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="audio-guidance">Interface audio-guidée</Label>
          <p className="text-xs text-muted-foreground">Navigation par description audio</p>
        </div>
        <Switch 
          id="audio-guidance"
          checked={settings.audioGuidance}
          onCheckedChange={(checked) => handleChange('audioGuidance', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="keyboard-navigation">Navigation au clavier</Label>
          <p className="text-xs text-muted-foreground">Facilite l'utilisation sans souris</p>
        </div>
        <Switch 
          id="keyboard-navigation"
          checked={settings.keyboardNavigation}
          onCheckedChange={(checked) => handleChange('keyboardNavigation', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="screen-reader">Compatibilité lecteur d'écran</Label>
          <p className="text-xs text-muted-foreground">Optimisation pour les technologies d'assistance</p>
        </div>
        <Switch 
          id="screen-reader"
          checked={settings.screenReader}
          onCheckedChange={(checked) => handleChange('screenReader', checked)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Vitesse d'interaction</label>
        <Slider
          defaultValue={[settings.interactionSpeed]}
          max={2}
          step={1}
          onValueChange={(value) => handleChange('interactionSpeed', value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lente</span>
          <span>Normale</span>
          <span>Rapide</span>
        </div>
      </div>

      <Button onClick={saveSettings} className="w-full">
        Enregistrer les préférences
      </Button>
    </div>
  );
};

export default AccessibilitySettings;
