
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FontFamily, FontSize } from '@/contexts/ThemeContext';

interface FontSettingsProps {
  currentFontFamily: FontFamily;
  onChangeFontFamily: (value: string) => void;
  currentFontSize: FontSize;
  onChangeFontSize: (value: string) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  currentFontFamily,
  onChangeFontFamily,
  currentFontSize,
  onChangeFontSize
}) => {
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
            onValueChange={onChangeFontFamily}
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
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Taille de police</h3>
          <RadioGroup
            value={currentFontSize}
            onValueChange={onChangeFontSize}
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
