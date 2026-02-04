/**
 * AccessibilityPanel - Panneau de configuration d'accessibilité avancée
 * Conforme WCAG 2.1 AA avec options personnalisables
 */

import React, { useState, memo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, Eye, Ear, Hand, Type, Contrast, 
  Volume2, VolumeX, MousePointer, Keyboard, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessibilitySettings {
  // Vision
  highContrast: boolean;
  largeText: boolean;
  fontScale: number;
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  
  // Audio
  screenReaderOptimized: boolean;
  audioDescriptions: boolean;
  captionsEnabled: boolean;
  
  // Motor
  keyboardOnly: boolean;
  focusIndicators: boolean;
  largeClickTargets: boolean;
  
  // Cognitive
  simplifiedUI: boolean;
  readingGuide: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  fontScale: 100,
  dyslexiaFont: false,
  reduceMotion: false,
  screenReaderOptimized: false,
  audioDescriptions: false,
  captionsEnabled: true,
  keyboardOnly: false,
  focusIndicators: true,
  largeClickTargets: false,
  simplifiedUI: false,
  readingGuide: false,
};

const AccessibilityPanel: React.FC = memo(() => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
    document.documentElement.style.setProperty('--font-scale', `${settings.fontScale}%`);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    toast({ title: 'Paramètres réinitialisés' });
  }, [toast]);

  const applyPreset = useCallback((preset: 'vision' | 'motor' | 'cognitive') => {
    switch (preset) {
      case 'vision':
        setSettings(prev => ({
          ...prev,
          highContrast: true,
          largeText: true,
          fontScale: 125,
          screenReaderOptimized: true,
        }));
        break;
      case 'motor':
        setSettings(prev => ({
          ...prev,
          keyboardOnly: true,
          focusIndicators: true,
          largeClickTargets: true,
          reduceMotion: true,
        }));
        break;
      case 'cognitive':
        setSettings(prev => ({
          ...prev,
          simplifiedUI: true,
          readingGuide: true,
          reduceMotion: true,
          fontScale: 110,
        }));
        break;
    }
    toast({ title: `Préréglage "${preset}" appliqué` });
  }, [toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              Accessibilité
            </CardTitle>
            <CardDescription>
              Personnalisez l'interface selon vos besoins
            </CardDescription>
          </div>
          <Badge variant="secondary">WCAG 2.1 AA</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Préréglages */}
        <div>
          <h3 className="font-medium mb-3">Préréglages rapides</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset('vision')}>
              <Eye className="h-4 w-4 mr-2" />
              Déficience visuelle
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('motor')}>
              <Hand className="h-4 w-4 mr-2" />
              Déficience motrice
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('cognitive')}>
              <Type className="h-4 w-4 mr-2" />
              Déficience cognitive
            </Button>
          </div>
        </div>

        {/* Vision */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4" />
            Vision
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast">Contraste élevé</Label>
                <p className="text-sm text-muted-foreground">Améliore la lisibilité</p>
              </div>
              <Switch 
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(v) => updateSetting('highContrast', v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-text">Texte agrandi</Label>
                <p className="text-sm text-muted-foreground">Taille de police augmentée</p>
              </div>
              <Switch 
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(v) => updateSetting('largeText', v)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Échelle de police</Label>
                <span className="text-sm text-muted-foreground">{settings.fontScale}%</span>
              </div>
              <Slider
                value={[settings.fontScale]}
                onValueChange={([v]) => updateSetting('fontScale', v)}
                min={75}
                max={150}
                step={5}
                aria-label="Échelle de police"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dyslexia-font">Police Dyslexie</Label>
                <p className="text-sm text-muted-foreground">Police adaptée à la dyslexie</p>
              </div>
              <Switch 
                id="dyslexia-font"
                checked={settings.dyslexiaFont}
                onCheckedChange={(v) => updateSetting('dyslexiaFont', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduce-motion">Réduire les animations</Label>
                <p className="text-sm text-muted-foreground">Désactive les animations</p>
              </div>
              <Switch 
                id="reduce-motion"
                checked={settings.reduceMotion}
                onCheckedChange={(v) => updateSetting('reduceMotion', v)}
              />
            </div>
          </div>
        </div>

        {/* Audio */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <Ear className="h-4 w-4" />
            Audio
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="screen-reader">Optimisé lecteur d'écran</Label>
                <p className="text-sm text-muted-foreground">Améliore la compatibilité ARIA</p>
              </div>
              <Switch 
                id="screen-reader"
                checked={settings.screenReaderOptimized}
                onCheckedChange={(v) => updateSetting('screenReaderOptimized', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="captions">Sous-titres automatiques</Label>
                <p className="text-sm text-muted-foreground">Active les sous-titres sur les médias</p>
              </div>
              <Switch 
                id="captions"
                checked={settings.captionsEnabled}
                onCheckedChange={(v) => updateSetting('captionsEnabled', v)}
              />
            </div>
          </div>
        </div>

        {/* Motricité */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <Hand className="h-4 w-4" />
            Motricité
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="keyboard-only">Navigation clavier uniquement</Label>
                <p className="text-sm text-muted-foreground">Améliore la navigation au clavier</p>
              </div>
              <Switch 
                id="keyboard-only"
                checked={settings.keyboardOnly}
                onCheckedChange={(v) => updateSetting('keyboardOnly', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="focus-indicators">Indicateurs de focus améliorés</Label>
                <p className="text-sm text-muted-foreground">Focus plus visible</p>
              </div>
              <Switch 
                id="focus-indicators"
                checked={settings.focusIndicators}
                onCheckedChange={(v) => updateSetting('focusIndicators', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="large-targets">Cibles de clic agrandies</Label>
                <p className="text-sm text-muted-foreground">Boutons plus grands</p>
              </div>
              <Switch 
                id="large-targets"
                checked={settings.largeClickTargets}
                onCheckedChange={(v) => updateSetting('largeClickTargets', v)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={() => toast({ title: 'Paramètres appliqués' })} className="flex-1">
            Appliquer
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

AccessibilityPanel.displayName = 'AccessibilityPanel';

export default AccessibilityPanel;
