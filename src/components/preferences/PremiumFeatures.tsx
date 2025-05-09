
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Plus, Star, Users, Wand2 } from 'lucide-react';

const PremiumFeatures = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    duoModeEnabled: false,
    trustedContact: '',
    customPresets: [
      { name: "Mode travail", active: false },
      { name: "Mode détente", active: false }
    ],
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePresetToggle = (index: number) => {
    const updatedPresets = [...settings.customPresets];
    updatedPresets[index].active = !updatedPresets[index].active;
    handleChange('customPresets', updatedPresets);

    if (updatedPresets[index].active) {
      toast({
        title: "Preset activé",
        description: `Le mode "${updatedPresets[index].name}" a été activé.`
      });
    }
  };

  const addNewPreset = () => {
    toast({
      title: "Nouveau preset créé",
      description: "Votre configuration actuelle a été enregistrée comme preset."
    });
  };

  const saveSettings = () => {
    toast({
      title: "Paramètres premium enregistrés",
      description: "Vos préférences premium ont été mises à jour."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle>Fonctionnalités Premium</CardTitle>
            </div>
            <Badge variant="outline" className="bg-primary/20">Premium</Badge>
          </div>
          <CardDescription>
            Profitez d'une expérience encore plus personnalisée avec ces fonctionnalités exclusives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                <div>
                  <Label>Mode duo ou partage sensible</Label>
                  <p className="text-sm text-muted-foreground">Partagez votre expérience avec un proche</p>
                </div>
              </div>
              <Switch 
                checked={settings.duoModeEnabled}
                onCheckedChange={(checked) => handleChange('duoModeEnabled', checked)}
              />
            </div>
            
            {settings.duoModeEnabled && (
              <div className="space-y-2 pl-7">
                <Label>Contact de confiance</Label>
                <Input 
                  placeholder="Adresse email"
                  value={settings.trustedContact}
                  onChange={(e) => handleChange('trustedContact', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Cette personne pourra recevoir des partages de musiques, notes et encouragements
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-3">
              <Wand2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Assistant de style personnel</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Créez et activez des presets personnalisés pour différents moments de la journée
            </p>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {settings.customPresets.map((preset, index) => (
                  <div 
                    key={preset.name}
                    className={`border rounded-lg p-3 cursor-pointer ${
                      preset.active ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                    }`}
                    onClick={() => handlePresetToggle(index)}
                  >
                    <h4 className="font-medium">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground">Thème, musique et ambiance personnalisés</p>
                  </div>
                ))}
                
                <div 
                  className="border border-dashed rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center hover:bg-accent"
                  onClick={addNewPreset}
                >
                  <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium">Nouveau preset</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  L'IA analysera vos préférences et vous suggérera des styles qui vous correspondent
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings} className="w-full">
            Enregistrer les préférences premium
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PremiumFeatures;
