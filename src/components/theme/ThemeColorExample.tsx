
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';

const ThemeColorExample = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Current Theme: {theme}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
              Primary
            </div>
            <div className="h-20 bg-secondary rounded-md flex items-center justify-center text-secondary-foreground">
              Secondary
            </div>
            <div className="h-20 bg-accent rounded-md flex items-center justify-center text-accent-foreground">
              Accent
            </div>
            <div className="h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              Muted
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isDarkMode ? 'Dark' : 'Light'} mode is currently active
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
