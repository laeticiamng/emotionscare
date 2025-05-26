
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import AuthButton from '@/components/auth/AuthButton';

interface UnifiedHeaderProps {
  onMenuClick?: () => void;
  onMenuToggle?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  onMenuClick, 
  onMenuToggle 
}) => {
  const handleMenuClick = onMenuClick || onMenuToggle;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">EmotionsCare</h1>
          </div>
          
          <nav className="flex items-center space-x-2">
            <AuthButton variant="ghost" />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
