/**
 * ⚙️ ACCESSIBILITY SETTINGS - EmotionsCare
 * Panneau de configuration des préférences d'accessibilité
 */

import React from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Zap, 
  Type, 
  Volume2, 
  Keyboard, 
  Mic,
  Info
} from 'lucide-react';

const ACCESSIBILITY_OPTIONS = [
  {
    key: 'highContrast' as const,
    label: 'Contraste élevé',
    description: 'Améliore la lisibilité avec des couleurs plus contrastées',
    icon: Eye,
  },
  {
    key: 'reducedMotion' as const,
    label: 'Mouvement réduit',
    description: 'Diminue les animations et transitions pour le confort visuel',
    icon: Zap,
  },
  {
    key: 'largeText' as const,
    label: 'Texte agrandi',
    description: 'Augmente la taille des textes pour une meilleure lisibilité',
    icon: Type,
  },
  {
    key: 'screenReader' as const,
    label: 'Lecteur d\'écran',
    description: 'Optimise l\'expérience pour les technologies d\'assistance',
    icon: Volume2,
  },
  {
    key: 'keyboardNavigation' as const,
    label: 'Navigation clavier',
    description: 'Active les raccourcis clavier et l\'amélioration de la navigation',
    icon: Keyboard,
  },
  {
    key: 'voiceCommands' as const,
    label: 'Commandes vocales',
    description: 'Permet de contrôler l\'application par la voix',
    icon: Mic,
  },
];

interface AccessibilitySettingsProps {
  className?: string;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ 
  className = "" 
}) => {
  const { state, updatePreference, announce } = useAccessibility();

  const handleToggle = (key: keyof typeof state, value: boolean) => {
    updatePreference(key, value);
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Accessibilité
        </CardTitle>
        <CardDescription>
          Personnalisez votre expérience pour une utilisation optimale d'EmotionsCare
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {ACCESSIBILITY_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isEnabled = state[option.key];
          
          return (
            <div key={option.key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="space-y-1 flex-1">
                    <Label 
                      htmlFor={`accessibility-${option.key}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <Switch
                  id={`accessibility-${option.key}`}
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleToggle(option.key, checked)}
                  aria-describedby={`${option.key}-description`}
                />
              </div>
              
              {index < ACCESSIBILITY_OPTIONS.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Raccourcis clavier utiles :</p>
              <ul className="space-y-1 text-xs">
                <li><kbd className="px-1 py-0.5 bg-background rounded">Alt + M</kbd> : Menu principal</li>
                <li><kbd className="px-1 py-0.5 bg-background rounded">Alt + S</kbd> : Recherche</li>
                <li><kbd className="px-1 py-0.5 bg-background rounded">Alt + C</kbd> : Contenu principal</li>
                <li><kbd className="px-1 py-0.5 bg-background rounded">F1</kbd> : Aide contextuelle</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};