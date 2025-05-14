
import React from 'react';
import { Theme } from '@/types/types';

interface ThemeColorExampleProps {
  theme: Theme;
}

const ThemeColorExample: React.FC<ThemeColorExampleProps> = ({ theme }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Primary</h3>
        <div className="bg-primary h-10 rounded-md"></div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Secondary</h3>
        <div className="bg-secondary h-10 rounded-md"></div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Accent</h3>
        <div className="bg-accent h-10 rounded-md"></div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Background</h3>
        <div className="bg-background border h-10 rounded-md"></div>
      </div>
    </div>
  );
};

export default ThemeColorExample;
