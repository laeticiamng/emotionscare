// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, MessageCircle, Heart, Calendar, 
  MapPin, Send, Phone, Video, Book, Gamepad2, Camera,
  Zap, Clock, CheckCircle, UserPlus, Search, Activity, Target, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { triggerConfetti } from '@/lib/confetti';

interface BuddyProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  interests: string[];
  mood: string;
  availability: 'online' | 'away' | 'busy' | 'offline';
  compatibilityScore: number;
  mutualInterests: string[];
  isMatched: boolean;
  conversationCount: number;
  supportScore: number;
  badges: string[];
  lastActive: string;
  bio: string;
  goals: string[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'activity' | 'system';
  activityData?: {
    type: string;
    title: string;
    description: string;
  };
}

interface SharedActivity {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'exercise' | 'reading' | 'gaming' | 'creative';
  duration: number;
  participants: string[];
  scheduledFor?: string;
  status: 'planned' | 'active' | 'completed';
}

const interests = [
  'Méditation', 'Yoga', 'Lecture', 'Musique', 'Jeux', 'Cuisine',
  'Sport', 'Art', 'Nature', 'Voyage', 'Cinéma', 'Photographie'
];

const activities: SharedActivity[] = [
  {
    id: '1',
    title: 'Méditation Guidée',
    description: 'Session de méditation de pleine conscience de 15 minutes',
    type: 'meditation',
    duration: 15,
    participants: [],
    status: 'planned'
  },
  {
    id: '2',
    title: 'Défi Lecture',
    description: 'Lire ensemble pendant 30 minutes puis échanger',
    type: 'reading',
    duration: 30,
    participants: [],
    status: 'planned'
  },
  {
    id: '3',
    title: 'Séance Sport',
    description: 'Entraînement cardio en visio de 20 minutes',
    type: 'exercise',
    duration: 20,
    participants: [],
    status: 'planned'
  }
];

