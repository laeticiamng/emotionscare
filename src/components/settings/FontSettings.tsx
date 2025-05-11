
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontFamily, FontSize } from "@/types/user";

interface FontSettingsProps {
  currentFont: FontFamily;
  currentSize: FontSize;
  onFontChange: (font: string) => void;
  onSizeChange: (size: string) => void;
}

const FontSettings: React.FC<FontSettingsProps> = ({ 
  currentFont,
  currentSize,
  onFontChange,
  onSizeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Police d'écriture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Famille de police</label>
          <Select value={currentFont} onValueChange={onFontChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="montserrat">Montserrat</SelectItem>
              <SelectItem value="sans">Sans-Serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Taille de police</label>
          <Select value={currentSize} onValueChange={onSizeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSettings;
