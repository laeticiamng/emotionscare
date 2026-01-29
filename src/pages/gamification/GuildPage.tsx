import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Send,
  ArrowLeft,
  Crown,
  Shield as ShieldIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { guildService, GuildMessage } from '@/services/guild-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const GuildPage: React.FC = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: guild, isLoading: guildLoading } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => guildService.getGuildById(guildId!),
    enabled: !!guildId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['guild-members', guildId],
    queryFn: () => guildService.getGuildMembers(guildId!),
    enabled: !!guildId,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['guild-messages', guildId],
    queryFn: () => guildService.getMessages(guildId!),
    enabled: !!guildId,
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['guild-challenges', guildId],
    queryFn: () => guildService.getGuildChallenges(guildId!),
    enabled: !!guildId,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    if (!guildId) return;

    const unsubscribe = guildService.subscribeToGuildMessages(guildId, (newMessage) => {
      queryClient.setQueryData(['guild-messages', guildId], (old: GuildMessage[] | undefined) => {
        if (!old) return [newMessage];
        return [...old, newMessage];
      });
    });

    return unsubscribe;
  }, [guildId, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !guildId) return;

    const sent = await guildService.sendMessage(guildId, message);
    if (sent) {
      setMessage('');
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message.',
        variant: 'destructive',
      });
    }
  };

  const handleLeaveGuild = async () => {
    if (!guildId) return;

    const success = await guildService.leaveGuild(guildId);
    if (success) {
      toast({
        title: 'Guilde quittée',
        description: 'Vous avez quitté la guilde.',
      });
      navigate('/app/guilds');
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de quitter la guilde.',
        variant: 'destructive',
      });
    }
  };

  if (guildLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl text-center">
        <p>Guilde non trouvée</p>
        <Button onClick={() => navigate('/app/guilds')} className="mt-4">
          Retour aux guildes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/app/guilds')} aria-label="Retour aux guildes">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{guild.name}</h1>
              <p className="text-muted-foreground">{guild.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLeaveGuild}>
            Quitter la guilde
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{guild.member_count}</p>
                <p className="text-sm text-muted-foreground">Membres</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{guild.total_xp.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{challenges?.filter(c => c.status === 'active').length || 0}</p>
                <p className="text-sm text-muted-foreground">Défis actifs</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat & Challenges */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="challenges">
                  <Target className="w-4 h-4 mr-2" />
                  Défis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="h-[600px]">
                <Card className="h-full flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-16 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages?.map((msg) => (
                          <div key={msg.id} className="flex gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={msg.user?.avatar_url} />
                              <AvatarFallback>
                                {msg.user?.display_name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm">
                                  {msg.user?.display_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Écrivez un message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="icon" aria-label="Envoyer le message">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="challenges">
                <Card className="p-6">
                  {challengesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {challenges?.map((challenge) => (
                        <Card key={challenge.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{challenge.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {challenge.description}
                              </p>
                            </div>
                            <Badge variant={challenge.status === 'completed' ? 'default' : 'secondary'}>
                              {challenge.status === 'completed' ? 'Terminé' : 'En cours'}
                            </Badge>
                          </div>
                          <Progress
                            value={(challenge.current_value / challenge.target_value) * 100}
                            className="mb-2"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {challenge.current_value} / {challenge.target_value}
                            </span>
                            <span className="font-semibold text-primary">
                              +{challenge.reward_xp} XP
                            </span>
                          </div>
                        </Card>
                      ))}
                      {challenges?.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          Aucun défi actif pour le moment
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Members Sidebar */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Membres ({members?.length || 0})
            </h3>
            <ScrollArea className="h-[550px]">
              {membersLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.user?.avatar_url} />
                        <AvatarFallback>
                          {member.user?.display_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{member.user?.display_name}</p>
                          {member.role === 'owner' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          {member.role === 'admin' && (
                            <ShieldIcon className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {member.contribution_xp.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default GuildPage;
