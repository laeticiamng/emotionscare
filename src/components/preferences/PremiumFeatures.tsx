
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Crown, Lock } from 'lucide-react';

const PremiumFeatures = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  if (!user || !user.preferences) {
    return null;
  }
  
  const handleToggleEmotionalCamouflage = async (enabled: boolean) => {
    if (!user) return;
    
    try {
      // Create a deep copy of the user to avoid mutation
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          emotionalCamouflage: enabled
        }
      };
      
      await updateUser(updatedUser);
      toast({
        title: enabled ? "Camouflage émotionnel activé" : "Camouflage émotionnel désactivé",
        description: enabled 
          ? "Vos émotions seront maintenant masquées aux autres utilisateurs." 
          : "Vos émotions sont maintenant visibles pour les autres utilisateurs."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleAISuggestions = async (enabled: boolean) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          aiSuggestions: enabled
        }
      };
      
      await updateUser(updatedUser);
      toast({
        title: enabled ? "Suggestions IA activées" : "Suggestions IA désactivées",
        description: enabled 
          ? "Vous recevrez maintenant des suggestions personnalisées basées sur votre profil émotionnel." 
          : "Vous ne recevrez plus de suggestions personnalisées."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-400" />
          Fonctionnalités Premium
        </CardTitle>
        <CardDescription>Débloquez des fonctionnalités avancées avec notre abonnement premium</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="emotional-camouflage">Camouflage émotionnel</Label>
              <p className="text-sm text-muted-foreground">Masquez vos émotions aux autres utilisateurs</p>
            </div>
            <Switch
              id="emotional-camouflage"
              checked={!!user.preferences.emotionalCamouflage}
              onCheckedChange={handleToggleEmotionalCamouflage}
              disabled={false}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="ai-suggestions">Suggestions IA avancées</Label>
              <p className="text-sm text-muted-foreground">Recevez des recommandations personnalisées basées sur votre profil émotionnel</p>
            </div>
            <Switch
              id="ai-suggestions"
              checked={!!user.preferences.aiSuggestions}
              onCheckedChange={handleToggleAISuggestions}
              disabled={false}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5 relative">
              <Label htmlFor="emotional-intelligence" className="flex items-center gap-2">
                Intelligence émotionnelle avancée
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </Label>
              <p className="text-sm text-muted-foreground">Analyses approfondies et prédictions basées sur vos tendances émotionnelles</p>
            </div>
            <Switch
              id="emotional-intelligence"
              checked={false}
              disabled={true}
            />
          </div>
        </div>
        
        <div className="rounded-md bg-muted p-4">
          <h4 className="text-sm font-medium mb-1">Passez à l'abonnement Premium</h4>
          <p className="text-xs text-muted-foreground">
            Déverrouillez toutes les fonctionnalités pour seulement 9,99€ par mois. Annulable à tout moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
