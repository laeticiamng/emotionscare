
import React from 'react';
import { ChatConversation } from '@/types/chat';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

interface ConversationTimelineProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  className?: string;
}

const ConversationTimeline: React.FC<ConversationTimelineProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  className,
}) => {
  // Group conversations by date
  const groupedConversations = conversations.reduce<Record<string, ChatConversation[]>>(
    (acc, conversation) => {
      const date = conversation.createdAt.split('T')[0]; // YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(conversation);
      return acc;
    },
    {}
  );
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedConversations).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Function to get emotional tone from conversation content
  const getEmotionalTone = (conversation: ChatConversation): string => {
    const emotions = ['serein', 'joyeux', 'stressé', 'inquiet', 'enthousiaste', 'fatigué', 'motivé'];
    // In a real app, this would analyze the content
    // For demo, we'll use a deterministic choice based on conversation id
    const hash = conversation.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emotions[hash % emotions.length];
  };
  
  return (
    <div className={cn("space-y-6", className)} role="navigation" aria-label="Historique des conversations">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">
              {format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })}
            </h3>
          </div>
          
          <div className="space-y-1.5 pl-5 border-l-2 border-muted">
            {groupedConversations[date].map((conversation) => {
              const isActive = activeConversationId === conversation.id;
              const emotionalTone = getEmotionalTone(conversation);
              const createdTime = new Date(conversation.createdAt);
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "w-full flex items-center text-left p-2 rounded-md transition-colors gap-3 hover:bg-accent group",
                    isActive && "bg-accent"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="relative">
                    <MessageSquare className="h-5 w-5 text-primary opacity-80" />
                    <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-primary"></span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">{conversation.title}</h4>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {format(createdTime, "HH:mm")}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="outline" className="text-xs">
                        {emotionalTone}
                      </Badge>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage || "Nouvelle conversation"}
                      </p>
                    </div>
                  </div>
                  
                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
                    isActive && "opacity-100"
                  )} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {sortedDates.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>Aucune conversation pour le moment</p>
          <p className="text-sm mt-1">Commencez à discuter avec votre coach</p>
        </div>
      )}
    </div>
  );
};

export default ConversationTimeline;
