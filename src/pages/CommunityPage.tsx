import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, MessageCircle, Heart, Send, ArrowLeft, Smile, Search, Plus,
  TrendingUp, Bookmark, Flag, Settings, BarChart3, UserPlus
} from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useCommunityGroups, useCommunityPosts } from '@/hooks/community';
import { CommunityReportService, REPORT_REASONS, ReportReason } from '@/modules/community/services';
import { CommunitySavedPostsService } from '@/modules/community/services';
import { motion, AnimatePresence } from 'framer-motion';
import { MentionTextarea } from '@/components/community/MentionTextarea';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { NotificationBell } from '@/components/community/NotificationBell';
import { EmpathyTemplates } from '@/components/community/EmpathyTemplates';

const REACTION_EMOJIS = ['❤️', '👍', '🙏', '💪', '🌟', '🤗'];

interface GroupMessage {
  id: string;
  content: string;
  is_anonymous?: boolean;
  created_at: string;
  author_id: string;
  author?: { full_name?: string; avatar_url?: string };
  reactions?: { emoji: string; count: number; user_reacted: boolean }[];
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: { full_name?: string; avatar_url?: string };
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Hooks pour les données
  const { groups, myGroups, loading: groupsLoading, joinGroup, leaveGroup, createGroup, refresh: refreshGroups } = useCommunityGroups();
  const { posts, loading: postsLoading, createPost, toggleReaction, refresh: refreshPosts } = useCommunityPosts();
  
