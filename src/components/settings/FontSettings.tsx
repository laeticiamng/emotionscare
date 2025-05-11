
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FontFamily, FontSize } from '@/contexts/ThemeContext';

interface FontSettingsProps {
  currentFontFamily: FontFamily;
  currentFontSize: FontSize;
  onChangeFontFamily: (fontFamily: string) => void;
  onChangeFontSize: (fontSize: string) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({ 
  currentFontFamily, 
  currentFontSize,
  onChangeFontFamily,
  onChangeFontSize
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Police & Lisibilité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="font-family">Police de caractères</Label>
          <Select 
            value={currentFontFamily} 
            onValueChange={onChangeFontFamily}
          >
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="default">Par défaut</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="font-size">Taille de police</Label>
          <Select 
            value={currentFontSize} 
            onValueChange={onChangeFontSize}
          >
            <SelectTrigger id="font-size">
              <SelectValue placeholder="Choisir une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-2 text-sm text-muted-foreground">
          Ajuster ces paramètres pour une expérience plus confortable.
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSettings;
