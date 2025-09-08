/**
 * ACCESSIBILITY PANEL - Interface de contrôle d'accessibilité premium
 */

import React, { useState } from 'react';
import { useAccessibilityManager } from '@/core/AccessibilityManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Keyboard, 
  Contrast,
  ZoomIn,
  ZoomOut,
  Pause,
  Play,
  Settings,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onToggle }) => {
  const { state, updatePreferences, announce, runAccessibilityAudit } = useAccessibilityManager();
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const handleAudit = async () => {
    setIsRunningAudit(true);
    announce('Audit d\'accessibilité en cours...', 'polite');
    
    // Simulation d'un délai pour l'audit
    setTimeout(() => {
      const result = runAccessibilityAudit();
      setAuditResult(result);
      setIsRunningAudit(false);
      announce(`Audit terminé. Score: ${result.score}/100, Niveau WCAG: ${result.wcagLevel}`, 'assertive');
    }, 2000);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferences({ [key]: value });
    announce(`${key} ${value ? 'activé' : 'désactivé'}`, 'polite');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-premium"
        aria-label="Ouvrir le panneau d'accessibilité"
      >
        <Settings className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onToggle}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-premium-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader className="sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Accessibilité Premium
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                aria-label="Fermer le panneau"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Audit d'accessibilité */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Audit WCAG
              </h3>
              
              <Button
                onClick={handleAudit}
                disabled={isRunningAudit}
                className="w-full mb-4"
                variant="outline"
              >
                {isRunningAudit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Audit en cours...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Lancer l'audit
                  </>
                )}
              </Button>

              {auditResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score d'accessibilité</span>
                    <Badge variant={auditResult.score >= 80 ? 'default' : 'secondary'}>
                      {auditResult.score}/100 - WCAG {auditResult.wcagLevel}
                    </Badge>
                  </div>
                  
                  <Progress value={auditResult.score} className="h-2" />
                  
                  {auditResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Issues détectées:</p>
                      {auditResult.issues.slice(0, 3).map((issue: any, index: number) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{issue.description}</p>
                            {issue.fix && <p className="text-muted-foreground">{issue.fix}</p>}
                          </div>
                        </div>
                      ))}
                      {auditResult.issues.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{auditResult.issues.length - 3} autres issues...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            <Separator />

            {/* Préférences visuelles */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vision
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="high-contrast" className="text-sm font-medium">
                    Contraste élevé
                  </label>
                  <Switch
                    id="high-contrast"
                    checked={state.preferences.highContrast}
                    onCheckedChange={(checked) => handlePreferenceChange('highContrast', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    Taille du texte
                    <span className="text-xs text-muted-foreground">
                      {Math.round(state.preferences.largeText * 100)}%
                    </span>
                  </label>
                  <Slider
                    value={[state.preferences.largeText]}
                    onValueChange={([value]) => handlePreferenceChange('largeText', value)}
                    min={0.75}
                    max={2.0}
                    step={0.25}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Support daltonisme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'none', label: 'Aucun' },
                      { value: 'protanopia', label: 'Protanopie' },
                      { value: 'deuteranopia', label: 'Deutéranopie' },
                      { value: 'tritanopia', label: 'Tritanopie' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={state.preferences.colorBlindSupport === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePreferenceChange('colorBlindSupport', option.value)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Préférences de mouvement */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Pause className="h-5 w-5" />
                Mouvement
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="reduced-motion" className="text-sm font-medium">
                    Mouvement réduit
                  </label>
                  <Switch
                    id="reduced-motion"
                    checked={state.preferences.reducedMotion}
                    onCheckedChange={(checked) => handlePreferenceChange('reducedMotion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="no-autoplay" className="text-sm font-medium">
                    Pas de lecture auto
                  </label>
                  <Switch
                    id="no-autoplay"
                    checked={state.preferences.noAutoplay}
                    onCheckedChange={(checked) => handlePreferenceChange('noAutoplay', checked)}
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Préférences de navigation */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Navigation
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="keyboard-navigation" className="text-sm font-medium">
                    Navigation clavier
                  </label>
                  <Switch
                    id="keyboard-navigation"
                    checked={state.preferences.keyboardOnlyNavigation}
                    onCheckedChange={(checked) => handlePreferenceChange('keyboardOnlyNavigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="enhanced-focus" className="text-sm font-medium">
                    Focus amélioré
                  </label>
                  <Switch
                    id="enhanced-focus"
                    checked={state.preferences.focusIndicatorEnhanced}
                    onCheckedChange={(checked) => handlePreferenceChange('focusIndicatorEnhanced', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="screen-reader-optimized" className="text-sm font-medium">
                    Optimisé lecteur d'écran
                  </label>
                  <Switch
                    id="screen-reader-optimized"
                    checked={state.preferences.screenReaderOptimized}
                    onCheckedChange={(checked) => handlePreferenceChange('screenReaderOptimized', checked)}
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Interface cognitive */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Interface cognitive
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="simplified-interface" className="text-sm font-medium">
                    Interface simplifiée
                  </label>
                  <Switch
                    id="simplified-interface"
                    checked={state.preferences.simplifiedInterface}
                    onCheckedChange={(checked) => handlePreferenceChange('simplifiedInterface', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="reading-assistance" className="text-sm font-medium">
                    Aide à la lecture
                  </label>
                  <Switch
                    id="reading-assistance"
                    checked={state.preferences.readingAssistance}
                    onCheckedChange={(checked) => handlePreferenceChange('readingAssistance', checked)}
                  />
                </div>
              </div>
            </section>

            {/* Détection automatique */}
            {Object.values(state.detectedNeeds).some(Boolean) && (
              <>
                <Separator />
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Détecté automatiquement
                  </h3>
                  
                  <div className="space-y-2">
                    {state.detectedNeeds.hasHighContrastPreference && (
                      <Badge variant="outline" className="w-full justify-start">
                        Préférence contraste élevé détectée
                      </Badge>
                    )}
                    {state.detectedNeeds.hasReducedMotionPreference && (
                      <Badge variant="outline" className="w-full justify-start">
                        Préférence mouvement réduit détectée
                      </Badge>
                    )}
                    {state.detectedNeeds.hasScreenReader && (
                      <Badge variant="outline" className="w-full justify-start">
                        Lecteur d'écran détecté
                      </Badge>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Actions rapides */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreferences({
                      highContrast: true,
                      focusIndicatorEnhanced: true,
                      largeText: 1.25
                    });
                    announce('Mode haute visibilité activé');
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Haute visibilité
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreferences({
                      keyboardOnlyNavigation: true,
                      focusIndicatorEnhanced: true,
                      screenReaderOptimized: true
                    });
                    announce('Mode navigation clavier activé');
                  }}
                >
                  <Keyboard className="h-4 w-4 mr-1" />
                  Mode clavier
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreferences({
                      reducedMotion: true,
                      noAutoplay: true,
                      simplifiedInterface: true
                    });
                    announce('Mode concentration activé');
                  }}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Concentration
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreferences({
                      highContrast: false,
                      reducedMotion: false,
                      largeText: 1.0,
                      colorBlindSupport: 'none',
                      keyboardOnlyNavigation: false,
                      focusIndicatorEnhanced: false
                    });
                    announce('Paramètres réinitialisés');
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessibilityPanel;