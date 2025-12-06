/**
 * Hook for medical disclaimer management
 */

import { useState, useEffect } from 'react';

type FeatureType = 'ai_coach' | 'ai_coach_enhanced' | 'assessment' | 'coach' | 'emotional_scan' | 'journal' | 'psychological_assessment' | 'scan';

export const useMedicalDisclaimer = (feature: FeatureType) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer for this feature
    const key = `disclaimer_${feature}_accepted`;
    const accepted = localStorage.getItem(key) === 'true';
    
    if (!accepted) {
      setShowDisclaimer(true);
    } else {
      setIsAccepted(true);
    }
  }, [feature]);

  const handleAccept = () => {
    const key = `disclaimer_${feature}_accepted`;
    localStorage.setItem(key, 'true');
    setShowDisclaimer(false);
    setIsAccepted(true);
  };

  const handleDecline = () => {
    setShowDisclaimer(false);
    // Don't set accepted to true
  };

  return {
    showDisclaimer,
    isAccepted,
    handleAccept,
    handleDecline,
  };
};
