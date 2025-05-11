
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FontFamily, FontSize } from '@/contexts/ThemeContext';

interface FontSettingsProps {
  currentFontFamily: FontFamily;
  onChangeFontFamily: (value: FontFamily) => void;
  currentFontSize: FontSize;
  onChangeFontSize: (value: FontSize) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  currentFontFamily,
  onChangeFontFamily,
  currentFontSize,
  onChangeFontSize
}) => {
  const handleFontFamilyChange = (value: string) => {
    // Validate the value is a valid FontFamily
    if (['inter', 'serif', 'mono', 'roboto', 'poppins', 'montserrat', 'default'].includes(value)) {
      onChangeFontFamily(value as FontFamily);
    }
  };

  const handleFontSizeChange = (value: string) => {
    // Validate the value is a valid FontSize
    if (['small', 'medium', 'large'].includes(value)) {
      onChangeFontSize(value as FontSize);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Police & Affichage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-3">Famille de police</h3>
          <RadioGroup
            value={currentFontFamily}
            onValueChange={handleFontFamilyChange}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inter" id="inter" />
              <Label htmlFor="inter">Inter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="serif" id="serif" />
              <Label htmlFor="serif">Serif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mono" id="mono" />
              <Label htmlFor="mono">Mono</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roboto" id="roboto" />
              <Label htmlFor="roboto">Roboto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poppins" id="poppins" />
              <Label htmlFor="poppins">Poppins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="montserrat" id="montserrat" />
              <Label htmlFor="montserrat">Montserrat</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Taille de police</h3>
          <RadioGroup
            value={currentFontSize}
            onValueChange={handleFontSizeChange}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Petite</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Moyenne</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Grande</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSettings;
