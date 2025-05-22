
import React from 'react';
import { cn } from '@/lib/utils';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedSidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  className,
  isMobile = false,
  onClose,
}) => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };
  
  return (
    <aside className={cn(
      "flex flex-col h-full w-64 border-r bg-background",
      isMobile ? "pt-4" : "pt-16",
      className
    )}>
      {isMobile && (
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="font-semibold text-lg">EmotionsCare</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Fermer</span>
          </Button>
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-2">
        <UnifiedNavigation />
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
