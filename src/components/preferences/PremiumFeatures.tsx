
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Crown, ShieldCheck, EyeOff } from "lucide-react";
import { UserPreferencesState } from '@/types';

interface PremiumFeaturesProps {
  isPremium: boolean;
  preferences: UserPreferencesState;
  onUpdate: (preferences: Partial<UserPreferencesState>) => void;
  isUpdating?: boolean;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  isPremium,
  preferences,
  onUpdate,
  isUpdating = false,
}) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Handle toggle of premium feature when user is not premium
  const handleNotPremiumToggle = () => {
    setShowUpgradeDialog(true);
    // In a real app, you'd show a proper upgrade modal here
  };

  // Emotional camouflage toggle
  const handleEmotionalCamouflageToggle = (enabled: boolean) => {
    if (!isPremium) {
      handleNotPremiumToggle();
      return;
    }

    onUpdate({ emotionalCamouflage: enabled });
  };

  // Mock function for other premium features that would be implemented
  const handlePremiumFeatureToggle = (feature: string, enabled: boolean) => {
    if (!isPremium) {
      handleNotPremiumToggle();
      return;
    }

    console.log(`Toggled ${feature} to ${enabled}`);
    // Would update specific feature in a real implementation
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-amber-500" />
          Fonctionnalités premium
          {!isPremium && (
            <Badge variant="outline" className="ml-2">
              Mise à niveau requise
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emotional camouflage feature */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="emotional-camouflage-toggle" className="text-base font-medium flex items-center">
              Camouflage émotionnel
              <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Masque vos émotions réelles en affichant un état neutre aux autres utilisateurs
            </p>
          </div>
          <Switch
            id="emotional-camouflage-toggle"
            checked={isPremium && !!preferences.emotionalCamouflage}
            onCheckedChange={handleEmotionalCamouflageToggle}
            disabled={isUpdating || !isPremium}
          />
        </div>

        {/* Advanced data protection */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="advanced-protection-toggle" className="text-base font-medium flex items-center">
              Protection avancée des données
              <ShieldCheck className="h-4 w-4 ml-2 text-muted-foreground" />
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Cryptage de bout en bout pour toutes vos entrées de journal et historique émotionnel
            </p>
          </div>
          <Switch
            id="advanced-protection-toggle"
            checked={isPremium}
            onCheckedChange={(enabled) => handlePremiumFeatureToggle('advanced-protection', enabled)}
            disabled={isUpdating || !isPremium}
          />
        </div>

        {/* Info text for non-premium users */}
        {!isPremium && (
          <div className="bg-muted p-3 rounded-lg mt-4 text-sm">
            <p className="font-medium">Accédez à toutes les fonctionnalités premium</p>
            <p className="text-muted-foreground mt-1">
              Passez à la formule premium pour débloquer toutes les fonctionnalités avancées et personnaliser davantage
              votre expérience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
