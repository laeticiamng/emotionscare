
import { useState } from 'react';
import { EmotionResult } from '@/types';

interface EmotionScanFormState {
  step: number;
  emotionResult: EmotionResult | null;
  selectedTriggers: string[];
  notes: string;
  isSubmitting: boolean;
  error: string | null;
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
}

export function useEmotionScanFormState(): UseEmotionScanFormStateReturn {
  const [state, setState] = useState<EmotionScanFormState>({
    step: 1,
    emotionResult: null,
    selectedTriggers: [],
    notes: '',
    isSubmitting: false,
    error: null
  });

  const setStep = (step: number) => {
    setState(prev => ({ ...prev, step }));
  };

  const setEmotionResult = (emotionResult: EmotionResult | null) => {
    setState(prev => ({ ...prev, emotionResult }));
  };

  const setSelectedTriggers = (selectedTriggers: string[]) => {
    setState(prev => ({ ...prev, selectedTriggers }));
  };

  const setNotes = (notes: string) => {
    setState(prev => ({ ...prev, notes }));
  };

  const setIsSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const resetForm = () => {
    setState({
      step: 1,
      emotionResult: null,
      selectedTriggers: [],
      notes: '',
      isSubmitting: false,
      error: null
    });
  };

  const handleSave = async () => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success! Reset form or navigate to results
      resetForm();

      // Return success
      return Promise.resolve();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: 'Failed to save emotion scan. Please try again.' 
      }));
      return Promise.reject(error);
    }
  };

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
    handleSave
  };
}

export default useEmotionScanFormState;
