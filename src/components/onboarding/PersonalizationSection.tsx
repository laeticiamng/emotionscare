
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

export interface PersonalizationSectionProps {
  emotion: string;
  onResponse: (key: string, value: any) => void;
  onBack?: () => void;
  onContinue?: () => void;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({ 
  emotion, 
  onResponse,
  onBack,
  onContinue 
}) => {
  const [selectedPreferences, setSelectedPreferences] = React.useState({
    musicPreference: 'ambient',
    notificationFrequency: 'moderate',
    colorTheme: 'auto'
  });

  const handleChange = (key: string, value: string) => {
    setSelectedPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    onResponse(key, value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Personnalisation</h2>
        <p className="text-muted-foreground">
          Configurez vos préférences pour une meilleure expérience
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Préférence musicale</Label>
              <RadioGroup 
                defaultValue={selectedPreferences.musicPreference}
                onValueChange={(value) => handleChange('musicPreference', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ambient" id="ambient" />
                  <Label htmlFor="ambient">Ambient / Relaxant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upbeat" id="upbeat" />
                  <Label htmlFor="upbeat">Énergique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="focus" id="focus" />
                  <Label htmlFor="focus">Concentration</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Fréquence des notifications</Label>
              <RadioGroup 
                defaultValue={selectedPreferences.notificationFrequency}
                onValueChange={(value) => handleChange('notificationFrequency', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Minimale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Modérée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">Fréquente</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Thème de couleur</Label>
              <RadioGroup 
                defaultValue={selectedPreferences.colorTheme}
                onValueChange={(value) => handleChange('colorTheme', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Clair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Sombre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto">Automatique (selon système)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
        )}
        {onContinue && (
          <Button onClick={onContinue} className="ml-auto">
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalizationSection;
