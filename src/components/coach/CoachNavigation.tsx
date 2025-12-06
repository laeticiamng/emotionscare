
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/routerV2';
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, History, ChevronLeft } from 'lucide-react';

interface CoachNavigationProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const CoachNavigation: React.FC<CoachNavigationProps> = ({ 
  onBackClick, 
  showBackButton = true 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackClick} 
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        )}
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-2xl font-semibold">Coach IA</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant={currentPath === routes.consumer.coach() ? 'default' : 'outline'} 
          size="sm"
          asChild
        >
          <Link to={routes.consumer.coach()}>
            <Brain className="h-4 w-4 mr-1" />
            Accueil
          </Link>
        </Button>
        
        <Button 
          variant={currentPath === routes.consumer.coach() + '/chat' ? 'default' : 'outline'} 
          size="sm"
          asChild
        >
          <Link to={routes.consumer.coach() + '/chat'}>
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Link>
        </Button>
        
        <Button 
          variant={currentPath === routes.consumer.coach() + '/history' ? 'default' : 'outline'} 
          size="sm"
          asChild
        >
          <Link to={routes.consumer.coach() + '/history'}>
            <History className="h-4 w-4 mr-1" />
            Historique
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CoachNavigation;