export default function EnhancedBuddySystem() {
  const [buddyProfiles, setBuddyProfiles] = useState<BuddyProfile[]>([]);
  const [matchedBuddies, setMatchedBuddies] = useState<BuddyProfile[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [sharedActivities, setSharedActivities] = useState<SharedActivity[]>(activities);
  const [activeActivity, setActiveActivity] = useState<SharedActivity | null>(null);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBuddyProfiles();
    loadMatchedBuddies();
    loadSharedActivities();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadBuddyProfiles = async () => {
    try {
      const { data } = await supabase
        .from('buddies')
        .select(`
          *,
          profiles!buddies_buddy_user_id_fkey (
            name,
            avatar_url,
            bio
          )
        `)
        .limit(10);

      if (data) {
        const profiles = data.map(buddy => ({
          id: buddy.id,
          name: buddy.profiles?.name || 'Buddy',
          avatar: buddy.profiles?.avatar_url || '/placeholder-avatar.jpg',
          age: Math.floor(Math.random() * 30) + 20,
          location: 'Paris, France',
          interests: interests.slice(0, Math.floor(Math.random() * 6) + 3),
          mood: ['😊 Joyeux', '😌 Calme', '💪 Motivé', '🎯 Concentré'][Math.floor(Math.random() * 4)],
          availability: ['online', 'away', 'busy', 'offline'][Math.floor(Math.random() * 4)] as any,
          compatibilityScore: Math.floor(Math.random() * 40) + 60,
          mutualInterests: interests.slice(0, Math.floor(Math.random() * 3) + 1),
          isMatched: Math.random() > 0.7,
          conversationCount: Math.floor(Math.random() * 20),
          supportScore: Math.floor(Math.random() * 50) + 50,
          badges: ['🌟 Mentor', '💝 Aidant', '🏆 Actif'][Math.floor(Math.random() * 3)] ? ['🌟 Mentor'] : [],
          lastActive: '2 min',
          bio: buddy.profiles?.bio || 'Passionné de bien-être et de développement personnel',
          goals: ['Réduire stress', 'Améliorer sommeil', 'Pratiquer méditation']
        }));
        
        setBuddyProfiles(profiles.filter(p => !p.isMatched));
        setMatchedBuddies(profiles.filter(p => p.isMatched));
      }
    } catch (error) {
      // Buddy profiles loading error
    }
  };

  const loadMatchedBuddies = async () => {
    // Déjà chargé dans loadBuddyProfiles
  };

  const loadSharedActivities = async () => {
    setSharedActivities(activities);
  };

  const handleMatch = async (buddyId: string) => {
    try {
      const buddy = buddyProfiles.find(b => b.id === buddyId);
      if (!buddy) return;

      await supabase
        .from('buddies')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          buddy_user_id: buddyId
        });

      setBuddyProfiles(prev => prev.filter(b => b.id !== buddyId));
      setMatchedBuddies(prev => [...prev, { ...buddy, isMatched: true }]);
      
      // Ajouter un message système
      const systemMessage: ChatMessage = {
        id: `sys_${Date.now()}`,
        senderId: 'system',
        content: `Vous êtes maintenant connectés ! Dites bonjour à ${buddy.name} 👋`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      
      setMessages(prev => ({
        ...prev,
        [buddyId]: [systemMessage]
      }));

      triggerConfetti();
      toast({
        title: "🎉 Nouveau Buddy!",
        description: `Vous êtes maintenant connecté avec ${buddy.name}`,
      });
    } catch (error) {
      // Buddy matching error
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), message]
    }));

    setNewMessage('');

    // Simuler une réponse du buddy
    setTimeout(() => {
      const responses = [
        'C\'est une excellente idée ! 😊',
        'Je comprends ce que tu ressens.',
        'On pourrait essayer une activité ensemble ?',
        'Merci de partager cela avec moi.',
        'Comment puis-je t\'aider ?'
      ];
      
      const response: ChatMessage = {
        id: `msg_${Date.now()}_buddy`,
        senderId: activeChat,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), response]
      }));
    }, 1000 + Math.random() * 2000);
  };

  const handleStartActivity = async (activity: SharedActivity, buddyId: string) => {
    try {
      const updatedActivity = {
        ...activity,
        participants: [buddyId],
        status: 'active' as const,
        scheduledFor: new Date().toISOString()
      };

      setSharedActivities(prev => prev.map(a => 
        a.id === activity.id ? updatedActivity : a
      ));

      setActiveActivity(updatedActivity);

      // Ajouter un message d'activité
      const activityMessage: ChatMessage = {
        id: `activity_${Date.now()}`,
        senderId: 'system',
        content: `Activité "${activity.title}" démarrée !`,
        timestamp: new Date().toISOString(),
        type: 'activity',
        activityData: {
          type: activity.type,
          title: activity.title,
          description: activity.description
        }
      };

      setMessages(prev => ({
        ...prev,
        [buddyId]: [...(prev[buddyId] || []), activityMessage]
      }));

      toast({
        title: "🚀 Activité démarrée!",
        description: `Vous avez commencé "${activity.title}" avec votre buddy`,
      });
    } catch (error) {
      // Activity start error
    }
  };

  const runMatchmaker = async () => {
    setShowMatchmaker(true);
    
    // Simuler l'algorithme de matching
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMatches = buddyProfiles
      .filter(buddy => 
        buddy.mutualInterests.some(interest => selectedInterests.includes(interest)) &&
        buddy.compatibilityScore > 70
      )
      .slice(0, 3);

    if (newMatches.length > 0) {
      toast({
        title: "🎯 Nouveaux matches trouvés!",
        description: `${newMatches.length} buddy(s) compatibles découvert(s)`,
      });
    }

    setShowMatchmaker(false);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Sparkles className="h-4 w-4" />;
      case 'exercise': return <Zap className="h-4 w-4" />;
      case 'reading': return <Book className="h-4 w-4" />;
      case 'gaming': return <Gamepad2 className="h-4 w-4" />;
      case 'creative': return <Camera className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Système de Buddy Avancé
        </h1>
        <p className="text-muted-foreground">
          Trouvez votre partenaire de bien-être idéal et progressez ensemble
        </p>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="matches">Mes Buddies</TabsTrigger>
          <TabsTrigger value="discovery">Découverte</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="matchmaker">Matchmaker IA</TabsTrigger>
        </TabsList>

        {/* Mes Buddies */}
        <TabsContent value="matches" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedBuddies.map(buddy => (
              <Card key={buddy.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={buddy.avatar} />
                          <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(buddy.availability)} rounded-full border-2 border-background`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{buddy.name}</h3>
                          {buddy.badges.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {buddy.badges[0]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{buddy.location}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Compatibilité: {buddy.compatibilityScore}%</span>
                      </div>
                      <Progress value={buddy.compatibilityScore} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Humeur actuelle:</p>
                      <Badge variant="outline">{buddy.mood}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Intérêts communs:</p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.mutualInterests.slice(0, 3).map(interest => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setActiveChat(buddy.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Appel
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Activité
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {matchedBuddies.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucun buddy pour le moment</h3>
                <p>Découvrez de nouveaux profils dans l'onglet "Découverte"</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Découverte */}
        <TabsContent value="discovery" className="space-y-4">
              <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtres de Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Localisation</label>
                  <Input 
                    placeholder="Paris, Lyon..." 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Âge</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Disponibilité</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="all">Toutes</option>
                    <option value="online">En ligne</option>
                    <option value="away">Absent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Centres d'intérêt</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interests.map(interest => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedInterests(prev => 
                          prev.includes(interest)
                            ? prev.filter(i => i !== interest)
                            : [...prev, interest]
                        );
                      }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buddyProfiles.slice(0, 6).map(buddy => (
              <Card key={buddy.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={buddy.avatar} />
                          <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getAvailabilityColor(buddy.availability)} rounded-full border-2 border-background`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{buddy.name}, {buddy.age}</h3>
                          <Badge variant="outline" className="text-xs">
                            {buddy.compatibilityScore}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {buddy.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Actif {buddy.lastActive}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm">{buddy.bio}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Objectifs:</p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.goals.map(goal => (
                          <Badge key={goal} variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Intérêts communs:</p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.mutualInterests.map(interest => (
                          <Badge key={interest} variant="default" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleMatch(buddy.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connecter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Liste des conversations */}
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {matchedBuddies.map(buddy => (
                    <div
                      key={buddy.id}
                      className={`p-4 cursor-pointer hover:bg-muted border-b transition-colors ${
                        activeChat === buddy.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setActiveChat(buddy.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={buddy.avatar} />
                            <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                          </Avatar>
                          {buddy.availability === 'online' && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium truncate">{buddy.name}</p>
                            <span className="text-xs text-muted-foreground">2 min</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {messages[buddy.id]?.slice(-1)[0]?.content || 'Aucun message'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone de chat */}
            <div className="lg:col-span-2">
              {activeChat ? (
                <Card className="h-[500px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={matchedBuddies.find(b => b.id === activeChat)?.avatar} />
                        <AvatarFallback>
                          {matchedBuddies.find(b => b.id === activeChat)?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {matchedBuddies.find(b => b.id === activeChat)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {matchedBuddies.find(b => b.id === activeChat)?.availability}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages[activeChat]?.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'system' ? (
                            <div className="text-center text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                              {message.content}
                            </div>
                          ) : message.type === 'activity' ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
                              <div className="flex items-center gap-2 mb-2">
                                {getActivityIcon(message.activityData?.type || '')}
                                <span className="font-medium text-sm">{message.activityData?.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {message.activityData?.description}
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`max-w-xs px-3 py-2 rounded-lg ${
                                message.senderId === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.content}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                  
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-[500px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez une conversation pour commencer à chatter</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Activités partagées */}
        <TabsContent value="activities" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activités disponibles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activités Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sharedActivities.filter(a => a.status === 'planned').map(activity => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration} minutes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {matchedBuddies.slice(0, 2).map(buddy => (
                        <Button
                          key={buddy.id}
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartActivity(activity, buddy.id)}
                        >
                          Avec {buddy.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activité en cours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Activité en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeActivity ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        {getActivityIcon(activeActivity.type)}
                      </div>
                      <h3 className="font-semibold text-lg">{activeActivity.title}</h3>
                      <p className="text-muted-foreground">{activeActivity.description}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-primary">15:00</div>
                      <p className="text-sm text-muted-foreground">Temps restant</p>
                    </div>
                    
                    <Progress value={75} className="h-3" />
                    
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Terminer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Aucune activité en cours</p>
                    <p className="text-sm">Démarrez une activité avec un buddy</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Matchmaker IA */}
        <TabsContent value="matchmaker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Matchmaker IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-6">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Intelligence Artificielle Avancée</h3>
                  <p className="text-muted-foreground">
                    Notre IA analyse votre profil, vos interactions et vos préférences pour vous proposer les meilleurs matches
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Critères de matching:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Compatibilité des objectifs</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Intérêts communs</span>
                      <Badge variant="secondary">92%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Disponibilité temporelle</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Style de communication</span>
                      <Badge variant="secondary">88%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Recommandations personnalisées:</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Recherchez des buddies avec des objectifs de méditation</p>
                    <p>• Privilégiez les profils actifs le matin</p>
                    <p>• Explorez les communautés de lecture</p>
                    <p>• Participez aux défis bien-être</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={runMatchmaker}
                  disabled={showMatchmaker}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {showMatchmaker ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Lancer le Matchmaker IA
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  L'IA analysera votre profil et vous proposera les meilleurs matches
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}