
import React from 'react';

const ThemeColorExample = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-md bg-primary"></div>
        <span className="text-sm mt-1">Primary</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-md bg-secondary"></div>
        <span className="text-sm mt-1">Secondary</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-md bg-accent"></div>
        <span className="text-sm mt-1">Accent</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-md bg-muted"></div>
        <span className="text-sm mt-1">Muted</span>
      </div>
    </div>
  );
};

export default ThemeColorExample;
