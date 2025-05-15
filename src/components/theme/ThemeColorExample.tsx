
import React from 'react';

export interface ThemeColorExampleProps {
  theme: 'light' | 'dark' | 'system' | string;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Theme: {theme}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-primary text-primary-foreground rounded">Primary</div>
        <div className="p-2 bg-secondary text-secondary-foreground rounded">Secondary</div>
        <div className="p-2 bg-accent text-accent-foreground rounded">Accent</div>
        <div className="p-2 bg-muted text-muted-foreground rounded">Muted</div>
        <div className="p-2 bg-card text-card-foreground rounded">Card</div>
        <div className="p-2 bg-destructive text-destructive-foreground rounded">Destructive</div>
        <div className="p-2 bg-background text-foreground border rounded">Background</div>
      </div>
    </div>
  );
};

export default ThemeColorExample;
