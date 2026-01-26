// @ts-nocheck

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, Search, MessageCircle, UserMinus, MoreVertical, Check, X, Clock,
  Star, StarOff, Trophy, Filter, SortAsc, SortDesc, Users,
  Download, Share2, Eye, Flame, Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  streak?: number;
  level?: number;
  xp?: number;
  badges?: number;
  joinDate?: string;
  activitiesThisWeek?: number;
  isFavorite?: boolean;
  group?: string;
  bio?: string;
}

interface FriendGroup {
  id: string;
  name: string;
  color: string;
}

const friendGroups: FriendGroup[] = [
  { id: 'family', name: 'Famille', color: 'bg-rose-500' },
  { id: 'work', name: 'Travail', color: 'bg-blue-500' },
  { id: 'sport', name: 'Sport', color: 'bg-green-500' },
  { id: 'therapy', name: 'Thérapie', color: 'bg-purple-500' },
];

const initialFriends: Friend[] = [
  { id: 1, name: 'Marie D.', status: 'online', streak: 12, level: 8, xp: 2450, badges: 15, joinDate: '2024-01-15', activitiesThisWeek: 5, group: 'family', bio: 'Passionnée de méditation' },
  { id: 2, name: 'Thomas L.', status: 'away', lastSeen: 'Il y a 15 min', streak: 5, level: 6, xp: 1800, badges: 10, joinDate: '2024-02-20', activitiesThisWeek: 3, group: 'work' },
  { id: 3, name: 'Julie M.', status: 'offline', lastSeen: 'Hier', streak: 28, level: 12, xp: 4200, badges: 22, joinDate: '2023-11-10', activitiesThisWeek: 7, group: 'sport', bio: 'Coach bien-être certifiée' },
  { id: 4, name: 'Lucas P.', status: 'online', streak: 3, level: 4, xp: 950, badges: 5, joinDate: '2024-06-01', activitiesThisWeek: 2 },
  { id: 5, name: 'Emma R.', status: 'offline', lastSeen: 'Il y a 2 jours', level: 5, xp: 1200, badges: 8, joinDate: '2024-04-15', activitiesThisWeek: 1, group: 'therapy' },
  { id: 6, name: 'Hugo B.', status: 'online', streak: 7, level: 7, xp: 2100, badges: 12, joinDate: '2024-03-08', activitiesThisWeek: 4, group: 'sport' },
];

const suggestedFriends = [
  { id: 101, name: 'Claire T.', mutualFriends: 3, level: 9, streak: 15 },
  { id: 102, name: 'Marc V.', mutualFriends: 5, level: 11, streak: 22 },
  { id: 103, name: 'Léa B.', mutualFriends: 2, level: 6, streak: 8 },
];

const pendingRequests = [
  { id: 7, name: 'Sophie V.', type: 'received', level: 5 },
  { id: 8, name: 'Antoine C.', type: 'sent', level: 7 },
];

type SortOption = 'name' | 'streak' | 'level' | 'activity' | 'online';

const FAVORITES_KEY = 'friends_favorites';

