// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FontFamily, FontSize } from '@/types';

interface FontSettingsProps {
  currentFontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  currentFontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  currentFontFamily,
  onChangeFontFamily,
  currentFontSize,
  onChangeFontSize
}) => {
  const handleFontFamilyChange = (value: string) => {
    onChangeFontFamily(value as FontFamily);
  };

  const handleFontSizeChange = (value: string) => {
    onChangeFontSize(value as FontSize);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Typographie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Police</h4>
          <RadioGroup
            value={currentFontFamily}
            onValueChange={handleFontFamilyChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system-font" />
              <Label htmlFor="system-font" className="font-system">Système</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sans-serif" id="sans" />
              <Label htmlFor="sans" className="font-sans">Sans Serif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="serif" id="serif" />
              <Label htmlFor="serif" className="font-serif">Serif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monospace" id="mono" />
              <Label htmlFor="mono" className="font-mono">Monospace</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h4 className="font-medium mb-4">Taille</h4>
          <RadioGroup
            value={currentFontSize}
            onValueChange={handleFontSizeChange}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small" className="text-sm">Petite</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Moyenne</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large" className="text-lg">Grande</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSettings;
