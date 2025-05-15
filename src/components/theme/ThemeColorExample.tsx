
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from '@/contexts/ThemeContext';

const ThemeColorExample = () => {
  const { theme, isDarkMode } = useTheme();
  
  const colorSamples = [
    { name: 'Primary', class: 'bg-primary text-primary-foreground' },
    { name: 'Secondary', class: 'bg-secondary text-secondary-foreground' },
    { name: 'Accent', class: 'bg-accent text-accent-foreground' },
    { name: 'Background', class: 'bg-background text-foreground' },
    { name: 'Muted', class: 'bg-muted text-muted-foreground' },
    { name: 'Card', class: 'bg-card text-card-foreground border' },
    { name: 'Destructive', class: 'bg-destructive text-destructive-foreground' },
    { name: 'Success', class: 'bg-green-500 text-white' },
    { name: 'Warning', class: 'bg-yellow-500 text-white' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Colors - {theme} mode</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {colorSamples.map((sample) => (
          <div key={sample.name} className="flex flex-col gap-2">
            <div 
              className={`h-16 rounded-md flex items-center justify-center ${sample.class}`}
            >
              <span>{sample.name}</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">{sample.name}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
