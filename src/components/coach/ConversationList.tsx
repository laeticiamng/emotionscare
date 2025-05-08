
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatConversation } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ConversationListProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full md:w-64 h-full flex flex-col bg-background border-r">
      <div className="p-3 border-b">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={onNewConversation}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouvelle conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-2">
          {conversations.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">
              Aucune conversation récente
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`
                  flex justify-between items-center p-3 my-1 rounded-lg cursor-pointer hover:bg-secondary/80 
                  ${activeConversationId === conversation.id ? 'bg-secondary' : ''}
                `}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="truncate flex-grow">
                  <p className="font-medium truncate">{conversation.title || "Nouvelle conversation"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage || "Aucun message"}
                  </p>
                  <p className="text-xs mt-1">
                    {conversation.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
