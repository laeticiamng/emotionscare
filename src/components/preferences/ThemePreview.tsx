
import React from 'react';
import { Theme } from '@/types/theme';
import { cn } from '@/lib/utils';

export interface ThemePreviewProps {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isActive, onClick }) => {
  const getPreviewClassName = () => {
    let baseClasses = "w-full aspect-video rounded-md border-2 cursor-pointer transition-all";
    
    if (isActive) {
      baseClasses += " ring-2 ring-primary border-primary";
    }
    
    switch (theme) {
      case 'dark':
        return cn(baseClasses, "bg-slate-900");
      case 'light':
        return cn(baseClasses, "bg-slate-50");
      case 'system':
        return cn(baseClasses, "bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800");
      case 'pastel':
        return cn(baseClasses, "bg-gradient-to-br from-pink-100 to-blue-100");
      default:
        return baseClasses;
    }
  };
  
  const getLabel = () => {
    switch (theme) {
      case 'dark': return 'Mode sombre';
      case 'light': return 'Mode clair';
      case 'system': return 'Système';
      case 'pastel': return 'Pastel';
      default: return theme;
    }
  };
  
  return (
    <div className="text-center space-y-2">
      <div 
        className={getPreviewClassName()}
        onClick={onClick}
        aria-label={`Thème ${getLabel()}`}
      >
        <div className="h-full w-full flex items-center justify-center">
          {theme === 'system' && (
            <div className="text-xs font-medium text-center">
              {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Sombre' : 'Clair'} 
              <br />
              (basé système)
            </div>
          )}
        </div>
      </div>
      <p className="text-xs font-medium">{getLabel()}</p>
    </div>
  );
};

export default ThemePreview;
