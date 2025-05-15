
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ThemeColorExample: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Theme Color Examples</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-primary"></div>
            <span className="text-sm">Primary</span>
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-secondary"></div>
            <span className="text-sm">Secondary</span>
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-accent"></div>
            <span className="text-sm">Accent</span>
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-muted"></div>
            <span className="text-sm">Muted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColorExample;
