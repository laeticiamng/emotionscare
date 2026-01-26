// @ts-nocheck

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export interface UserPreferencesFormProps {
  onSubmit?: (preferences: any) => void;
  onCancel?: () => void;
  defaultValues?: any;
}

const UserPreferencesFormImpl: React.FC<UserPreferencesFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {}
}) => {
  const [formValues, setFormValues] = React.useState({
    fontSize: defaultValues.fontSize || 'md',
    fontFamily: defaultValues.fontFamily || 'inter',
    reduceMotion: defaultValues.reduceMotion || false,
    soundEnabled: defaultValues.soundEnabled || false,
    darkMode: defaultValues.darkMode || false,
    autoScan: defaultValues.autoScan || false,
    notifications: defaultValues.notifications || 'all',
    volumeLevel: defaultValues.volumeLevel || 50,
    ...defaultValues
  });

  const { toast } = useToast();

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(formValues);
    }
    
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences ont été enregistrées avec succès",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Préférences utilisateur</CardTitle>
          <CardDescription>
            Personnalisez votre expérience EmotionsCare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Police de caractères</Label>
              <Select 
                value={formValues.fontFamily} 
                onValueChange={(val) => handleChange('fontFamily', val)}
              >
                <SelectTrigger id="fontFamily">
                  <SelectValue placeholder="Choisir une police" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="manrope">Manrope</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Taille de police</Label>
              <Select 
                value={formValues.fontSize} 
                onValueChange={(val) => handleChange('fontSize', String(val))}
              >
                <SelectTrigger id="fontSize">
                  <SelectValue placeholder="Choisir une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Petite</SelectItem>
                  <SelectItem value="md">Moyenne</SelectItem>
                  <SelectItem value="lg">Grande</SelectItem>
                  <SelectItem value="xl">Très grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Mode sombre</Label>
                <p className="text-sm text-muted-foreground">
                  Activer l'interface en mode sombre
                </p>
              </div>
              <Switch 
                id="darkMode"
                checked={formValues.darkMode}
                onCheckedChange={(checked) => handleChange('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduceMotion">Réduire les animations</Label>
                <p className="text-sm text-muted-foreground">
                  Limiter les effets de mouvement dans l'interface
                </p>
              </div>
              <Switch 
                id="reduceMotion"
                checked={formValues.reduceMotion}
                onCheckedChange={(checked) => handleChange('reduceMotion', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volumeLevel">Volume des sons</Label>
            <div className="flex items-center gap-4">
              <Slider 
                id="volumeLevel"
                value={[formValues.volumeLevel]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => handleChange('volumeLevel', values[0])}
              />
              <span className="w-12 text-center">{formValues.volumeLevel}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="soundEnabled">Sons activés</Label>
                <p className="text-sm text-muted-foreground">
                  Activer les sons de l'application
                </p>
              </div>
              <Switch 
                id="soundEnabled"
                checked={formValues.soundEnabled}
                onCheckedChange={(checked) => handleChange('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoScan">Scan automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Analyser automatiquement vos émotions
                </p>
              </div>
              <Switch 
                id="autoScan"
                checked={formValues.autoScan}
                onCheckedChange={(checked) => handleChange('autoScan', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifications">Notifications</Label>
            <Select 
              value={formValues.notifications} 
              onValueChange={(val) => handleChange('notifications', val)}
            >
              <SelectTrigger id="notifications">
                <SelectValue placeholder="Type de notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notifications</SelectItem>
                <SelectItem value="important">Notifications importantes seulement</SelectItem>
                <SelectItem value="none">Aucune notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserPreferencesFormImpl;
