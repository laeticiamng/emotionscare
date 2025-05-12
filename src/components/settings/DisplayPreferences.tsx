import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useTheme } from '@/contexts/ThemeContext';
import type { FontSize, FontFamily } from '@/contexts/ThemeContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

const DisplayPreferences: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  
  const handleFontFamilyChange = (value: FontFamily) => {
    updatePreferences({ font: value });
    setFontFamily(value);
    toast.success("Police de caractères mise à jour", {
      description: "Votre préférence a été enregistrée."
    });
  };
  
  const handleFontSizeChange = (value: FontSize) => {
    updatePreferences({ fontSize: value });
    setFontSize(value);
    toast.success("Taille de police mise à jour", {
      description: "Votre préférence a été enregistrée."
    });
  };
  
  const handleHighContrastChange = (checked: boolean) => {
    updatePreferences({ highContrast: checked });
    toast.success("Contraste élevé " + (checked ? "activé" : "désactivé"), {
      description: "Votre préférence a été enregistrée."
    });
  };
  
  const handleReducedAnimationsChange = (checked: boolean) => {
    updatePreferences({ reducedAnimations: checked });
    toast.success("Animations réduites " + (checked ? "activées" : "désactivées"), {
      description: "Votre préférence a été enregistrée."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Affichage et accessibilité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thème */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base">Thème</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Changer l'apparence de l'application</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ThemeSwitcher />
        </div>
        
        {/* Police de caractères */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="fontFamily" className="text-base">Police de caractères</Label>
          </div>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter (défaut)</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="default">Système</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Taille de police */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="fontSize" className="text-base">Taille de police</Label>
          </div>
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Choisir une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Normale (défaut)</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Options d'accessibilité */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Options d'accessibilité</h3>
          
          {/* Contraste élevé */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-contrast" className="text-base">Contraste élevé</Label>
              <p className="text-sm text-muted-foreground">Augmente le contraste pour une meilleure lisibilité</p>
            </div>
            <Switch 
              id="high-contrast"
              checked={preferences?.highContrast || false}
              onCheckedChange={handleHighContrastChange}
            />
          </div>
          
          {/* Animations réduites */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduced-animations" className="text-base">Réduire les animations</Label>
              <p className="text-sm text-muted-foreground">Limite les animations et effets visuels</p>
            </div>
            <Switch 
              id="reduced-animations"
              checked={preferences?.reducedAnimations || false}
              onCheckedChange={handleReducedAnimationsChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayPreferences;
