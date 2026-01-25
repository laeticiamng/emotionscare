import { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Calendar, Clock, ChevronRight, Trash2, Search, Filter,
  Download, Share2, Star, Archive, MoreVertical, FileText, TrendingUp,
  Bookmark, Tag, Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, format, subDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

type PeriodFilter = 'all' | '7days' | '30days';
type SortOption = 'recent' | 'oldest' | 'messages';

export default function CoachConversationHistory({ onSelectConversation }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('coachConversationFavorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

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
        .limit(50);

      if (!error && convData) {
        const mapped: Conversation[] = convData.map((conv: any) => {
          const messages = conv.ai_chat_messages || [];
          const userMessages = messages.filter((m: any) => m.role === 'user');
          const lastUserMsg = userMessages[0]?.content || '';
          
          // Extract topics from conversation
          const topics: string[] = [];
          const content = messages.map((m: any) => m.content).join(' ').toLowerCase();
          if (content.includes('stress')) topics.push('Stress');
          if (content.includes('sommeil')) topics.push('Sommeil');
          if (content.includes('anxiété') || content.includes('anxieux')) topics.push('Anxiété');
          if (content.includes('travail')) topics.push('Travail');
          if (content.includes('relation')) topics.push('Relations');
          if (content.includes('motivation')) topics.push('Motivation');
          if (content.includes('émotion')) topics.push('Émotions');
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

  // Filtrer et trier
  const filteredConversations = useMemo(() => {
    let result = conversations.filter(conv => {
      // Recherche
      const matchesSearch = searchQuery === '' || 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre topic
      const matchesTopic = filterTopic === 'all' || conv.topics.includes(filterTopic);
      
      // Filtre période
      const convDate = new Date(conv.updatedAt);
      const now = new Date();
      let matchesPeriod = true;
      if (periodFilter === '7days') {
        matchesPeriod = isWithinInterval(convDate, { start: subDays(now, 7), end: now });
      } else if (periodFilter === '30days') {
        matchesPeriod = isWithinInterval(convDate, { start: subDays(now, 30), end: now });
      }

      // Favoris
      const matchesFavorites = !showFavoritesOnly || favorites.has(conv.id);
      
      return matchesSearch && matchesTopic && matchesPeriod && matchesFavorites;
    });

    // Tri
    result.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'messages':
          return b.messagesCount - a.messagesCount;
        default: // recent
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  }, [conversations, searchQuery, filterTopic, periodFilter, sortOption, showFavoritesOnly, favorites]);

  const allTopics = useMemo(() => {
    return Array.from(new Set(conversations.flatMap(c => c.topics)));
  }, [conversations]);

  // Stats
  const stats = useMemo(() => {
    const totalMessages = conversations.reduce((sum, c) => sum + c.messagesCount, 0);
    const topicCounts = conversations.flatMap(c => c.topics)
      .reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return { totalMessages, topTopic, totalConversations: conversations.length };
  }, [conversations]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      localStorage.setItem('coachConversationFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const deleteConversation = async (id: string) => {
    try {
      await supabase.from('ai_chat_messages').delete().eq('conversation_id', id);
      await supabase.from('chat_conversations').delete().eq('id', id);
      setConversations(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Conversation supprimée' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const deleteSelectedConversations = async () => {
    try {
      for (const id of selectedConversations) {
        await supabase.from('ai_chat_messages').delete().eq('conversation_id', id);
        await supabase.from('chat_conversations').delete().eq('id', id);
      }
      setConversations(prev => prev.filter(c => !selectedConversations.has(c.id)));
      setSelectedConversations(new Set());
      setShowDeleteDialog(false);
      toast({ title: `${selectedConversations.size} conversation(s) supprimée(s)` });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const exportConversations = async () => {
    const toExport = selectedConversations.size > 0 
      ? conversations.filter(c => selectedConversations.has(c.id))
      : filteredConversations;
    
    const exportData = toExport.map(c => ({
      title: c.title,
      date: format(new Date(c.createdAt), 'yyyy-MM-dd HH:mm'),
      messages: c.messagesCount,
      topics: c.topics.join(', '),
      preview: c.preview
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `conversations_coach_${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    
    setShowExportDialog(false);
    toast({ title: 'Export réussi', description: `${toExport.length} conversation(s)` });
  };

  const shareStats = async () => {
    const text = `🤖 Mon parcours coaching IA:\n💬 ${stats.totalConversations} conversations\n📝 ${stats.totalMessages} messages échangés\n🏷️ Thème principal: ${stats.topTopic}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon coaching EmotionsCare', text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !' });
    }
  };

  const toggleSelectConversation = (id: string) => {
    setSelectedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedConversations.size === filteredConversations.length) {
      setSelectedConversations(new Set());
    } else {
      setSelectedConversations(new Set(filteredConversations.map(c => c.id)));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Historique des conversations
            </CardTitle>
            <CardDescription>
              Retrouvez vos échanges précédents avec le coach
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareStats}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg bg-primary/5">
            <p className="text-lg font-bold text-primary">{stats.totalConversations}</p>
            <p className="text-xs text-muted-foreground">Conversations</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary/5">
            <p className="text-lg font-bold text-secondary">{stats.totalMessages}</p>
            <p className="text-xs text-muted-foreground">Messages</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-accent/10">
            <p className="text-lg font-bold">{stats.topTopic}</p>
            <p className="text-xs text-muted-foreground">Thème top</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="w-32">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {allTopics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout</SelectItem>
              <SelectItem value="7days">7 jours</SelectItem>
              <SelectItem value="30days">30 jours</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Actions en masse */}
        {selectedConversations.size > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedConversations.size} sélectionnée(s)
            </span>
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        )}

        {/* Liste */}
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
              {/* Select all */}
              <div className="flex items-center gap-2 px-2 py-1">
                <Checkbox
                  checked={selectedConversations.size === filteredConversations.length && filteredConversations.length > 0}
                  onCheckedChange={selectAll}
                />
                <span className="text-xs text-muted-foreground">Tout sélectionner</span>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredConversations.map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 rounded-lg border hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedConversations.has(conv.id)}
                        onCheckedChange={() => toggleSelectConversation(conv.id)}
                        className="mt-1"
                      />
                      
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => onSelectConversation?.(conv.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{conv.title}</p>
                          {favorites.has(conv.id) && (
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          )}
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

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSelectConversation?.(conv.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFavorite(conv.id)}>
                            <Star className={`h-4 w-4 mr-2 ${favorites.has(conv.id) ? 'fill-amber-400' : ''}`} />
                            {favorites.has(conv.id) ? 'Retirer favori' : 'Ajouter favori'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setConversationToDelete(conv.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer stats */}
        {conversations.length > 0 && (
          <div className="pt-4 border-t flex justify-between text-sm text-muted-foreground">
            <span>{filteredConversations.length} / {conversations.length} conversation(s)</span>
            <span>{stats.totalMessages} messages au total</span>
          </div>
        )}
      </CardContent>

      {/* Dialog suppression en masse */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer les conversations ?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedConversations.size} conversation(s) seront supprimées définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSelectedConversations} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog suppression simple */}
      <AlertDialog open={!!conversationToDelete} onOpenChange={() => setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette conversation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (conversationToDelete) {
                  deleteConversation(conversationToDelete);
                  setConversationToDelete(null);
                }
              }} 
              className="bg-destructive"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog export */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les conversations</DialogTitle>
            <DialogDescription>
              {selectedConversations.size > 0 
                ? `${selectedConversations.size} conversation(s) sélectionnée(s)`
                : `${filteredConversations.length} conversation(s) filtrée(s)`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Annuler</Button>
            <Button onClick={exportConversations}>
              <Download className="h-4 w-4 mr-2" />
              Exporter JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
