/**
 * ScanCalibration - Calibration personnalisée par utilisateur
 * Ajuste les paramètres d'analyse selon le profil émotionnel de base
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, Target, Save, RotateCcw, 
  Smile, Frown, Zap, Heart, Brain 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalibrationSettings {
  baselineMood: number;
  sensitivityLevel: number;
  emotionalRange: [number, number];
  dominantEmotions: string[];
  stressThreshold: number;
  energyBaseline: number;
}

interface ScanCalibrationProps {
  userId?: string;
  onSave?: (settings: CalibrationSettings) => void;
  initialSettings?: Partial<CalibrationSettings>;
}

const DEFAULT_SETTINGS: CalibrationSettings = {
  baselineMood: 50,
  sensitivityLevel: 50,
  emotionalRange: [30, 70],
  dominantEmotions: [],
  stressThreshold: 60,
  energyBaseline: 50
};

const EMOTION_OPTIONS = [
  { id: 'joy', label: 'Joie', icon: Smile, color: 'bg-yellow-500' },
  { id: 'sadness', label: 'Tristesse', icon: Frown, color: 'bg-blue-500' },
  { id: 'energy', label: 'Énergie', icon: Zap, color: 'bg-orange-500' },
  { id: 'calm', label: 'Calme', icon: Heart, color: 'bg-green-500' },
  { id: 'focus', label: 'Concentration', icon: Brain, color: 'bg-purple-500' }
];

const ScanCalibration = memo(({ userId, onSave, initialSettings }: ScanCalibrationProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<CalibrationSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings
  });
  const [saving, setSaving] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateSetting = <K extends keyof CalibrationSettings>(
    key: K, 
    value: CalibrationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleEmotion = (emotionId: string) => {
    setSettings(prev => {
      const current = prev.dominantEmotions;
      if (current.includes(emotionId)) {
        return { ...prev, dominantEmotions: current.filter(e => e !== emotionId) };
      }
      if (current.length < 3) {
        return { ...prev, dominantEmotions: [...current, emotionId] };
      }
      return prev;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.(settings);
      toast({
        title: 'Calibration sauvegardée',
        description: 'Vos paramètres personnalisés ont été enregistrés'
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la calibration',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setStep(1);
    toast({ title: 'Réinitialisé', description: 'Paramètres par défaut restaurés' });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Humeur de base</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comment décririez-vous votre humeur habituelle au quotidien ?
              </p>
              <div className="space-y-4">
                <Slider
                  value={[settings.baselineMood]}
                  onValueChange={([v]) => updateSetting('baselineMood', v)}
                  min={0}
                  max={100}
                  step={5}
                  aria-label="Humeur de base"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Plutôt bas</span>
                  <span className="font-medium">{settings.baselineMood}%</span>
                  <span>Plutôt haut</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Sensibilité émotionnelle</h3>
              <p className="text-sm text-muted-foreground mb-4">
                À quel point réagissez-vous aux variations émotionnelles ?
              </p>
              <Slider
                value={[settings.sensitivityLevel]}
                onValueChange={([v]) => updateSetting('sensitivityLevel', v)}
                min={0}
                max={100}
                step={5}
                aria-label="Sensibilité émotionnelle"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Peu sensible</span>
                <span className="font-medium">{settings.sensitivityLevel}%</span>
                <span>Très sensible</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Seuil de stress</h3>
              <p className="text-sm text-muted-foreground mb-4">
                À partir de quel niveau souhaitez-vous être alerté(e) ?
              </p>
              <Slider
                value={[settings.stressThreshold]}
                onValueChange={([v]) => updateSetting('stressThreshold', v)}
                min={20}
                max={90}
                step={5}
                aria-label="Seuil de stress"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Alertes fréquentes</span>
                <span className="font-medium">{settings.stressThreshold}%</span>
                <span>Alertes rares</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Émotions dominantes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sélectionnez jusqu'à 3 émotions qui vous caractérisent le plus
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EMOTION_OPTIONS.map(emotion => {
                  const Icon = emotion.icon;
                  const isSelected = settings.dominantEmotions.includes(emotion.id);
                  return (
                    <button
                      key={emotion.id}
                      onClick={() => toggleEmotion(emotion.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className={`p-2 rounded-full ${emotion.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{emotion.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {settings.dominantEmotions.length}/3 sélectionnées
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Niveau d'énergie habituel</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comment évaluez-vous votre énergie typique ?
              </p>
              <Slider
                value={[settings.energyBaseline]}
                onValueChange={([v]) => updateSetting('energyBaseline', v)}
                min={0}
                max={100}
                step={5}
                aria-label="Niveau d'énergie"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Faible</span>
                <span className="font-medium">{settings.energyBaseline}%</span>
                <span>Élevé</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3">Résumé de votre calibration</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Humeur de base:</div>
                <div className="font-medium">{settings.baselineMood}%</div>
                <div>Sensibilité:</div>
                <div className="font-medium">{settings.sensitivityLevel}%</div>
                <div>Seuil stress:</div>
                <div className="font-medium">{settings.stressThreshold}%</div>
                <div>Énergie:</div>
                <div className="font-medium">{settings.energyBaseline}%</div>
                <div>Émotions:</div>
                <div className="font-medium">
                  {settings.dominantEmotions.length > 0 
                    ? settings.dominantEmotions.join(', ') 
                    : 'Non définies'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Calibration personnalisée
            </CardTitle>
            <CardDescription>
              Étape {step} sur {totalSteps}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
        <Progress value={progress} className="mt-2" aria-label="Progression calibration" />
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Précédent
          </Button>

          {step < totalSteps ? (
            <Button onClick={() => setStep(s => s + 1)}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>Sauvegarde...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ScanCalibration.displayName = 'ScanCalibration';

export default ScanCalibration;
