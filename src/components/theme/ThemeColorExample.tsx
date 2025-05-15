
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ThemeColorProps {
  colorName: string;
  hexCode: string;
}

const ThemeColor: React.FC<ThemeColorProps> = ({ colorName, hexCode }) => {
  return (
    <div className="flex items-center mb-2">
      <div 
        className="w-6 h-6 rounded-full mr-2" 
        style={{ backgroundColor: hexCode }}
      />
      <span className="text-sm">{colorName}</span>
      <span className="text-xs text-muted-foreground ml-2">{hexCode}</span>
    </div>
  );
};

const ThemeColorExample: React.FC = () => {
  const colors = [
    { name: 'Primary', hex: 'hsl(var(--primary))' },
    { name: 'Primary Foreground', hex: 'hsl(var(--primary-foreground))' },
    { name: 'Secondary', hex: 'hsl(var(--secondary))' },
    { name: 'Secondary Foreground', hex: 'hsl(var(--secondary-foreground))' },
    { name: 'Accent', hex: 'hsl(var(--accent))' },
    { name: 'Accent Foreground', hex: 'hsl(var(--accent-foreground))' },
    { name: 'Muted', hex: 'hsl(var(--muted))' },
    { name: 'Muted Foreground', hex: 'hsl(var(--muted-foreground))' },
    { name: 'Background', hex: 'hsl(var(--background))' },
    { name: 'Foreground', hex: 'hsl(var(--foreground))' },
    { name: 'Border', hex: 'hsl(var(--border))' },
  ];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Palette de couleurs du thème</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <ThemeColor 
              key={color.name} 
              colorName={color.name} 
              hexCode={color.hex} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
