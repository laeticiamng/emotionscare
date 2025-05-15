
import React from 'react';
import { Theme } from '@/types';

interface ThemeColorExampleProps {
  theme?: Theme;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme = 'light' }) => {
  return (
    <div className={`theme-${theme} p-4 rounded-md`}>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
          Primary
        </div>
        <div className="h-12 bg-secondary rounded-md flex items-center justify-center text-secondary-foreground">
          Secondary
        </div>
        <div className="h-12 bg-accent rounded-md flex items-center justify-center text-accent-foreground">
          Accent
        </div>
        <div className="h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
          Muted
        </div>
      </div>
    </div>
  );
};

export default ThemeColorExample;
