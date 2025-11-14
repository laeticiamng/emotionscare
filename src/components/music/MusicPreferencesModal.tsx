/**
 * Modal questionnaire préférences musicales
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Music2, Heart, MapPin, Volume2 } from 'lucide-react';
import { saveUserPreferences, MUSIC_PREFERENCES_OPTIONS, type PreferencesFormData } from '@/services/music/preferences-service';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface MusicPreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MusicPreferencesModal: React.FC<MusicPreferencesModalProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tempoRange, setTempoRange] = useState<[number, number]>([80, 140]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(50);
  const [instrumentalPref, setInstrumentalPref] = useState<'instrumental' | 'vocal' | 'both'>('both');

  const toggleSelection = (value: string, selectedArray: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedArray.includes(value)) {
      setArray(selectedArray.filter(v => v !== value));
    } else {
      setArray([...selectedArray, value]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (selectedGenres.length === 0) {
      toast.error('Sélectionnez au moins un genre musical');
      return;
    }
    if (selectedMoods.length === 0) {
      toast.error('Sélectionnez au moins un mood');
      return;
    }
    if (selectedContexts.length === 0) {
      toast.error('Sélectionnez au moins un contexte d\'écoute');
      return;
    }

    setIsSubmitting(true);

    try {
      const preferences: PreferencesFormData = {
        genres: selectedGenres,
        tempoRange: { min: tempoRange[0], max: tempoRange[1] },
        moods: selectedMoods,
        contexts: selectedContexts,
        energyLevel,
        instrumentalPreference: instrumentalPref,
      };

      const result = await saveUserPreferences(preferences);

      if (result.success) {
        toast.success('Préférences sauvegardées avec succès !');
        logger.info('Music preferences saved successfully', { 
          genresCount: selectedGenres.length,
          moodsCount: selectedMoods.length 
        }, 'MUSIC');
        onComplete();
        onClose();
      } else {
        toast.error(`Erreur : ${result.error}`);
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
      logger.error('Failed to save preferences', error as Error, 'MUSIC');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return selectedGenres.length > 0;
      case 2:
        return true; // Tempo has default values
      case 3:
        return selectedMoods.length > 0;
      case 4:
        return selectedContexts.length > 0;
      case 5:
        return true; // Energy + instrumental have defaults
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>Personnalisons votre expérience musicale</DialogTitle>
          </div>
          <DialogDescription>
            Étape {step} sur 5 - Aidez-nous à vous recommander la musique parfaite
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* STEP 1: Genres */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music2 className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Quels genres musicaux préférez-vous ?</Label>
              </div>
              <p className="text-sm text-muted-foreground">Sélectionnez tous ceux qui vous plaisent</p>
              <div className="grid grid-cols-2 gap-3">
                {MUSIC_PREFERENCES_OPTIONS.genres.map((genre) => (
                  <Badge
                    key={genre.value}
                    variant={selectedGenres.includes(genre.value) ? 'default' : 'outline'}
                    className="cursor-pointer py-3 justify-center text-base transition-all hover:scale-105"
                    onClick={() => toggleSelection(genre.value, selectedGenres, setSelectedGenres)}
                  >
                    <span className="mr-2">{genre.icon}</span>
                    {genre.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Tempo */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Quel tempo préférez-vous ?</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                De {tempoRange[0]} à {tempoRange[1]} BPM
              </p>
              <div className="pt-6 pb-2">
                <Slider
                  value={tempoRange}
                  onValueChange={(value) => setTempoRange(value as [number, number])}
                  min={60}
                  max={180}
                  step={10}
                  minStepsBetweenThumbs={2}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lent (60 BPM)</span>
                <span>Modéré (120 BPM)</span>
                <span>Rapide (180 BPM)</span>
              </div>
            </div>
          )}

          {/* STEP 3: Moods */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Quels moods recherchez-vous ?</Label>
              </div>
              <p className="text-sm text-muted-foreground">Choisissez vos ambiances favorites</p>
              <div className="grid grid-cols-2 gap-3">
                {MUSIC_PREFERENCES_OPTIONS.moods.map((mood) => (
                  <Badge
                    key={mood.value}
                    variant={selectedMoods.includes(mood.value) ? 'default' : 'outline'}
                    className="cursor-pointer py-3 justify-center text-base transition-all hover:scale-105"
                    onClick={() => toggleSelection(mood.value, selectedMoods, setSelectedMoods)}
                  >
                    <span className="mr-2">{mood.icon}</span>
                    {mood.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Contexts */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Dans quels contextes écoutez-vous ?</Label>
              </div>
              <p className="text-sm text-muted-foreground">Sélectionnez vos situations d'écoute</p>
              <div className="grid grid-cols-2 gap-3">
                {MUSIC_PREFERENCES_OPTIONS.contexts.map((context) => (
                  <Badge
                    key={context.value}
                    variant={selectedContexts.includes(context.value) ? 'default' : 'outline'}
                    className="cursor-pointer py-3 justify-center text-base transition-all hover:scale-105"
                    onClick={() => toggleSelection(context.value, selectedContexts, setSelectedContexts)}
                  >
                    <span className="mr-2">{context.icon}</span>
                    {context.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Energy + Instrumental */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Niveau d'énergie préféré</Label>
                <p className="text-sm text-muted-foreground">
                  {energyLevel}% - {energyLevel < 33 ? 'Calme' : energyLevel < 66 ? 'Modéré' : 'Énergique'}
                </p>
                <Slider
                  value={[energyLevel]}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Préférence voix/instrumental</Label>
                <RadioGroup value={instrumentalPref} onValueChange={(val) => setInstrumentalPref(val as typeof instrumentalPref)}>
                  {MUSIC_PREFERENCES_OPTIONS.instrumentalPreference.map((pref) => (
                    <div key={pref.value} className="flex items-center space-x-3 cursor-pointer">
                      <RadioGroupItem value={pref.value} id={pref.value} />
                      <Label htmlFor={pref.value} className="cursor-pointer text-base">
                        <span className="mr-2">{pref.icon}</span>
                        {pref.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-0">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
            >
              Précédent
            </Button>
          )}
          
          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="sm:ml-auto"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canGoNext()}
              className="sm:ml-auto"
            >
              {isSubmitting ? 'Enregistrement...' : 'Terminer'}
            </Button>
          )}
        </DialogFooter>

        {/* Progress indicator */}
        <div className="flex gap-1 justify-center mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
