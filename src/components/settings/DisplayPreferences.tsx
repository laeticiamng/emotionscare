
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Sparkles, EyeOff, PanelLeft, MonitorSmartphone, Palette } from 'lucide-react';
import { ThemeName, FontSize, FontFamily } from '@/types/preferences';

const DisplayPreferences: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<ThemeName>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [moodBasedTheme, setMoodBasedTheme] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);

  const handleSave = () => {
    toast({
      title: "Affichage mis à jour",
      description: "Vos préférences d'affichage ont été enregistrées."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Préférences d'affichage
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de votre interface EmotionsCare.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thème */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Thème</h3>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs">Aperçu</span>
            </Button>
          </div>
          <RadioGroup 
            value={theme} 
            onValueChange={(val) => setTheme(val as ThemeName)}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
                <Sun className="h-4 w-4 mr-2" />
                Clair
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
                <Moon className="h-4 w-4 mr-2" />
                Sombre
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
                <MonitorSmartphone className="h-4 w-4 mr-2" />
                Système
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="pastel" id="theme-pastel" />
              <Label htmlFor="theme-pastel" className="flex items-center cursor-pointer">
                <Palette className="h-4 w-4 mr-2" />
                Pastel
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Taille de la police */}
        <div className="space-y-3">
          <h3 className="font-medium">Taille de la police</h3>
          <Select 
            value={fontSize} 
            onValueChange={(val) => setFontSize(val as FontSize)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une taille de police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="extra-large">Très grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Police */}
        <div className="space-y-3">
          <h3 className="font-medium">Police</h3>
          <Select 
            value={fontFamily} 
            onValueChange={(val) => setFontFamily(val as FontFamily)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
              <SelectItem value="open-sans">Open Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options d'accessibilité */}
        <div className="rounded-lg border p-5 space-y-4">
          <h3 className="font-medium">Options d'accessibilité</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex-1">
              <div>Mode contraste élevé</div>
              <div className="text-sm text-muted-foreground">
                Augmente le contraste pour une meilleure lisibilité
              </div>
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="flex-1">
              <div>Animations réduites</div>
              <div className="text-sm text-muted-foreground">
                Réduit ou désactive les animations et effets de transition
              </div>
            </Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </div>

        {/* Options avancées */}
        <div className="rounded-lg border p-5 space-y-4">
          <h3 className="font-medium">Options avancées</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="mood-based-theme" className="flex-1">
              <div>Thème basé sur l'humeur</div>
              <div className="text-sm text-muted-foreground">
                Adapte automatiquement les couleurs selon votre humeur détectée
              </div>
            </Label>
            <Switch
              id="mood-based-theme"
              checked={moodBasedTheme}
              onCheckedChange={setMoodBasedTheme}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="immersive-mode" className="flex-1">
              <div>Mode immersif</div>
              <div className="text-sm text-muted-foreground">
                Masque les éléments d'interface pour une expérience plus immersive
              </div>
            </Label>
            <Switch
              id="immersive-mode"
              checked={immersiveMode}
              onCheckedChange={setImmersiveMode}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Réinitialiser</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;
