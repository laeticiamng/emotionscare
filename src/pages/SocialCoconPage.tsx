
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search,
  Filter,
  Send,
  Shield,
  UserPlus,
  Calendar,
  MapPin,
  Star,
  Smile,
  Camera,
  Lock
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  mood: string;
  timestamp: string;
  likes: number;
  comments: number;
  isAnonymous: boolean;
  tags: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  participants: number;
  maxParticipants: number;
  location: string;
  type: 'online' | 'offline';
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
  image: string;
}

const SocialCoconPage: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const posts: Post[] = [
    {
      id: '1',
      author: 'Marie',
      avatar: '/api/placeholder/40/40',
      content: 'Aujourd\'hui j\'ai réussi ma première session de méditation de 20 minutes ! Je me sens tellement plus calme. Merci à tous ceux qui m\'ont encouragée ✨',
      mood: 'happy',
      timestamp: '2h',
      likes: 12,
      comments: 3,
      isAnonymous: false,
      tags: ['méditation', 'accomplissement']
    },
    {
      id: '2',
      author: 'Utilisateur anonyme',
      avatar: '/api/placeholder/40/40',
      content: 'Quelqu\'un d\'autre a-t-il du mal à dormir à cause de l\'anxiété ? J\'aimerais avoir des conseils pour mieux gérer mes nuits difficiles.',
      mood: 'anxious',
      timestamp: '4h',
      likes: 8,
      comments: 7,
      isAnonymous: true,
      tags: ['anxiété', 'sommeil', 'conseils']
    },
    {
      id: '3',
      author: 'Pierre',
      avatar: '/api/placeholder/40/40',
      content: 'Partage de ma playlist zen du moment 🎵 Ces musiques m\'aident vraiment à me détendre après une journée stressante. N\'hésitez pas à me dire ce que vous en pensez !',
      mood: 'relaxed',
      timestamp: '6h',
      likes: 15,
      comments: 5,
      isAnonymous: false,
      tags: ['musique', 'détente', 'partage']
    }
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'Méditation guidée en groupe',
      description: 'Session de méditation collective pour débutants et confirmés',
      date: '2024-01-20 18:00',
      participants: 8,
      maxParticipants: 15,
      location: 'En ligne',
      type: 'online'
    },
    {
      id: '2',
      title: 'Atelier gestion du stress',
      description: 'Techniques pratiques pour mieux gérer le stress quotidien',
      date: '2024-01-25 14:00',
      participants: 12,
      maxParticipants: 20,
      location: 'Paris, France',
      type: 'offline'
    },
    {
      id: '3',
      title: 'Cercle de partage',
      description: 'Espace bienveillant pour partager ses expériences',
      date: '2024-01-22 19:30',
      participants: 6,
      maxParticipants: 10,
      location: 'En ligne',
      type: 'online'
    }
  ];

  const groups: Group[] = [
    {
      id: '1',
      name: 'Anxiété et Sérénité',
      description: 'Groupe de soutien pour les personnes vivant avec l\'anxiété',
      members: 247,
      category: 'Support',
      isPrivate: true,
      image: '/api/placeholder/60/60'
    },
    {
      id: '2',
      name: 'Méditation Quotidienne',
      description: 'Pratiquons la méditation ensemble chaque jour',
      members: 189,
      category: 'Pratique',
      isPrivate: false,
      image: '/api/placeholder/60/60'
    },
    {
      id: '3',
      name: 'Parents Zen',
      description: 'Concilier parentalité et bien-être mental',
      members: 156,
      category: 'Thématique',
      isPrivate: false,
      image: '/api/placeholder/60/60'
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Simulate posting
      setNewPost('');
      setSelectedMood('');
      setIsAnonymous(false);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      case 'anxious': return 'bg-yellow-100 text-yellow-800';
      case 'relaxed': return 'bg-purple-100 text-purple-800';
      case 'stressed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'happy': return 'Joyeux';
      case 'sad': return 'Triste';
      case 'anxious': return 'Anxieux';
      case 'relaxed': return 'Détendu';
      case 'stressed': return 'Stressé';
      default: return mood;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-pink-100 rounded-full">
              <Users className="h-8 w-8 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Cocoon</h1>
              <p className="text-gray-600">Communauté bienveillante pour votre bien-être</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Espace sécurisé et bienveillant</h3>
              <p className="text-sm text-blue-800">
                Tous les échanges sont modérés. Respectez la confidentialité et la bienveillance.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
            <TabsTrigger value="groups">Groupes</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Partager votre expérience
                </CardTitle>
                <CardDescription>
                  Exprimez-vous en toute sécurité avec la communauté
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Partagez vos pensées, vos victoires, vos défis... La communauté est là pour vous écouter et vous soutenir."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                
                <div className="flex flex-wrap gap-2">
                  <p className="text-sm text-gray-600 w-full mb-2">Comment vous sentez-vous ?</p>
                  {['happy', 'relaxed', 'anxious', 'sad', 'stressed'].map((mood) => (
                    <Button
                      key={mood}
                      variant={selectedMood === mood ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMood(mood)}
                      className="text-xs"
                    >
                      <Smile className="h-3 w-3 mr-1" />
                      {getMoodLabel(mood)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      <Lock className="h-4 w-4" />
                      Publier anonymement
                    </label>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                  </div>
                  <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Publier
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher dans les posts..."
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>
                          {post.isAnonymous ? '?' : post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">
                            {post.isAnonymous ? 'Utilisateur anonyme' : post.author}
                          </h3>
                          <span className="text-sm text-gray-500">• {post.timestamp}</span>
                          {post.mood && (
                            <Badge className={getMoodColor(post.mood)}>
                              {getMoodLabel(post.mood)}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-red-600">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-blue-600">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-green-600">
                            <Share2 className="h-4 w-4" />
                            Partager
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Groupes de soutien</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un groupe
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.image} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {group.name}
                          {group.isPrivate && <Lock className="h-4 w-4 text-gray-500" />}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{group.members} membres</span>
                        <Badge variant="secondary">{group.category}</Badge>
                      </div>
                      <Button className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Rejoindre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Événements à venir</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un événement
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                        <Badge variant={event.type === 'online' ? 'secondary' : 'outline'}>
                          {event.type === 'online' ? 'En ligne' : 'Présentiel'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {event.participants}/{event.maxParticipants} participants
                      </div>
                      <Button className="w-full">
                        Participer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Ressources populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium">Guide de la méditation</h4>
                      <p className="text-sm text-gray-600">Techniques de base pour débuter</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium">Gestion de l'anxiété</h4>
                      <p className="text-sm text-gray-600">Stratégies pratiques au quotidien</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium">Sommeil réparateur</h4>
                      <p className="text-sm text-gray-600">Améliorer la qualité de votre sommeil</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Aide et support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800">Urgence</h4>
                      <p className="text-sm text-red-700">Numéros d'urgence et ressources immédiates</p>
                      <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                        Accéder
                      </Button>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium">Professionnels</h4>
                      <p className="text-sm text-gray-600">Trouver un thérapeute près de chez vous</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium">Lignes d'écoute</h4>
                      <p className="text-sm text-gray-600">Soutien téléphonique gratuit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialCoconPage;