export default function FriendsPage() {
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Update friends with favorites
  useEffect(() => {
    setFriends(prev => prev.map(f => ({
      ...f,
      isFavorite: favorites.includes(f.id)
    })));
  }, [favorites]);

  const toggleFavorite = (friendId: number) => {
    const newFavorites = favorites.includes(friendId)
      ? favorites.filter(id => id !== friendId)
      : [...favorites, friendId];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(friendId) ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: favorites.includes(friendId) 
        ? 'Cet ami a été retiré de vos favoris'
        : 'Cet ami a été ajouté à vos favoris',
    });
  };

  const filteredFriends = useMemo(() => {
    let result = friends;
    
    if (searchQuery) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filter === 'online') {
      result = result.filter(f => f.status === 'online');
    } else if (filter === 'favorites') {
      result = result.filter(f => f.isFavorite);
    }

    if (groupFilter !== 'all') {
      result = result.filter(f => f.group === groupFilter);
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'streak':
          comparison = (b.streak || 0) - (a.streak || 0);
          break;
        case 'level':
          comparison = (b.level || 0) - (a.level || 0);
          break;
        case 'activity':
          comparison = (b.activitiesThisWeek || 0) - (a.activitiesThisWeek || 0);
          break;
        case 'online':
          const statusOrder = { online: 0, away: 1, offline: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [friends, searchQuery, filter, groupFilter, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: friends.length,
    online: friends.filter(f => f.status === 'online').length,
    avgLevel: Math.round(friends.reduce((sum, f) => sum + (f.level || 0), 0) / friends.length),
    totalStreak: friends.reduce((sum, f) => sum + (f.streak || 0), 0),
    favorites: friends.filter(f => f.isFavorite).length,
  }), [friends]);

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = (friend: Friend) => {
    if (friend.status === 'online') return 'En ligne';
    if (friend.status === 'away') return friend.lastSeen || 'Absent';
    return friend.lastSeen || 'Hors ligne';
  };

  const handleRemoveFriend = (id: number) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    toast({ title: 'Ami retiré', description: 'L\'ami a été retiré de votre liste.' });
  };

  const handleAcceptRequest = (name: string) => {
    toast({ title: 'Demande acceptée', description: `${name} est maintenant votre ami !` });
  };

  const handleDeclineRequest = (name: string) => {
    toast({ title: 'Demande refusée', description: `La demande de ${name} a été refusée.` });
  };

  const viewProfile = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowProfileDialog(true);
  };

  const exportFriends = () => {
    const data = friends.map(f => ({
      nom: f.name,
      niveau: f.level,
      streak: f.streak,
      badges: f.badges,
      statut: f.status,
      groupe: f.group || 'Aucun',
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes-amis.csv';
    a.click();
    
    toast({ title: 'Export réussi', description: 'Liste exportée en CSV' });
  };

  const shareFriendsList = async () => {
    const text = `👥 J'ai ${friends.length} amis sur EmotionsCare! Notre niveau moyen est ${stats.avgLevel} et nous cumulons ${stats.totalStreak} jours de streak! #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier.' });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier.' });
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Mes Amis</h1>
            <p className="text-muted-foreground">
              {friends.length} amis • {stats.online} en ligne
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={exportFriends}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" onClick={shareFriendsList}>
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un ami
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total amis</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="h-5 w-5 mx-auto mb-2 rounded-full bg-green-500" />
            <p className="text-2xl font-bold">{stats.online}</p>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.avgLevel}</p>
            <p className="text-xs text-muted-foreground">Niveau moyen</p>
          </Card>
          <Card className="p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalStreak}</p>
            <p className="text-xs text-muted-foreground">Jours cumulés</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{stats.favorites}</p>
            <p className="text-xs text-muted-foreground">Favoris</p>
          </Card>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList>
            <TabsTrigger value="friends">Amis ({friends.length})</TabsTrigger>
            <TabsTrigger value="requests">
              Demandes
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingRequests.filter(r => r.type === 'received').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un ami..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="online">En ligne</SelectItem>
                    <SelectItem value="favorites">Favoris</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="w-32">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les groupes</SelectItem>
                    {friendGroups.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                    <SelectItem value="level">Niveau</SelectItem>
                    <SelectItem value="activity">Activité</SelectItem>
                    <SelectItem value="online">Statut</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Friends Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{friend.name}</p>
                            {friend.isFavorite && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{getStatusLabel(friend)}</p>
                            {friend.group && (
                              <Badge variant="outline" className="text-xs">
                                {friendGroups.find(g => g.id === friend.group)?.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewProfile(friend)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFavorite(friend.id)}>
                              {friend.isFavorite ? (
                                <>
                                  <StarOff className="mr-2 h-4 w-4" />
                                  Retirer des favoris
                                </>
                              ) : (
                                <>
                                  <Star className="mr-2 h-4 w-4" />
                                  Ajouter aux favoris
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Assigner au groupe</DropdownMenuLabel>
                            {friendGroups.map(g => (
                              <DropdownMenuItem key={g.id} onClick={() => {
                                setFriends(prev => prev.map(f => 
                                  f.id === friend.id ? { ...f, group: g.id } : f
                                ));
                              }}>
                                <div className={`h-2 w-2 rounded-full mr-2 ${g.color}`} />
                                {g.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleRemoveFriend(friend.id)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Retirer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        {friend.streak && friend.streak > 0 && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="secondary" className="gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {friend.streak}j
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Série de {friend.streak} jours</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              Nv.{friend.level}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>{friend.xp?.toLocaleString()} XP</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1">
                              <Award className="h-3 w-3 text-purple-500" />
                              {friend.badges}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>{friend.badges} badges débloqués</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Activity this week */}
                      {friend.activitiesThisWeek !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Activité cette semaine</span>
                            <span>{friend.activitiesThisWeek}/7</span>
                          </div>
                          <Progress value={(friend.activitiesThisWeek / 7) * 100} className="h-1" />
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredFriends.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun ami trouvé</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Demandes reçues</h3>
              {pendingRequests.filter(r => r.type === 'received').map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{request.name}</p>
                      <p className="text-sm text-muted-foreground">Niveau {request.level} • Souhaite vous ajouter</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.name)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeclineRequest(request.name)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <h3 className="font-semibold mt-6">Demandes envoyées</h3>
              {pendingRequests.filter(r => r.type === 'sent').map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{request.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> En attente
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">Annuler</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <p className="text-muted-foreground">Personnes que vous pourriez connaître</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedFriends.map((suggestion) => (
                <Card key={suggestion.id} className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{suggestion.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{suggestion.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.mutualFriends} amis en commun
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">
                      <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                      Nv.{suggestion.level}
                    </Badge>
                    <Badge variant="secondary">
                      <Flame className="h-3 w-3 mr-1 text-orange-500" />
                      {suggestion.streak}j
                    </Badge>
                  </div>
                  
                  <Button className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {selectedFriend?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{selectedFriend?.name}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Membre depuis {selectedFriend?.joinDate && new Date(selectedFriend.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedFriend && (
              <div className="space-y-4">
                {selectedFriend.bio && (
                  <p className="text-sm text-muted-foreground italic">"{selectedFriend.bio}"</p>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                    <p className="text-xl font-bold">{selectedFriend.level}</p>
                    <p className="text-xs text-muted-foreground">Niveau</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                    <p className="text-xl font-bold">{selectedFriend.streak || 0}</p>
                    <p className="text-xs text-muted-foreground">Jours streak</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Award className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-xl font-bold">{selectedFriend.badges}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">XP Total</span>
                    <span className="font-bold">{selectedFriend.xp?.toLocaleString()}</span>
                  </div>
                  <Progress value={((selectedFriend.xp || 0) % 1000) / 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {1000 - ((selectedFriend.xp || 0) % 1000)} XP jusqu'au niveau suivant
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" onClick={() => toggleFavorite(selectedFriend.id)}>
                    {selectedFriend.isFavorite ? (
                      <StarOff className="h-4 w-4" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
