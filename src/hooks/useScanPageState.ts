// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionResult } from '@/types/emotion';

const useScanPageState = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const navigate = useNavigate();

  // Handle emotion detection
  const handleEmotionDetected = useCallback((result: EmotionResult) => {
    setDetectedEmotion(result);
    setCurrentStep(2); // Move to next step after detection
  }, []);

  // Reset the scan page state
  const resetScan = useCallback(() => {
    setCurrentStep(1);
    setDetectedEmotion(null);
  }, []);

  // Navigate to results
  const navigateToResults = useCallback(() => {
    if (detectedEmotion) {
      navigate('/results', { state: { emotion: detectedEmotion } });
    }
  }, [detectedEmotion, navigate]);

  // Continue to recommendations
  const continueToRecommendations = useCallback(() => {
    setCurrentStep(3);
  }, []);

  return {
    currentStep,
    detectedEmotion,
    handleEmotionDetected,
    resetScan,
    navigateToResults,
    continueToRecommendations,
    setCurrentStep
  };
};

export default useScanPageState;
