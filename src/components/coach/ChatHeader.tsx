import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  onBackClick,
  actions 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {onBackClick && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
            className="mr-2"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      {actions && (
        <div className="flex items-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
