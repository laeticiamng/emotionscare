
import React from 'react';
import { Button } from '@/components/ui/button';

export const TopNav: React.FC = () => {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">EmotionsCare</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          Paramètres
        </Button>
      </div>
    </header>
  );
};
