// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Type,
  Contrast,
  Volume2,
  Hand,
  Zap
} from 'lucide-react';

const AccessibilitySettings: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [voiceOver, setVoiceOver] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [textSize, setTextSize] = useState([100]);
  const [animationSpeed, setAnimationSpeed] = useState([100]);
  const [contrastLevel, setContrastLevel] = useState([100]);
  const [language, setLanguage] = useState('fr');

  return (
    <div className="space-y-6">
      {/* Vision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibilité visuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                Contraste élevé
              </Label>
              <p className="text-sm text-muted-foreground">
                Augmente le contraste pour une meilleure lisibilité
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Taille du texte
            </Label>
            <Slider
              value={textSize}
              onValueChange={setTextSize}
              max={150}
              min={75}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Petit (75%)</span>
              <span>Normal (100%)</span>
              <span>Grand (150%)</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Niveau de contraste</Label>
            <Slider
              value={contrastLevel}
              onValueChange={setContrastLevel}
              max={200}
              min={50}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Faible</span>
              <span>Normal</span>
              <span>Élevé</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="large-text">Texte large</Label>
              <p className="text-sm text-muted-foreground">
                Utilise une police plus grande dans toute l'application
              </p>
            </div>
            <Switch
              id="large-text"
              checked={largeText}
              onCheckedChange={setLargeText}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mouvement et animations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Mouvement et animations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduce-motion">Réduire les mouvements</Label>
              <p className="text-sm text-muted-foreground">
                Diminue les animations pour réduire les troubles vestibulaires
              </p>
            </div>
            <Switch
              id="reduce-motion"
              checked={reduceMotion}
              onCheckedChange={setReduceMotion}
            />
          </div>

          <div className="space-y-3">
            <Label>Vitesse d'animation</Label>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={200}
              min={25}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Lente</span>
              <span>Normale</span>
              <span>Rapide</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ear className="h-5 w-5" />
            Accessibilité audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-over">Synthèse vocale</Label>
              <p className="text-sm text-muted-foreground">
                Lecture audio des éléments de l'interface
              </p>
            </div>
            <Switch
              id="voice-over"
              checked={voiceOver}
              onCheckedChange={setVoiceOver}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-effects" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Effets sonores
              </Label>
              <p className="text-sm text-muted-foreground">
                Sons de feedback pour les actions utilisateur
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={soundEffects}
              onCheckedChange={setSoundEffects}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-navigation">Navigation clavier</Label>
              <p className="text-sm text-muted-foreground">
                Permet la navigation complète au clavier
              </p>
            </div>
            <Switch
              id="keyboard-navigation"
              checked={keyboardNavigation}
              onCheckedChange={setKeyboardNavigation}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptic-feedback" className="flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Retour haptique
              </Label>
              <p className="text-sm text-muted-foreground">
                Vibrations pour confirmer les actions (mobile)
              </p>
            </div>
            <Switch
              id="haptic-feedback"
              checked={hapticFeedback}
              onCheckedChange={setHapticFeedback}
            />
          </div>
        </CardContent>
      </Card>

      {/* Langue */}
      <Card>
        <CardHeader>
          <CardTitle>Langue et région</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Langue de l'interface</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test d'accessibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Test d'accessibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vérifiez que vos paramètres d'accessibilité fonctionnent correctement
            </p>
            <Button className="w-full">Lancer le test d'accessibilité</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;
