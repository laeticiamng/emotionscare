
import { usePredictiveAnalytics } from '@/contexts/PredictiveAnalyticsContext';
import { useState } from 'react';

export const usePredictiveIntelligence = (userMode: 'b2c' | 'b2b' | 'b2b-admin' = 'b2c') => {
  const {
    isLoading,
    error,
    currentPredictions,
    generatePrediction,
    resetPredictions,
    isEnabled,
    setEnabled,
    availableFeatures: contextFeatures,
    predictionEnabled,
    setPredictionEnabled,
    recommendations
  } = usePredictiveAnalytics();
  
  // We could add mode-specific logic here
  const [localFeatures, setLocalFeatures] = useState(contextFeatures || []);
  
  // Allow toggling features locally
  const availableFeatures = localFeatures.map(feature => ({
    ...feature,
    toggleFeature: (enabled: boolean) => {
      // Update local state and potentially sync with context
      setLocalFeatures(prev => 
        prev.map(f => 
          f.name === feature.name ? { ...f, enabled } : f
        )
      );
    }
  }));
  
  return {
    isLoading,
    error,
    currentPredictions,
    generatePrediction,
    resetPredictions,
    isEnabled,
    setEnabled,
    availableFeatures,
    predictionEnabled,
    setPredictionEnabled,
    recommendations
  };
};

export default usePredictiveIntelligence;
