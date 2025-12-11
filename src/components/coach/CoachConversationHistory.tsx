import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Clock, ChevronRight, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  mood?: string;
}

interface Props {
  onSelectConversation?: (id: string) => void;
}

export default function CoachConversationHistory({ onSelectConversation }: Props) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const { data: convData, error } = await supabase
        .from('chat_conversations')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          ai_chat_messages (
            content,
            role,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (!error && convData) {
        const mapped: Conversation[] = convData.map((conv: any) => {
          const messages = conv.ai_chat_messages || [];
          const userMessages = messages.filter((m: any) => m.role === 'user');
          const lastUserMsg = userMessages[0]?.content || '';
          
          // Extract topics from conversation
          const topics: string[] = [];
          if (lastUserMsg.toLowerCase().includes('stress')) topics.push('Stress');
          if (lastUserMsg.toLowerCase().includes('sommeil')) topics.push('Sommeil');
          if (lastUserMsg.toLowerCase().includes('anxiété') || lastUserMsg.toLowerCase().includes('anxieux')) topics.push('Anxiété');
          if (lastUserMsg.toLowerCase().includes('travail')) topics.push('Travail');
          if (lastUserMsg.toLowerCase().includes('relation')) topics.push('Relations');
          if (topics.length === 0) topics.push('Général');

          return {
            id: conv.id,
            title: conv.title || 'Conversation du ' + new Date(conv.created_at).toLocaleDateString('fr-FR'),
            preview: lastUserMsg.substring(0, 100) + (lastUserMsg.length > 100 ? '...' : ''),
            messagesCount: messages.length,
            createdAt: conv.created_at,
            updatedAt: conv.updated_at,
            topics,
          };
        });
        
        setConversations(mapped);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await supabase.from('ai_chat_messages').delete().eq('conversation_id', id);
      await supabase.from('chat_conversations').delete().eq('id', id);
      setConversations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const allTopics = Array.from(new Set(conversations.flatMap(c => c.topics)));

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = filterTopic === 'all' || conv.topics.includes(filterTopic);
    
    return matchesSearch && matchesTopic;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Historique des conversations
        </CardTitle>
        <CardDescription>
          Retrouvez vos échanges précédents avec le coach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {allTopics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conversations list */}
        <ScrollArea className="h-80">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune conversation trouvée</p>
              <p className="text-sm">Commencez à discuter avec votre coach!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className="p-4 rounded-lg border hover:bg-accent/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectConversation?.(conv.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{conv.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {conv.messagesCount} msg
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conv.preview || 'Nouvelle conversation'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true, locale: fr })}
                        </span>
                        <div className="flex gap-1">
                          {conv.topics.slice(0, 2).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs py-0">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Stats */}
        {conversations.length > 0 && (
          <div className="pt-4 border-t flex justify-between text-sm text-muted-foreground">
            <span>{conversations.length} conversation{conversations.length > 1 ? 's' : ''}</span>
            <span>
              {conversations.reduce((sum, c) => sum + c.messagesCount, 0)} messages au total
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
