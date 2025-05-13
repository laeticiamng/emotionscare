
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FontFamily, FontSize } from '@/contexts/ThemeContext';

interface FontSettingsProps {
  currentFontFamily: FontFamily;
  onChangeFontFamily: (fontFamily: FontFamily) => void;
  currentFontSize: FontSize;
  onChangeFontSize: (fontSize: FontSize) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({
  currentFontFamily,
  onChangeFontFamily,
  currentFontSize,
  onChangeFontSize
}) => {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Police d'écriture</h3>
          <RadioGroup
            value={currentFontFamily}
            onValueChange={(value) => onChangeFontFamily(value as FontFamily)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inter" id="font-inter" />
              <Label htmlFor="font-inter" className="font-['Inter']">Inter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roboto" id="font-roboto" />
              <Label htmlFor="font-roboto" className="font-['Roboto']">Roboto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poppins" id="font-poppins" />
              <Label htmlFor="font-poppins" className="font-['Poppins']">Poppins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="montserrat" id="font-montserrat" />
              <Label htmlFor="font-montserrat" className="font-['Montserrat']">Montserrat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="raleway" id="font-raleway" />
              <Label htmlFor="font-raleway" className="font-['Raleway']">Raleway</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Taille du texte</h3>
          <RadioGroup
            value={currentFontSize}
            onValueChange={(value) => onChangeFontSize(value as FontSize)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="font-small" />
              <Label htmlFor="font-small" className="text-sm">Petit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="font-medium" />
              <Label htmlFor="font-medium">Moyen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="font-large" />
              <Label htmlFor="font-large" className="text-lg">Grand</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSettings;
