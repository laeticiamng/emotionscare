// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const InstantGlowWidget: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        aria-label="Activer l'effet Glow instantané"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default InstantGlowWidget;
