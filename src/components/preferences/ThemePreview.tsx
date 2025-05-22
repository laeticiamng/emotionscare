
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Define a Theme type if it doesn't exist in @/types/preferences
interface Theme {
  [key: string]: any;
}

interface ThemePreviewProps {
  theme: Theme;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  return (
    <div className={`theme-${theme}`}>
      <Card className="border shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-primary rounded"></div>
            <div className="h-4 w-1/2 bg-secondary rounded"></div>
          </div>
          
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-primary"></div>
            <div className="h-6 w-6 rounded-full bg-secondary"></div>
            <div className="h-6 w-6 rounded-full bg-accent"></div>
          </div>
          
          <div className="space-y-1">
            <div className="h-2 w-full bg-muted rounded"></div>
            <div className="h-2 w-4/5 bg-muted rounded"></div>
            <div className="h-2 w-2/3 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePreview;
