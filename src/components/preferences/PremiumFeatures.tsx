
import React from 'react';
import { UserPreferences } from '@/types/preferences';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

interface PremiumFeaturesProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  preferences,
  onChange,
  isPremium = false,
  onUpgrade
}) => {
  const handleEmotionalCamouflageChange = (enabled: boolean) => {
    onChange({
      emotionalCamouflage: enabled
    });
  };
  
  const handleAiSuggestionsChange = (enabled: boolean) => {
    onChange({
      aiSuggestions: enabled
    });
  };
  
  return (
    <Card className={!isPremium ? "bg-muted/50" : undefined}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className={isPremium ? "text-yellow-500" : "text-muted-foreground"} />
          <CardTitle>Fonctionnalités premium</CardTitle>
        </div>
        <CardDescription>
          {isPremium 
            ? "Vous avez accès aux fonctionnalités premium"
            : "Débloquez des fonctionnalités avancées avec un abonnement premium"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emotionalCamouflage">Camouflage émotionnel</Label>
              <p className="text-sm text-muted-foreground">
                Masque votre état émotionnel aux autres utilisateurs
              </p>
            </div>
            <Switch
              id="emotionalCamouflage"
              checked={preferences.emotionalCamouflage ?? false}
              onCheckedChange={handleEmotionalCamouflageChange}
              disabled={!isPremium}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="aiSuggestions">Suggestions IA avancées</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des suggestions personnalisées pour améliorer votre bien-être
              </p>
            </div>
            <Switch
              id="aiSuggestions"
              checked={preferences.aiSuggestions ?? false}
              onCheckedChange={handleAiSuggestionsChange}
              disabled={!isPremium}
            />
          </div>
        </div>
      </CardContent>
      
      {!isPremium && (
        <CardFooter>
          <Button onClick={onUpgrade} className="w-full">
            Passer à l'offre premium
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PremiumFeatures;
