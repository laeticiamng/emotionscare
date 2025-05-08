
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatHeaderProps {
  onBackClick: () => void;
  title?: string;
  actions?: ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onBackClick, 
  title = "Coach IA Personnel",
  actions 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-secondary/50 p-3 md:p-4 border-b flex justify-between items-center">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBackClick}
          aria-label="Retour"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Retour</span>
        </Button>
        <div>
          <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
          {!isMobile && (
            <p className="text-sm text-muted-foreground">Discutez avec votre coach pour obtenir des conseils personnalisés</p>
          )}
        </div>
      </div>
      {actions}
    </div>
  );
};

export default ChatHeader;
