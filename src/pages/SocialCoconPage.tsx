
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, Plus, Sparkles, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SocialCoconPage: React.FC = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: "Marie L.",
      avatar: "ML",
      time: "Il y a 2h",
      content: "Aujourd'hui j'ai réussi à méditer 15 minutes sans interruption ! 🧘‍♀️ Petit à petit on progresse.",
      mood: "Calme",
      likes: 12,
      comments: 3,
      tags: ["méditation", "progrès"]
    },
    {
      id: 2,
      author: "Dr. Sarah M.",
      avatar: "SM",
      time: "Il y a 4h",
      role: "Coach",
      content: "Rappel : Il est normal d'avoir des hauts et des bas. L'important c'est de continuer à prendre soin de soi. 💙",
      mood: "Bienveillant",
      likes: 28,
      comments: 8,
      tags: ["conseil", "bienveillance"]
    },
    {
      id: 3,
      author: "Thomas R.",
      avatar: "TR",
      time: "Il y a 6h",
      content: "Merci à cette communauté pour tous vos encouragements. Ça fait une vraie différence ! 🙏",
      mood: "Reconnaissant",
      likes: 15,
      comments: 5,
      tags: ["gratitude", "communauté"]
    }
  ];

  const groups = [
    {
      id: 1,
      name: "Méditation & Pleine Conscience",
      members: 248,
      description: "Partageons nos expériences de méditation",
      lastActivity: "Il y a 1h",
      category: "Bien-être"
    },
    {
      id: 2,
      name: "Professionnels de Santé",
      members: 89,
      description: "Espace dédié aux soignants",
      lastActivity: "Il y a 3h",
      category: "Professionnel"
    },
    {
      id: 3,
      name: "Parents & Équilibre",
      members: 156,
      description: "Concilier parentalité et bien-être",
      lastActivity: "Il y a 5h",
      category: "Famille"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "Défi Gratitude",
      description: "Partagez 3 choses pour lesquelles vous êtes reconnaissant",
      participants: 67,
      timeLeft: "3 jours",
      reward: "Badge Gratitude"
    },
    {
      id: 2,
      title: "Semaine Détox Digitale",
      description: "Réduisez votre temps d'écran ensemble",
      participants: 43,
      timeLeft: "5 jours",
      reward: "Badge Équilibre"
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      toast({
        title: "Message partagé !",
        description: "Votre message a été publié dans le Social Cocon.",
      });
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Cocon</h1>
          <p className="text-gray-600">Votre communauté bienveillante de bien-être</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Créer un post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Partager votre ressenti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre expérience..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline">😊 Positif</Badge>
                    <Badge variant="outline">💭 Réflexion</Badge>
                    <Badge variant="outline">🆘 Besoin d'aide</Badge>
                  </div>
                  <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{post.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{post.author}</span>
                          {post.role && <Badge variant="secondary">{post.role}</Badge>}
                          <span className="text-sm text-gray-500">{post.time}</span>
                        </div>
                        
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {post.mood}
                          </Badge>
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Partager</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Groupes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mes Groupes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groups.slice(0, 3).map((group) => (
                  <div key={group.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-sm mb-1">{group.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{group.description}</div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{group.members} membres</span>
                      <span className="text-gray-500">{group.lastActivity}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Rejoindre un groupe
                </Button>
              </CardContent>
            </Card>

            {/* Défis communautaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Défis Actifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 border rounded-lg bg-blue-50">
                    <div className="font-medium text-sm mb-1">{challenge.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{challenge.description}</div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span>{challenge.participants} participants</span>
                      <span className="text-blue-600">{challenge.timeLeft}</span>
                    </div>
                    <Button size="sm" className="w-full text-xs">
                      Participer
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Modération */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Espace Sécurisé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>✓ Modération 24h/7j</p>
                  <p>✓ Anonymat préservé</p>
                  <p>✓ Bienveillance obligatoire</p>
                  <p>✓ Zéro tolérance harcèlement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCoconPage;
