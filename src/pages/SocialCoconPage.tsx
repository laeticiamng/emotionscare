
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share, Users, Plus, Search, Filter, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const SocialCoconPage: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const mockPosts = [
    {
      id: 1,
      author: 'Marie L.',
      avatar: '/api/placeholder/40/40',
      time: '2h',
      content: 'Journée difficile aujourd\'hui, mais la méditation du matin m\'a vraiment aidée. Merci pour vos conseils hier ! 🌸',
      likes: 12,
      comments: 3,
      mood: 'calme'
    },
    {
      id: 2,
      author: 'Thomas K.',
      avatar: '/api/placeholder/40/40',
      time: '4h',
      content: 'Première séance VR terminée ! L\'expérience "Forêt mystique" était incroyable. Je me sens tellement détendu 🌲',
      likes: 18,
      comments: 7,
      mood: 'détendu'
    },
    {
      id: 3,
      author: 'Sophie M.',
      avatar: '/api/placeholder/40/40',
      time: '6h',
      content: 'Atteint mon objectif de 7 jours consécutifs de journal ! Qui d\'autre veut relever le défi ? 💪',
      likes: 25,
      comments: 12,
      mood: 'motivé'
    }
  ];

  const mockGroups = [
    { name: 'Méditation Quotidienne', members: 1243, category: 'Bien-être' },
    { name: 'Musicothérapie', members: 856, category: 'Thérapie' },
    { name: 'Professionnels de Santé', members: 2104, category: 'Professionnel' },
    { name: 'Gestion du Stress', members: 1567, category: 'Support' }
  ];

  const handlePost = () => {
    if (newPost.trim()) {
      toast.success('Publication partagée avec la communauté !');
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Social Cocon
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connectez-vous avec une communauté bienveillante de professionnels de santé
            </p>
          </div>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
              <TabsTrigger value="challenges">Défis</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              {/* Nouvelle publication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Partager avec la communauté
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre expérience..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline">😊 Joyeux</Badge>
                      <Badge variant="outline">😌 Calme</Badge>
                      <Badge variant="outline">💪 Motivé</Badge>
                    </div>
                    <Button onClick={handlePost}>
                      <Plus className="h-4 w-4 mr-2" />
                      Publier
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recherche et filtres */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans les publications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Publications */}
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: post.id * 0.1 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={post.avatar} />
                            <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author}</span>
                                <Badge variant="secondary">{post.mood}</Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">{post.time}</span>
                            </div>
                            <p className="text-foreground">{post.content}</p>
                            <div className="flex items-center gap-6 pt-2">
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Heart className="h-4 w-4" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Share className="h-4 w-4" />
                                Partager
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGroups.map((group, index) => (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <Badge>{group.category}</Badge>
                        </div>
                        <CardDescription>
                          {group.members.toLocaleString()} membres actifs
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Rejoindre
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: '7 jours de méditation', participants: 234, reward: '🏆 Badge Zen Master' },
                  { title: 'Scan émotionnel quotidien', participants: 156, reward: '⭐ Badge Observateur' },
                  { title: 'Journal de gratitude', participants: 89, reward: '💫 Badge Reconnaissance' },
                  { title: 'Musicothérapie active', participants: 67, reward: '🎵 Badge Harmonie' }
                ].map((challenge, index) => (
                  <motion.div
                    key={challenge.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>
                          {challenge.participants} participants
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">{challenge.reward}</p>
                        </div>
                        <Button className="w-full">Participer</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialCoconPage;
