
import { useState } from 'react';

interface FeatureFlags {
  musicModule: boolean;
  vrSessions: boolean;
  emotionAnalysis: boolean;
  coachChat: boolean;
}

export const useFeatureFlags = () => {
  const [flags] = useState<FeatureFlags>({
    musicModule: true,
    vrSessions: true,
    emotionAnalysis: true,
    coachChat: true
  });

  const isEnabled = (feature: keyof FeatureFlags) => {
    return flags[feature];
  };

  return {
    flags,
    isEnabled
  };
};
