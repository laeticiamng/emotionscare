
import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';

const ThemeColorExample = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Current Theme: {theme}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-full rounded bg-primary"></div>
              <div className="h-8 w-full rounded bg-secondary"></div>
              <div className="h-8 w-full rounded bg-accent"></div>
              <div className="h-8 w-full rounded bg-muted"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-primary">Primary Text</p>
            <p className="text-secondary">Secondary Text</p>
            <p className="text-accent">Accent Text</p>
            <p className="text-muted-foreground">Muted Text</p>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {isDarkMode ? 'Dark mode is active' : 'Light mode is active'}
      </p>
    </div>
  );
};

export default ThemeColorExample;
