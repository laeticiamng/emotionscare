
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from '@/contexts/ThemeContext';

export interface ColorSwatch {
  name: string;
  color: string;
  contrastText: 'black' | 'white';
}

const ThemeColorExample: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  
  const colors: ColorSwatch[] = [
    { name: 'Primary', color: 'hsl(220, 100%, 50%)', contrastText: 'white' },
    { name: 'Secondary', color: 'hsl(210, 40%, 96.1%)', contrastText: 'black' },
    { name: 'Accent', color: 'hsl(339, 90%, 65%)', contrastText: 'white' },
    { name: 'Muted', color: 'hsl(210, 40%, 96.1%)', contrastText: 'black' },
    { name: 'Background', color: 'hsl(0, 0%, 100%)', contrastText: 'black' },
    { name: 'Foreground', color: 'hsl(220, 25%, 16%)', contrastText: 'white' },
  ];
  
  // If we're in dark mode, adjust the colors
  const darkModeColors: ColorSwatch[] = [
    { name: 'Primary', color: 'hsl(217, 91%, 60%)', contrastText: 'white' },
    { name: 'Secondary', color: 'hsl(220, 15%, 25%)', contrastText: 'white' },
    { name: 'Accent', color: 'hsl(339, 90%, 65%)', contrastText: 'white' },
    { name: 'Muted', color: 'hsl(220, 15%, 25%)', contrastText: 'white' },
    { name: 'Background', color: 'hsl(220, 20%, 12%)', contrastText: 'white' },
    { name: 'Foreground', color: 'hsl(210, 40%, 98%)', contrastText: 'black' },
  ];
  
  const displayColors = isDarkMode ? darkModeColors : colors;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Theme: {theme}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {displayColors.map((swatch) => (
            <div 
              key={swatch.name} 
              className="p-3 rounded-md shadow-sm"
              style={{ 
                backgroundColor: swatch.color,
                color: swatch.contrastText === 'white' ? 'white' : 'black'
              }}
            >
              <div className="font-medium">{swatch.name}</div>
              <div className="text-xs opacity-80">{swatch.color}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
