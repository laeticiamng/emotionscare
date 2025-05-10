import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { usePreferences } from '@/hooks/usePreferences';

const PremiumFeatures = () => {
  const { 
    preferences, 
    updatePreferences, 
    emotionalCamouflage = false 
  } = usePreferences();

  const handleEmotionalCamouflageChange = async (checked: boolean) => {
    await updatePreferences({ emotionalCamouflage: checked });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Fonctionnalités Premium</CardTitle>
        <CardDescription>
          Débloquez des options avancées pour une expérience personnalisée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emotional-camouflage"
              checked={emotionalCamouflage}
              onCheckedChange={handleEmotionalCamouflageChange}
            />
            <label htmlFor="emotional-camouflage" className="text-sm font-medium">
              Camouflage émotionnel
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Masquez vos émotions aux autres utilisateurs pour plus de confidentialité
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
