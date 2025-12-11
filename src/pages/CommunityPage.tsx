import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Send, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  profiles?: { display_name?: string };
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);

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
        setMessages(data.messages.reverse());
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
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

  if (!user) return <Navigate to="/login" replace />;

  // Vue détail du groupe
  if (selectedGroup) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{selectedGroup.emoji}</span>
              {selectedGroup.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Soyez le premier à partager dans ce groupe! 💬
              </p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {msg.is_anonymous ? '👤 Anonyme' : msg.profiles?.display_name || 'Membre'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString('fr-FR', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
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
              <Label htmlFor="anonymous" className="text-sm">Poster anonymement</Label>
            </div>
            <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(group => (
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
                  <MessageCircle className="h-4 w-4" />
                  Discussions
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
