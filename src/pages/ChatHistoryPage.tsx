
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useChatHistory } from '@/hooks/chat/useChatHistory';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Trash2, History, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CoachNavigation from '@/components/coach/CoachNavigation';
import StatusIndicator from '@/components/ui/status/StatusIndicator';

const ChatHistoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    conversations,
    isLoading,
    error,
    loadConversations,
    deleteConversation,
    setActiveConversationId
  } = useChatHistory();
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  
  // Group conversations by date
  const groupedConversations = React.useMemo(() => {
    const groups: Record<string, typeof conversations> = {};
    
    if (conversations) {
      conversations.forEach(convo => {
        const date = new Date(convo.createdAt || Date.now());
        const dateKey = format(date, 'yyyy-MM-dd');
        
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        
        groups[dateKey].push(convo);
      });
    }
    
    return groups;
  }, [conversations]);
  
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    navigate('/coach-chat');
  };
  
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setIsDeleting(conversationId);
      await deleteConversation(conversationId);
      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès."
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleBackClick = () => {
    navigate('/coach');
  };
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        {/* Navigation */}
        <CoachNavigation onBackClick={handleBackClick} />
        
        {/* Loading or error states */}
        {isLoading && (
          <StatusIndicator 
            type="loading"
            position="fixed"
          />
        )}
        
        {error && (
          <StatusIndicator 
            type="error"
            title="Erreur"
            message="Impossible de charger l'historique des conversations."
            onRetry={loadConversations}
          />
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <History className="h-5 w-5" />
            Historique des conversations
          </h1>
          <p className="text-muted-foreground">
            Retrouvez toutes vos conversations précédentes avec votre coach IA.
          </p>
        </div>
        
        {/* Empty state */}
        {!isLoading && conversations && conversations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucune conversation</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore discuté avec votre coach IA.
              </p>
              <Button 
                onClick={() => navigate('/coach')}
              >
                Démarrer une conversation
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Conversations list grouped by date */}
        {!isLoading && groupedConversations && Object.entries(groupedConversations)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([dateString, convos]) => (
            <div key={dateString} className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">
                  {format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
              </div>
              
              <div className="space-y-3">
                {convos.map(conversation => (
                  <Card 
                    key={conversation.id} 
                    className={`transition-all duration-200 hover:shadow-md ${isDeleting === conversation.id ? 'opacity-50' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleSelectConversation(conversation.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-4 w-4 text-primary" />
                            <h4 className="font-medium truncate">
                              {conversation.title || 'Conversation sans titre'}
                            </h4>
                          </div>
                          
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {conversation.lastMessage}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(conversation.createdAt || Date.now()), 'HH:mm', { locale: fr })}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteConversation(conversation.id)}
                          disabled={isDeleting === conversation.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Separator className="my-4" />
            </div>
          ))}
      </div>
    </ProtectedLayout>
  );
};

export default ChatHistoryPage;