  // États locaux
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [activeGroupTab, setActiveGroupTab] = useState('messages');
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  
  // États pour les modals
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'comment' | 'user'; id: string } | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>('other');
  const [reportDescription, setReportDescription] = useState('');
  
  // Nouveau groupe
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('👥');
  const [newGroupPrivate, setNewGroupPrivate] = useState(false);

  // Charger les posts sauvegardés
  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        const ids = await CommunitySavedPostsService.getSavedPosts();
        setSavedPostIds(ids);
      } catch (err) {
        console.error('Failed to load saved posts:', err);
      }
    };
    if (user) loadSavedPosts();
  }, [user]);

  // Charger les messages d'un groupe
  const loadGroupMessages = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles!community_posts_author_id_fkey(full_name, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      
      setMessages((data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        author_id: msg.author_id,
        author: msg.profiles,
        reactions: []
      })));
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }, []);

  // Charger les membres d'un groupe
  const loadGroupMembers = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_group_members')
        .select('*, profiles!community_group_members_user_id_fkey(full_name, avatar_url)')
        .eq('group_id', groupId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (error) throw error;
      
      setMembers((data || []).map(m => ({
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        joined_at: m.joined_at,
        profile: m.profiles
      })));
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  }, []);

  const handleSelectGroup = async (group: any) => {
    if (!group.is_member) {
      await joinGroup(group.id);
    }
    setSelectedGroup(group);
    loadGroupMessages(group.id);
    loadGroupMembers(group.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup || !user) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          group_id: selectedGroup.id,
          author_id: user.id,
          title: 'Message',
          content: newMessage,
          likes_count: 0,
          comments_count: 0
        });

      if (error) throw error;
      
      setNewMessage('');
      loadGroupMessages(selectedGroup.id);
      toast({ title: 'Message envoyé ✓' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le message.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    try {
      await createPost({
        content: newPostContent,
        isAnonymous
      });
      setNewPostContent('');
      setIsAnonymous(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({ title: 'Nom requis', variant: 'destructive' });
      return;
    }

    await createGroup({
      name: newGroupName,
      description: newGroupDescription,
      icon: newGroupIcon,
      is_private: newGroupPrivate
    });

    setShowCreateGroup(false);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupIcon('👥');
    setNewGroupPrivate(false);
  };

  const handleReport = async () => {
    if (!reportTarget) return;

    try {
      if (reportTarget.type === 'post') {
        await CommunityReportService.reportPost(reportTarget.id, reportReason, reportDescription);
      } else if (reportTarget.type === 'comment') {
        await CommunityReportService.reportComment(reportTarget.id, reportReason, reportDescription);
      } else {
        await CommunityReportService.reportUser(reportTarget.id, reportReason, reportDescription);
      }

      toast({ title: 'Signalement envoyé', description: 'Merci, notre équipe va examiner ce contenu.' });
      setShowReportModal(false);
      setReportTarget(null);
      setReportDescription('');
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le signalement.', variant: 'destructive' });
    }
  };

  const handleToggleSavePost = async (postId: string) => {
    try {
      const isSaved = await CommunitySavedPostsService.toggleSavePost(postId);
      setSavedPostIds(prev => 
        isSaved ? [...prev, postId] : prev.filter(id => id !== postId)
      );
      toast({ title: isSaved ? 'Post sauvegardé' : 'Post retiré des favoris' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
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
          ).filter(r => r.count > 0)
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
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span>{selectedGroup.icon || '👥'}</span>
              {selectedGroup.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
          </div>
          <Badge variant="outline">{members.length} membres</Badge>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              leaveGroup(selectedGroup.id);
              setSelectedGroup(null);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeGroupTab} onValueChange={setActiveGroupTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="messages" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Membres ({members.length})
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
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.author?.avatar_url} />
                          <AvatarFallback>
                            {msg.author?.full_name?.charAt(0) || 'M'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {msg.author?.full_name || 'Membre'}
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

                            <button 
                              className="p-1 rounded hover:bg-muted ml-auto"
                              onClick={() => {
                                setReportTarget({ type: 'post', id: msg.id });
                                setShowReportModal(true);
                              }}
                            >
                              <Flag className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
              <div className="flex items-center justify-end">
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
                      <AvatarImage src={member.profile?.avatar_url} />
                      <AvatarFallback>{member.profile?.full_name?.charAt(0) || 'M'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.profile?.full_name || 'Membre'}</p>
                      <p className="text-xs text-muted-foreground">
                        Membre depuis {new Date(member.joined_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {member.role === 'admin' ? 'Admin' : 'Membre'}
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

  // Vue principale
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Communauté
          </h1>
          <div className="flex items-center gap-2">
            <CommunitySearch />
            <NotificationBell />
          </div>
        </div>
        <p className="text-muted-foreground text-center">
          Rejoignez des groupes de soutien bienveillants et partagez en toute sécurité.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Fil</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Groupes</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Tendances</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Favoris</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Fil */}
        <TabsContent value="feed" className="space-y-6">
          {/* Composer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Partager avec la communauté</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MentionTextarea
                value={newPostContent}
                onChange={setNewPostContent}
                placeholder="Comment vous sentez-vous aujourd'hui ? Utilisez @ pour mentionner quelqu'un..."
                minRows={3}
              />
              <EmpathyTemplates 
                onSelect={(template: string) => setNewPostContent(prev => prev + ' ' + template)} 
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="anon-post" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  <Label htmlFor="anon-post" className="text-sm">Publier anonymement</Label>
                </div>
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {postsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun post pour le moment. Soyez le premier à partager !
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{post.is_anonymous ? '👤' : 'M'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {post.is_anonymous ? 'Anonyme' : 'Membre'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleReaction(post.id, 'like')}
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments_count}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleSavePost(post.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${savedPostIds.includes(post.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-auto"
                            onClick={() => {
                              setReportTarget({ type: 'post', id: post.id });
                              setShowReportModal(true);
                            }}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Groupes */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un groupe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un groupe</DialogTitle>
                  <DialogDescription>
                    Créez un espace de partage pour votre communauté.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nom du groupe</Label>
                    <Input 
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Ex: Gestion du stress"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      placeholder="Décrivez l'objectif de ce groupe..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icône</Label>
                    <div className="flex gap-2">
                      {['👥', '🧘', '💪', '🌿', '❤️', '🌟', '🎯', '🧠'].map(icon => (
                        <button
                          key={icon}
                          onClick={() => setNewGroupIcon(icon)}
                          className={`text-2xl p-2 rounded-lg ${newGroupIcon === icon ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted'}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="private-group"
                      checked={newGroupPrivate}
                      onCheckedChange={setNewGroupPrivate}
                    />
                    <Label htmlFor="private-group">Groupe privé</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    Créer le groupe
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mes groupes */}
          {myGroups.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Mes groupes
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {myGroups.map(group => (
                  <Card 
                    key={group.id} 
                    className="cursor-pointer transition-all hover:shadow-md border-primary/30"
                    onClick={() => handleSelectGroup(group)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{group.icon || '👥'}</span>
                        {group.name}
                        <Badge variant="secondary" className="ml-auto">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Membre
                        </Badge>
                      </CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.member_count} membres
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Découvrir */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Découvrir
            </h3>
            {groupsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun groupe trouvé. Créez le premier !
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGroups.filter(g => !g.is_member).map(group => (
                  <Card 
                    key={group.id} 
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleSelectGroup(group)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{group.icon || '👥'}</span>
                        {group.name}
                        {group.is_private && (
                          <Badge variant="outline" className="ml-auto">
                            Privé
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {group.member_count} membres
                        </span>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Rejoindre
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Onglet Tendances */}
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Posts populaires
              </CardTitle>
              <CardDescription>Les discussions les plus engagées cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune tendance pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {[...posts]
                    .sort((a, b) => b.likes_count - a.likes_count)
                    .slice(0, 5)
                    .map((post, idx) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-lg font-bold text-primary">#{idx + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {post.likes_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comments_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{posts.length}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{groups.length}</p>
                  <p className="text-xs text-muted-foreground">Groupes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {posts.reduce((sum, p) => sum + p.likes_count, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Réactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Favoris */}
        <TabsContent value="saved" className="space-y-4">
          {savedPostIds.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun favori</h3>
              <p className="text-muted-foreground text-sm">
                Sauvegardez des posts pour les retrouver ici.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts
                .filter(p => savedPostIds.includes(p.id))
                .map(post => (
                  <Card key={post.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{post.is_anonymous ? '👤' : 'M'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm mb-2">{post.content}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="ml-auto"
                              onClick={() => handleToggleSavePost(post.id)}
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de signalement */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler un contenu</DialogTitle>
            <DialogDescription>
              Aidez-nous à maintenir un espace bienveillant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Raison du signalement</Label>
              <Select value={reportReason} onValueChange={(v) => setReportReason(v as ReportReason)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map(reason => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Décrivez le problème..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleReport} variant="destructive">
              <Flag className="h-4 w-4 mr-2" />
              Signaler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-xs text-muted-foreground text-center mt-8">
        🔒 Tous les échanges sont confidentiels et modérés pour garantir un espace bienveillant.
      </p>
    </div>
  );
}
