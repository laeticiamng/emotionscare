/**
 * Modal questionnaire préférences musicales avec animations
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m, AnimatePresence } from '@/utils/lazy-motion';
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
import { Sparkles, Music2, Heart, MapPin, Volume2, Check } from '@/components/music/icons';
import { saveUserPreferences, MUSIC_PREFERENCES_OPTIONS, type PreferencesFormData } from '@/services/music/preferences-service';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import ConfettiCelebration from '@/components/effects/ConfettiCelebration';

interface MusicPreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SelectableBadge: React.FC<{isSelected: boolean; onClick: () => void; icon: string; label: string}> = ({ isSelected, onClick, icon, label }) => (
  <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className="cursor-pointer py-3 w-full justify-center text-base transition-all relative"
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
      {isSelected && <m.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1"><Check className="w-4 h-4" /></m.div>}
    </Badge>
  </m.div>
);

export const MusicPreferencesModal: React.FC<MusicPreferencesModalProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
    if (selectedGenres.length === 0 || selectedMoods.length === 0 || selectedContexts.length === 0) {
      toast.error('Complétez toutes les étapes');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveUserPreferences({
        genres: selectedGenres,
        tempoRange: { min: tempoRange[0], max: tempoRange[1] },
        moods: selectedMoods,
        contexts: selectedContexts,
        energyLevel,
        instrumentalPreference: instrumentalPref,
      });

      if (result.success) {
        setShowConfetti(true);
        toast.success('🎉 Préférences sauvegardées !');
        setTimeout(() => { onComplete(); onClose(); }, 2000);
      } else {
        toast.error(`Erreur : ${result.error}`);
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    if (step === 1) return selectedGenres.length > 0;
    if (step === 3) return selectedMoods.length > 0;
    if (step === 4) return selectedContexts.length > 0;
    return true;
  };

  return (
    <LazyMotionWrapper>
      <>
        <ConfettiCelebration trigger={showConfetti} duration={3000} />
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <DialogTitle>Personnalisons votre expérience musicale</DialogTitle>
            </div>
            <DialogDescription>Étape {step} sur 5</DialogDescription>
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <m.div className="bg-primary h-2 rounded-full" animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait">
            <m.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 py-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Music2 className="h-5 w-5" /><Label className="text-base font-medium">Quels genres musicaux préférez-vous ?</Label></div>
                  <div className="grid grid-cols-2 gap-3">
                    {MUSIC_PREFERENCES_OPTIONS.genres.map((genre) => (
                      <SelectableBadge key={genre.value} isSelected={selectedGenres.includes(genre.value)} onClick={() => toggleSelection(genre.value, selectedGenres, setSelectedGenres)} icon={genre.icon} label={genre.label} />
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Volume2 className="h-5 w-5" /><Label>Quel tempo préférez-vous ?</Label></div>
                  <p className="text-sm text-muted-foreground">De {tempoRange[0]} à {tempoRange[1]} BPM</p>
                  <Slider value={tempoRange} onValueChange={(value) => setTempoRange(value as [number, number])} min={60} max={180} step={10} minStepsBetweenThumbs={2} />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Heart className="h-5 w-5" /><Label>Quels moods recherchez-vous ?</Label></div>
                  <div className="grid grid-cols-2 gap-3">
                    {MUSIC_PREFERENCES_OPTIONS.moods.map((mood) => (
                      <SelectableBadge key={mood.value} isSelected={selectedMoods.includes(mood.value)} onClick={() => toggleSelection(mood.value, selectedMoods, setSelectedMoods)} icon={mood.icon} label={mood.label} />
                    ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /><Label>Dans quels contextes écoutez-vous ?</Label></div>
                  <div className="grid grid-cols-2 gap-3">
                    {MUSIC_PREFERENCES_OPTIONS.contexts.map((ctx) => (
                      <SelectableBadge key={ctx.value} isSelected={selectedContexts.includes(ctx.value)} onClick={() => toggleSelection(ctx.value, selectedContexts, setSelectedContexts)} icon={ctx.icon} label={ctx.label} />
                    ))}
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Niveau d'énergie préféré: {energyLevel}%</Label>
                    <Slider value={[energyLevel]} onValueChange={(v) => setEnergyLevel(v[0])} min={0} max={100} step={5} />
                  </div>
                  <div className="space-y-4">
                    <Label>Préférence vocale</Label>
                    <RadioGroup value={instrumentalPref} onValueChange={(v: any) => setInstrumentalPref(v)}>
                      {MUSIC_PREFERENCES_OPTIONS.instrumentalPreference.map((p) => (
                        <div key={p.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={p.value} id={p.value} />
                          <Label htmlFor={p.value} className="cursor-pointer">{p.icon} {p.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </m.div>
          </AnimatePresence>

          <DialogFooter className="flex flex-row justify-between">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>Précédent</Button>
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canGoNext()}>Suivant</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !canGoNext()}>{isSubmitting ? 'Enregistrement...' : 'Terminer'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
    </LazyMotionWrapper>
  );
};
