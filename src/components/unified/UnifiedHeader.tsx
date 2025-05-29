
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface UnifiedHeaderProps {
  onMenuToggle: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">EmotionsCare</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Profil
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
