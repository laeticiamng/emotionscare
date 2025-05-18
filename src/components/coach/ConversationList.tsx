
import React from 'react';
import { ChatConversation } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Archive,
  Plus,
  MoreVertical,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationListProps {
  conversations: ChatConversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: ChatConversation) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (conversation: ChatConversation) => void;
  onArchiveConversation?: (conversation: ChatConversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onArchiveConversation,
}) => {
  // Helper to truncate text
  const truncateText = (text: string | undefined, maxLength: number = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Conversations</h2>
        <Button onClick={onNewConversation} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Nouvelle
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucune conversation</p>
            <p className="text-sm mt-2">
              Commencez une nouvelle conversation avec le bouton ci-dessus.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer ${
                  conversation.id === activeConversationId
                    ? 'bg-muted'
                    : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-4">
                    <h3 className="font-medium truncate">{conversation.title}</h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {truncateText(conversation.lastMessage)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt || conversation.createdAt)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onArchiveConversation && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchiveConversation(conversation);
                            }}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        )}
                        {onDeleteConversation && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
