// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wand2, 
  Clock, 
  Volume2, 
  Shuffle, 
  Brain,
  Headphones,
  Waves,
  Wind,
  Mic,
  Settings,
  Sparkles,
  Target,
  Play
} from 'lucide-react';
import { MoodProfile } from '@/types/mood-mixer';

interface MixCreatorProps {
  selectedMood: MoodProfile | null;
  availableMoods: MoodProfile[];
  isCreating: boolean;
  onCreateMix: (mood: MoodProfile, settings: any) => void;
}

const MixCreator: React.FC<MixCreatorProps> = ({ 
  selectedMood, 
  availableMoods, 
  isCreating, 
  onCreateMix 
}) => {
  const [mixSettings, setMixSettings] = useState({
    targetDuration: [30],
    crossfadeDuration: [3],
    autoTransition: true,
    binaural: false,
    spatialAudio: true,
    adaptiveVolume: true,
    emotionalProgression: 'ascending',
    includeNarration: false,
    includeBreathing: false,
    includeNatureSounds: true,
    secondaryMoods: [] as string[],
    customName: '',
    customDescription: ''
  });

  const [creationStep, setCreationStep] = useState(1);
  const maxSteps = 4;

  const progressionOptions = [
    { value: 'stable', label: 'Stable', description: 'Maintient la même énergie', icon: '━' },
    { value: 'ascending', label: 'Montante', description: 'Énergie croissante', icon: '📈' },
    { value: 'descending', label: 'Descendante', description: 'Énergie décroissante', icon: '📉' },
    { value: 'wave', label: 'Vague', description: 'Énergie en vagues', icon: '〰️' }
  ];

  const handleSettingChange = (setting: string, value: any) => {
    setMixSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const toggleSecondaryMood = (moodId: string) => {
    setMixSettings(prev => ({
      ...prev,
      secondaryMoods: prev.secondaryMoods.includes(moodId)
        ? prev.secondaryMoods.filter(id => id !== moodId)
        : [...prev.secondaryMoods, moodId]
    }));
  };

  const handleCreateMix = () => {
    if (!selectedMood) return;
    
    const settings = {
      targetDuration: mixSettings.targetDuration[0],
      crossfadeDuration: mixSettings.crossfadeDuration[0],
      autoTransition: mixSettings.autoTransition,
      binaural: mixSettings.binaural,
      spatialAudio: mixSettings.spatialAudio,
      adaptiveVolume: mixSettings.adaptiveVolume,
      emotionalProgression: mixSettings.emotionalProgression,
      includeNarration: mixSettings.includeNarration,
      includeBreathing: mixSettings.includeBreathing,
      includeNatureSounds: mixSettings.includeNatureSounds,
      secondaryMoods: mixSettings.secondaryMoods,
      customName: mixSettings.customName || `Mix ${selectedMood.name}`,
      customDescription: mixSettings.customDescription || `Mix généré pour l'humeur ${selectedMood.name}`
    };

    onCreateMix(selectedMood, settings);
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Configuration de base';
      case 2: return 'Humeurs complémentaires';
      case 3: return 'Options avancées';
      case 4: return 'Finalisation';
      default: return 'Configuration';
    }
  };

  if (!selectedMood) {
    return (
      <div className="text-center py-12">
        <Wand2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Créateur de Mix IA</h3>
        <p className="text-muted-foreground mb-4">
          Sélectionnez d'abord une humeur pour commencer la création
        </p>
        <Button variant="outline" onClick={() => {}}>
          <Target className="h-4 w-4 mr-2" />
          Choisir une Humeur
        </Button>
      </div>
    );
  }

  if (isCreating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Sparkles className="h-16 w-16 mx-auto text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Création en cours...</h3>
        <p className="text-muted-foreground mb-6">
          L'IA compose votre mix personnalisé pour l'humeur "{selectedMood.name}"
        </p>
        <div className="max-w-md mx-auto space-y-2">
          <div className="text-sm text-muted-foreground">Étapes de création :</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Analyse de votre profil émotionnel
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Sélection des pistes adaptées
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Génération des transitions IA
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted rounded-full" />
              Optimisation finale
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec humeur sélectionnée */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selectedMood.icon}</div>
              <div>
                <h2 className="text-xl font-bold">Créer un mix "{selectedMood.name}"</h2>
                <p className="text-muted-foreground">{selectedMood.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progression</div>
              <div className="text-lg font-bold">{creationStep}/{maxSteps}</div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(creationStep / maxSteps) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Étapes de création */}
      <AnimatePresence mode="wait">
        <motion.div
          key={creationStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {getStepTitle(creationStep)}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Étape 1: Configuration de base */}
              {creationStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Durée du mix: {mixSettings.targetDuration[0]} minutes
                    </Label>
                    <Slider
                      value={mixSettings.targetDuration}
                      onValueChange={(value) => handleSettingChange('targetDuration', value)}
                      max={120}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 min</span>
                      <span>60 min</span>
                      <span>120 min</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Durée des transitions: {mixSettings.crossfadeDuration[0]} secondes
                    </Label>
                    <Slider
                      value={mixSettings.crossfadeDuration}
                      onValueChange={(value) => handleSettingChange('crossfadeDuration', value)}
                      max={10}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4" />
                        Transitions automatiques
                      </Label>
                      <Switch
                        checked={mixSettings.autoTransition}
                        onCheckedChange={(checked) => handleSettingChange('autoTransition', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Volume adaptatif
                      </Label>
                      <Switch
                        checked={mixSettings.adaptiveVolume}
                        onCheckedChange={(checked) => handleSettingChange('adaptiveVolume', checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Humeurs complémentaires */}
              {creationStep === 2 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Ajoutez d'autres humeurs pour enrichir votre mix et créer des variations
                  </p>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    {availableMoods
                      .filter(mood => mood.id !== selectedMood.id)
                      .map((mood) => (
                        <div
                          key={mood.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            mixSettings.secondaryMoods.includes(mood.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => toggleSecondaryMood(mood.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{mood.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium">{mood.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Énergie {mood.energyLevel}/10
                              </div>
                            </div>
                            {mixSettings.secondaryMoods.includes(mood.id) && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {mixSettings.secondaryMoods.length > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-2">Humeurs sélectionnées:</div>
                      <div className="flex gap-2">
                        {mixSettings.secondaryMoods.map((moodId) => {
                          const mood = availableMoods.find(m => m.id === moodId);
                          return mood ? (
                            <Badge key={moodId} variant="secondary">
                              {mood.icon} {mood.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 3: Options avancées */}
              {creationStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Progression émotionnelle</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {progressionOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            mixSettings.emotionalProgression === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => handleSettingChange('emotionalProgression', option.value)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{option.icon}</span>
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Éléments sonores additionnels</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Headphones className="h-4 w-4" />
                          Audio binaural
                        </Label>
                        <Switch
                          checked={mixSettings.binaural}
                          onCheckedChange={(checked) => handleSettingChange('binaural', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Waves className="h-4 w-4" />
                          Audio spatial
                        </Label>
                        <Switch
                          checked={mixSettings.spatialAudio}
                          onCheckedChange={(checked) => handleSettingChange('spatialAudio', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Wind className="h-4 w-4" />
                          Sons de nature
                        </Label>
                        <Switch
                          checked={mixSettings.includeNatureSounds}
                          onCheckedChange={(checked) => handleSettingChange('includeNatureSounds', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Narration guidée
                        </Label>
                        <Switch
                          checked={mixSettings.includeNarration}
                          onCheckedChange={(checked) => handleSettingChange('includeNarration', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 4: Finalisation */}
              {creationStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customName">Nom du mix (optionnel)</Label>
                    <Input
                      id="customName"
                      placeholder={`Mix ${selectedMood.name} - ${new Date().toLocaleDateString()}`}
                      value={mixSettings.customName}
                      onChange={(e) => handleSettingChange('customName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDescription">Description (optionnelle)</Label>
                    <Textarea
                      id="customDescription"
                      placeholder="Décrivez l'intention de ce mix..."
                      value={mixSettings.customDescription}
                      onChange={(e) => handleSettingChange('customDescription', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Résumé de la configuration */}
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Résumé de votre mix</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Humeur principale:</span>
                        <span>{selectedMood.icon} {selectedMood.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span>{mixSettings.targetDuration[0]} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progression:</span>
                        <span>{progressionOptions.find(p => p.value === mixSettings.emotionalProgression)?.label}</span>
                      </div>
                      {mixSettings.secondaryMoods.length > 0 && (
                        <div className="flex justify-between">
                          <span>Humeurs complémentaires:</span>
                          <span>{mixSettings.secondaryMoods.length}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCreationStep(Math.max(1, creationStep - 1))}
          disabled={creationStep === 1}
        >
          Précédent
        </Button>
        
        {creationStep < maxSteps ? (
          <Button
            onClick={() => setCreationStep(Math.min(maxSteps, creationStep + 1))}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleCreateMix}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Play className="h-4 w-4 mr-2" />
            Créer le Mix
          </Button>
        )}
      </div>
    </div>
  );
};

export default MixCreator;