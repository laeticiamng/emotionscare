
import React from 'react';

const ThemeColorExample = () => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Primary</h3>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-primary" />
          <div className="h-10 w-10 rounded bg-primary/80" />
          <div className="h-10 w-10 rounded bg-primary/60" />
          <div className="h-10 w-10 rounded bg-primary/40" />
          <div className="h-10 w-10 rounded bg-primary/20" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Secondary</h3>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-secondary" />
          <div className="h-10 w-10 rounded bg-secondary/80" />
          <div className="h-10 w-10 rounded bg-secondary/60" />
          <div className="h-10 w-10 rounded bg-secondary/40" />
          <div className="h-10 w-10 rounded bg-secondary/20" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Accent</h3>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded bg-accent" />
          <div className="h-10 w-10 rounded bg-accent/80" />
          <div className="h-10 w-10 rounded bg-accent/60" />
          <div className="h-10 w-10 rounded bg-accent/40" />
          <div className="h-10 w-10 rounded bg-accent/20" />
        </div>
      </div>
    </div>
  );
};

export default ThemeColorExample;
