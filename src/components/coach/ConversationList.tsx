
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  lastUpdated: Date;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onStartNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onStartNewConversation,
  onDeleteConversation
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Button 
          onClick={onStartNewConversation}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Aucune conversation. Créez-en une nouvelle.
            </p>
          ) : (
            conversations.map(conversation => {
              const isActive = conversation.id === currentConversationId;
              const formattedTime = formatDistanceToNow(
                new Date(conversation.lastUpdated),
                { addSuffix: true, locale: fr }
              );
              
              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 0.99 }}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{conversation.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formattedTime}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, conversation.id)}
                      className="h-7 w-7 opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
