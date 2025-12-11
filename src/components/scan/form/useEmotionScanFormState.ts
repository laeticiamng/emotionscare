// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { EmotionResult } from '@/types';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'emotion-scan-draft';

interface EmotionScanFormState {
  step: number;
  emotionResult: EmotionResult | null;
  selectedTriggers: string[];
  notes: string;
  isSubmitting: boolean;
  error: string | null;
  lastSaved: Date | null;
}

interface UseEmotionScanFormStateReturn {
  state: EmotionScanFormState;
  setStep: (step: number) => void;
  setEmotionResult: (result: EmotionResult | null) => void;
  setSelectedTriggers: (triggers: string[]) => void;
  setNotes: (notes: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  handleSave: () => Promise<void>;
  saveDraft: () => void;
  loadDraft: () => boolean;
  clearDraft: () => void;
  isValid: boolean;
  canProceed: boolean;
}

const initialState: EmotionScanFormState = {
  step: 1,
  emotionResult: null,
  selectedTriggers: [],
  notes: '',
  isSubmitting: false,
  error: null,
  lastSaved: null
};

export function useEmotionScanFormState(): UseEmotionScanFormStateReturn {
  const { toast } = useToast();
  const [state, setState] = useState<EmotionScanFormState>(initialState);

  // Auto-load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
          lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
          isSubmitting: false,
          error: null
        }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft when state changes
  useEffect(() => {
    if (state.emotionResult || state.selectedTriggers.length > 0 || state.notes) {
      const draft = {
        step: state.step,
        emotionResult: state.emotionResult,
        selectedTriggers: state.selectedTriggers,
        notes: state.notes,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [state.emotionResult, state.selectedTriggers, state.notes, state.step]);

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setEmotionResult = useCallback((emotionResult: EmotionResult | null) => {
    setState(prev => ({ ...prev, emotionResult, error: null }));
  }, []);

  const setSelectedTriggers = useCallback((selectedTriggers: string[]) => {
    setState(prev => ({ ...prev, selectedTriggers }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, notes }));
  }, []);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      // Validation before proceeding
      if (prev.step === 1 && !prev.emotionResult) {
        toast({
          title: 'Sélection requise',
          description: 'Veuillez sélectionner une émotion avant de continuer.',
          variant: 'destructive'
        });
        return prev;
      }
      return { ...prev, step: prev.step + 1 };
    });
  }, [toast]);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveDraft = useCallback(() => {
    const draft = {
      step: state.step,
      emotionResult: state.emotionResult,
      selectedTriggers: state.selectedTriggers,
      notes: state.notes,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setState(prev => ({ ...prev, lastSaved: new Date() }));
    toast({
      title: 'Brouillon sauvegardé',
      description: 'Votre scan a été sauvegardé. Vous pouvez le reprendre plus tard.'
    });
  }, [state, toast]);

  const loadDraft = useCallback((): boolean => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
          lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
          isSubmitting: false,
          error: null
        }));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(prev => ({ ...prev, lastSaved: null }));
  }, []);

  const handleSave = useCallback(async () => {
    // Validation
    if (!state.emotionResult) {
      setState(prev => ({ 
        ...prev, 
        error: 'Veuillez sélectionner une émotion.' 
      }));
      return Promise.reject(new Error('No emotion selected'));
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));

      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear draft on success
      localStorage.removeItem(STORAGE_KEY);

      toast({
        title: 'Scan enregistré ! 🎉',
        description: 'Votre état émotionnel a été sauvegardé avec succès.'
      });

      // Success! Reset form
      resetForm();

      return Promise.resolve();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: 'Échec de la sauvegarde. Veuillez réessayer.' 
      }));
      return Promise.reject(error);
    }
  }, [state.emotionResult, resetForm, toast]);

  // Computed values
  const isValid = Boolean(state.emotionResult);
  const canProceed = state.step === 1 ? Boolean(state.emotionResult) : true;

  return {
    state,
    setStep,
    setEmotionResult,
    setSelectedTriggers,
    setNotes,
    setIsSubmitting,
    setError,
    nextStep,
    prevStep,
    resetForm,
    handleSave,
    saveDraft,
    loadDraft,
    clearDraft,
    isValid,
    canProceed
  };
}

export default useEmotionScanFormState;
