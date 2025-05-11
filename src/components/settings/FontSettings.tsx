
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FontFamily, FontSize } from "@/types/user";

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Famille de police</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentFontFamily}
            onValueChange={(value) => onChangeFontFamily(value as FontFamily)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inter" id="inter" />
              <Label htmlFor="inter" className="font-inter">Inter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roboto" id="roboto" />
              <Label htmlFor="roboto" className="font-roboto">Roboto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poppins" id="poppins" />
              <Label htmlFor="poppins" className="font-poppins">Poppins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="montserrat" id="montserrat" />
              <Label htmlFor="montserrat" className="font-montserrat">Montserrat</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Taille de police</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentFontSize}
            onValueChange={(value) => onChangeFontSize(value as FontSize)}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small" className="text-sm">Petit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-base">Moyen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large" className="text-lg">Grand</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default FontSettings;
