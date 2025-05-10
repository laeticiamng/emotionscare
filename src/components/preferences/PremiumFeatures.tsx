
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserPreferencesState } from '@/types';

interface PremiumFeaturesProps {
  preferences: UserPreferencesState;
  onUpdate: (key: string, value: any) => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  preferences,
  onUpdate
}) => {
  const handleToggleEmotionalCamouflage = (checked: boolean) => {
    onUpdate('emotionalCamouflage', checked);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonctionnalités premium</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="camouflage" className="block mb-1">
              Camouflage émotionnel
            </Label>
            <p className="text-sm text-muted-foreground">
              Masque vos émotions réelles aux autres utilisateurs
            </p>
          </div>
          <Switch
            id="camouflage"
            checked={preferences.emotionalCamouflage || false}
            onCheckedChange={handleToggleEmotionalCamouflage}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
