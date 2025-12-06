// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Theme } from '@/types/preferences';

interface ThemePreviewProps {
  theme: Theme;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  // Détermine les classes CSS en fonction du thème
  const getBgClass = () => {
    switch (theme) {
      case 'dark': return 'bg-slate-900';
      case 'light': return 'bg-slate-50';
      case 'system': return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900';
      default: return 'bg-slate-100';
    }
  };

  const getTextClass = () => {
    switch (theme) {
      case 'dark': return 'text-slate-100';
      case 'light': return 'text-slate-900';
      case 'system': return 'text-slate-900 dark:text-slate-100';
      default: return 'text-slate-900';
    }
  };

  return (
    <div className={`${getBgClass()} rounded-md p-2 h-full w-full`}>
      <div className="space-y-2">
        <div className="h-2 w-3/4 bg-primary rounded"></div>
        <div className="h-2 w-1/2 bg-secondary rounded"></div>
      </div>
      
      <div className="flex gap-1 mt-2">
        <div className="h-4 w-4 rounded-full bg-primary"></div>
        <div className="h-4 w-4 rounded-full bg-secondary"></div>
        <div className="h-4 w-4 rounded-full bg-accent"></div>
      </div>
      
      <div className="space-y-1 mt-2">
        <div className="h-1 w-full bg-muted rounded"></div>
        <div className="h-1 w-4/5 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default ThemePreview;
