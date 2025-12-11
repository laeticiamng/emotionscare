import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, MessageCircle, UserMinus, MoreVertical, Check, X, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  streak?: number;
}

const initialFriends: Friend[] = [
  { id: 1, name: 'Marie D.', status: 'online', streak: 12 },
  { id: 2, name: 'Thomas L.', status: 'away', lastSeen: 'Il y a 15 min', streak: 5 },
  { id: 3, name: 'Julie M.', status: 'offline', lastSeen: 'Hier', streak: 28 },
  { id: 4, name: 'Lucas P.', status: 'online', streak: 3 },
  { id: 5, name: 'Emma R.', status: 'offline', lastSeen: 'Il y a 2 jours' },
  { id: 6, name: 'Hugo B.', status: 'online', streak: 7 },
];

const pendingRequests = [
  { id: 7, name: 'Sophie V.', type: 'received' },
  { id: 8, name: 'Antoine C.', type: 'sent' },
];

export default function FriendsPage() {
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  const filteredFriends = useMemo(() => {
    let result = friends;
    
    if (searchQuery) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filter === 'online') {
      result = result.filter(f => f.status === 'online');
    }
    
    return result;
  }, [friends, searchQuery, filter]);

  const onlineCount = friends.filter(f => f.status === 'online').length;

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mes Amis</h1>
          <p className="text-muted-foreground">
            {friends.length} amis • {onlineCount} en ligne
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un ami
        </Button>
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
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un ami..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant={filter === 'online' ? 'default' : 'outline'}
              onClick={() => setFilter(filter === 'online' ? 'all' : 'online')}
            >
              En ligne ({onlineCount})
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{getStatusLabel(friend)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRemoveFriend(friend.id)}>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Retirer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {friend.streak && friend.streak > 0 && (
                  <Badge variant="secondary" className="w-fit">
                    🔥 {friend.streak} jours de streak
                  </Badge>
                )}
                
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </Card>
            ))}
            
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
                    <p className="text-sm text-muted-foreground">Souhaite vous ajouter</p>
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
      </Tabs>
    </div>
  );
}
