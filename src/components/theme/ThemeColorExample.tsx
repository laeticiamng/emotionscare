
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Theme } from '@/types';

interface ThemeColorExampleProps {
  theme?: Theme;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme = 'light' }) => {
  return (
    <div className={`theme-${theme}`}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Primary</h3>
              <div className="h-10 w-full bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                primary
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Secondary</h3>
              <div className="h-10 w-full bg-secondary rounded-md flex items-center justify-center text-secondary-foreground">
                secondary
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Accent</h3>
              <div className="h-10 w-full bg-accent rounded-md flex items-center justify-center text-accent-foreground">
                accent
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Muted</h3>
              <div className="h-10 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                muted
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Card</h3>
              <div className="h-10 w-full border rounded-md flex items-center justify-center">
                card
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Background</h3>
              <div className="h-10 w-full bg-background border rounded-md flex items-center justify-center">
                background
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Destructive</h3>
              <div className="h-10 w-full bg-destructive rounded-md flex items-center justify-center text-destructive-foreground">
                destructive
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeColorExample;
