
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from '@/hooks/usePreferences';

const PremiumFeatures: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-medium">Fonctionnalités premium</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Camouflage émotionnel</p>
              <p className="text-sm text-muted-foreground">Masquer vos émotions pour les autres utilisateurs</p>
            </div>
            <Switch 
              checked={preferences.emotionalCamouflage || false}
              onCheckedChange={(checked) => updatePreferences({ 
                emotionalCamouflage: checked 
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>Suggestions avancées</p>
              <p className="text-sm text-muted-foreground">Recevoir des recommandations basées sur l'IA</p>
            </div>
            <Switch 
              checked={preferences.aiSuggestions || false}
              onCheckedChange={(checked) => updatePreferences({ 
                aiSuggestions: checked 
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>Anonymat complet</p>
              <p className="text-sm text-muted-foreground">Masquer votre identité dans les interactions</p>
            </div>
            <Switch 
              checked={preferences.fullAnonymity || false}
              onCheckedChange={(checked) => updatePreferences({ 
                fullAnonymity: checked 
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
