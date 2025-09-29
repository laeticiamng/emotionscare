import { useState, useEffect } from 'react';

export interface AccessibilityValidation {
  errors: string[];
  warnings: string[];
  score: number;
}

export const useAccessibilityValidation = () => {
  const [validation, setValidation] = useState<AccessibilityValidation>({
    errors: [],
    warnings: [],
    score: 100
  });

  useEffect(() => {
    // Simulation de validation d'accessibilité
    setValidation({
      errors: [],
      warnings: ['Contraste insuffisant détecté'],
      score: 85
    });
  }, []);

  return validation;
};