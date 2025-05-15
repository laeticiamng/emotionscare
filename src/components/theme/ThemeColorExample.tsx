
import React from 'react';

const ThemeColorExample = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-medium">Primary</span>
        </div>
        <div className="h-16 rounded-md bg-secondary flex items-center justify-center">
          <span className="text-secondary-foreground font-medium">Secondary</span>
        </div>
        <div className="h-16 rounded-md bg-accent flex items-center justify-center">
          <span className="text-accent-foreground font-medium">Accent</span>
        </div>
        <div className="h-16 rounded-md bg-muted flex items-center justify-center">
          <span className="text-muted-foreground font-medium">Muted</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="h-10 rounded-md bg-success-light flex items-center justify-center">
          <span className="text-xs">Success Light</span>
        </div>
        <div className="h-10 rounded-md bg-success flex items-center justify-center">
          <span className="text-xs text-white">Success</span>
        </div>
        <div className="h-10 rounded-md bg-success-dark flex items-center justify-center">
          <span className="text-xs text-white">Success Dark</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="h-10 rounded-md bg-warning-light flex items-center justify-center">
          <span className="text-xs">Warning Light</span>
        </div>
        <div className="h-10 rounded-md bg-warning flex items-center justify-center">
          <span className="text-xs">Warning</span>
        </div>
        <div className="h-10 rounded-md bg-warning-dark flex items-center justify-center">
          <span className="text-xs text-white">Warning Dark</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="h-10 rounded-md bg-error-light flex items-center justify-center">
          <span className="text-xs">Error Light</span>
        </div>
        <div className="h-10 rounded-md bg-error flex items-center justify-center">
          <span className="text-xs text-white">Error</span>
        </div>
        <div className="h-10 rounded-md bg-error-dark flex items-center justify-center">
          <span className="text-xs text-white">Error Dark</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeColorExample;
