
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  onBackClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="bg-secondary/50 p-4 border-b flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Coach IA Personnel</h1>
        <p className="text-sm text-muted-foreground">Discutez avec votre coach pour obtenir des conseils personnalisés</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onBackClick}
        aria-label="Retour"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
    </div>
  );
};

export default ChatHeader;
