
import React from 'react';

const ThemeColorExample = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="flex flex-col">
        <div className="h-16 w-full rounded bg-primary"></div>
        <span className="text-xs mt-1">Primary</span>
      </div>
      <div className="flex flex-col">
        <div className="h-16 w-full rounded bg-secondary"></div>
        <span className="text-xs mt-1">Secondary</span>
      </div>
      <div className="flex flex-col">
        <div className="h-16 w-full rounded bg-accent"></div>
        <span className="text-xs mt-1">Accent</span>
      </div>
      <div className="flex flex-col">
        <div className="h-16 w-full rounded bg-muted"></div>
        <span className="text-xs mt-1">Muted</span>
      </div>
    </div>
  );
};

export default ThemeColorExample;
