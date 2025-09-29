
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface CoachPreferencesPanelProps {
  onClose: () => void;
  onSave: (preferences: CoachPreferences) => void;
  initialPreferences?: CoachPreferences;
}

export interface CoachPreferences {
  coachType: 'calm' | 'motivational' | 'analytical';
  themeColor: string;
  fontSize: number;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

const defaultPreferences: CoachPreferences = {
  coachType: 'calm',
  themeColor: '#7C3AED',
  fontSize: 1, // 1 means normal size (100%)
  animationsEnabled: true,
  soundEnabled: false,
};

const CoachPreferencesPanel: React.FC<CoachPreferencesPanelProps> = ({
  onClose,
  onSave,
  initialPreferences = defaultPreferences,
}) => {
  const [preferences, setPreferences] = useState<CoachPreferences>(initialPreferences);
  
  const themeColors = [
    { label: 'Violet', value: '#7C3AED' },
    { label: 'Bleu', value: '#2563EB' },
    { label: 'Vert', value: '#16A34A' },
    { label: 'Orange', value: '#EA580C' },
    { label: 'Rose', value: '#EC4899' },
  ];
  
  const handleSave = () => {
    onSave(preferences);
    onClose();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Personnalisation du Coach</CardTitle>
        <CardDescription>
          Adaptez l'interface à vos préférences pour une meilleure expérience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Style du Coach</h3>
          <RadioGroup
            value={preferences.coachType}
            onValueChange={(value) => 
              setPreferences({
                ...preferences, 
                coachType: value as CoachPreferences['coachType']
              })
            }
            className="grid grid-cols-3 gap-2"
          >
            <div>
              <RadioGroupItem
                value="calm"
                id="coach-calm"
                className="peer sr-only"
              />
              <Label
                htmlFor="coach-calm"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>🧘</span>
                <span className="mt-2">Calme</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                value="motivational"
                id="coach-motivational"
                className="peer sr-only"
              />
              <Label
                htmlFor="coach-motivational"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>💪</span>
                <span className="mt-2">Motivant</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                value="analytical"
                id="coach-analytical"
                className="peer sr-only"
              />
              <Label
                htmlFor="coach-analytical"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>🔬</span>
                <span className="mt-2">Analytique</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Couleur du thème</h3>
          <div className="flex flex-wrap gap-3 mb-2">
            {themeColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setPreferences({...preferences, themeColor: color.value})}
                className="w-8 h-8 rounded-full relative flex items-center justify-center"
                style={{ backgroundColor: color.value }}
                aria-label={`Couleur ${color.label}`}
              >
                {preferences.themeColor === color.value && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">Taille du texte</h3>
            <span className="text-sm text-muted-foreground">
              {Math.round(preferences.fontSize * 100)}%
            </span>
          </div>
          <Slider
            value={[preferences.fontSize]}
            min={0.8}
            max={1.5}
            step={0.05}
            onValueChange={(value) => setPreferences({...preferences, fontSize: value[0]})}
            aria-label="Taille du texte"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-animations"
              checked={preferences.animationsEnabled}
              onChange={(e) => setPreferences({...preferences, animationsEnabled: e.target.checked})}
              className="rounded border-gray-300 focus:ring-primary"
            />
            <Label htmlFor="enable-animations">Animations</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-sound"
              checked={preferences.soundEnabled}
              onChange={(e) => setPreferences({...preferences, soundEnabled: e.target.checked})}
              className="rounded border-gray-300 focus:ring-primary"
            />
            <Label htmlFor="enable-sound">Sons</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachPreferencesPanel;
