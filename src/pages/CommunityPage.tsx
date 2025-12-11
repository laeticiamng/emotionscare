import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Send, ArrowLeft, ThumbsUp, Smile, Star, UserCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  is_member?: boolean;
  member_count?: number;
}

interface Message {
  id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  user_id?: string;
  profiles?: { display_name?: string; avatar_url?: string };
  reactions?: { emoji: string; count: number; user_reacted: boolean }[];
}

interface Member {
  id: string;
  display_name: string;
  avatar_url?: string;
  joined_at: string;
  message_count: number;
}

const REACTION_EMOJIS = ['❤️', '👍', '🙏', '💪', '🌟', '🤗'];

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    if (user) loadGroups();
  }, [user]);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('community-groups', {
        body: { action: 'list' }
      });
      if (!error && data?.groups) {
        setGroups(data.groups);
      }
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  const loadMessages = async (groupId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('community-groups', {
        body: { action: 'messages', groupId }
      });
      if (!error && data?.messages) {
        // Add mock reactions for demo
        const messagesWithReactions = data.messages.reverse().map((msg: Message) => ({
          ...msg,
          reactions: [
            { emoji: '❤️', count: Math.floor(Math.random() * 5), user_reacted: false },
            { emoji: '👍', count: Math.floor(Math.random() * 3), user_reacted: false },
          ].filter(r => r.count > 0)
        }));
        setMessages(messagesWithReactions);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const loadMembers = async (groupId: string) => {
    // Mock members for demo
    setMembers([
      { id: '1', display_name: 'Sophie M.', joined_at: '2024-01-15', message_count: 24 },
      { id: '2', display_name: 'Lucas D.', joined_at: '2024-02-20', message_count: 18 },
      { id: '3', display_name: 'Emma R.', joined_at: '2024-03-10', message_count: 12 },
      { id: '4', display_name: 'Thomas B.', joined_at: '2024-03-25', message_count: 8 },
    ]);
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { error } = await supabase.functions.invoke('community-groups', {
        body: { action: 'join', groupId }
      });
      if (!error) {
        toast({ title: 'Bienvenue!', description: 'Vous avez rejoint le groupe.' });
        loadGroups();
      }
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de rejoindre le groupe.', variant: 'destructive' });
    }
  };

  const handleSelectGroup = async (group: Group) => {
    if (!group.is_member) {
      await handleJoinGroup(group.id);
    }
    setSelectedGroup(group);
    loadMessages(group.id);
    loadMembers(group.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('community-groups', {
        body: {
          action: 'post',
          groupId: selectedGroup.id,
          content: newMessage,
          isAnonymous
        }
      });
      
      if (!error) {
        setNewMessage('');
        loadMessages(selectedGroup.id);
      }
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le message.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
      if (existingReaction) {
        return {
          ...msg,
          reactions: msg.reactions?.map(r => 
            r.emoji === emoji 
              ? { ...r, count: r.user_reacted ? r.count - 1 : r.count + 1, user_reacted: !r.user_reacted }
              : r
          )
        };
      } else {
        return {
          ...msg,
          reactions: [...(msg.reactions || []), { emoji, count: 1, user_reacted: true }]
        };
      }
    }));
  };

  if (!user) return <Navigate to="/login" replace />;

  // Filtrer les groupes
  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vue détail du groupe
  if (selectedGroup) {
    return (
      <div className="container max-w-3xl mx-auto py-6 px-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{selectedGroup.emoji}</span>
              {selectedGroup.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
          </div>
          <Badge variant="outline">{members.length} membres</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="messages" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Membres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 flex flex-col mt-4">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Soyez le premier à partager dans ce groupe! 💬
                  </p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          {msg.is_anonymous ? (
                            <AvatarFallback>👤</AvatarFallback>
                          ) : (
                            <>
                              <AvatarImage src={msg.profiles?.avatar_url} />
                              <AvatarFallback>
                                {msg.profiles?.display_name?.charAt(0) || 'M'}
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {msg.is_anonymous ? 'Anonyme' : msg.profiles?.display_name || 'Membre'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleString('fr-FR', { 
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{msg.content}</p>
                          
                          {/* Reactions */}
                          <div className="flex items-center gap-2">
                            {msg.reactions?.map(reaction => (
                              <button
                                key={reaction.emoji}
                                onClick={() => handleReaction(msg.id, reaction.emoji)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                  reaction.user_reacted 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                              >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                              </button>
                            ))}
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="p-1 rounded hover:bg-muted">
                                  <Smile className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="flex gap-1">
                                  {REACTION_EMOJIS.map(emoji => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleReaction(msg.id, emoji)}
                                      className="p-1.5 rounded hover:bg-muted text-lg"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="border-t pt-4">
              <Textarea
                placeholder="Partagez vos pensées..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-3 min-h-[80px]"
                maxLength={2000}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  <Label htmlFor="anonymous" className="text-sm">Anonyme</Label>
                </div>
                <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>{member.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.display_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Membre depuis {new Date(member.joined_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {member.message_count} messages
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Liste des groupes
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Communauté
        </h1>
        <p className="text-muted-foreground">
          Rejoignez des groupes de soutien bienveillants et partagez en toute sécurité.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un groupe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredGroups.map(group => (
          <Card 
            key={group.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              group.is_member ? 'border-primary/50' : ''
            }`}
            onClick={() => handleSelectGroup(group)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{group.emoji}</span>
                {group.name}
                {group.is_member && (
                  <Badge variant="secondary" className="ml-auto">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    Membre
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {group.member_count || '10+'} membres
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Actif
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        🔒 Tous les échanges sont confidentiels et modérés pour garantir un espace bienveillant.
      </p>
    </div>
  );
}
