import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Users, Sparkles, TrendingUp, Shield, Coffee, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const B2CSocialCoconPageEnhanced = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  // Données simulées
  const mockPosts = [
    {
      id: 1,
      author: { name: 'Marie L.', avatar: '', mood: 'énergique' },
      content: '🌟 Super séance de méditation ce matin ! Qui veut se joindre à moi demain à 9h ?',
      timestamp: '2 min',
      likes: 5,
      comments: 2,
      category: 'wellbeing'
    },
    {
      id: 2,
      author: { name: 'Thomas R.', avatar: '', mood: 'motivé' },
      content: '💪 Défi du jour accompli ! 10 minutes de respiration profonde pendant la pause déjeuner. Qui relève le défi ?',
      timestamp: '15 min',
      likes: 8,
      comments: 4,
      category: 'challenge'
    },
    {
      id: 3,
      author: { name: 'Sarah K.', avatar: '', mood: 'sereine' },
      content: 'Petit moment de gratitude : merci à toute l\'équipe pour cette ambiance positive ! 🙏',
      timestamp: '1h',
      likes: 12,
      comments: 6,
      category: 'gratitude'
    }
  ];

  const mockChallenges = [
    {
      id: 1,
      title: 'Défi Respiration',
      description: '5 minutes de respiration consciente par jour',
      participants: 15,
      duration: '7 jours',
      progress: 60,
      category: 'breath'
    },
    {
      id: 2,
      title: 'Gratitude Quotidienne',
      description: 'Partager une chose positive chaque jour',
      participants: 23,
      duration: '14 jours',
      progress: 80,
      category: 'gratitude'
    },
    {
      id: 3,
      title: 'Pause Active',
      description: '3 pauses de 2 minutes pour bouger',
      participants: 8,
      duration: '5 jours',
      progress: 40,
      category: 'movement'
    }
  ];

  const mockTeamMembers = [
    { name: 'Alice M.', role: 'Manager', mood: 'motivée', points: 340, avatar: '' },
    { name: 'Bob T.', role: 'Developer', mood: 'concentré', points: 280, avatar: '' },
    { name: 'Clara V.', role: 'Designer', mood: 'créative', points: 390, avatar: '' },
    { name: 'David L.', role: 'Analyst', mood: 'serein', points: 220, avatar: '' },
  ];

  const categories = [
    { name: 'wellbeing', icon: '🧘', color: 'bg-purple-500' },
    { name: 'challenge', icon: '💪', color: 'bg-orange-500' },
    { name: 'gratitude', icon: '🙏', color: 'bg-green-500' },
    { name: 'support', icon: '🤗', color: 'bg-blue-500' }
  ];

  const submitPost = async () => {
    if (!newPost.trim()) return;

    setIsPosting(true);
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const post = {
        id: Date.now(),
        author: { name: 'Vous', avatar: '', mood: 'partageur' },
        content: newPost,
        timestamp: 'maintenant',
        likes: 0,
        comments: 0,
        category: 'wellbeing'
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      
      toast({
        title: "Message partagé",
        description: "Votre message a été publié dans le cocon social.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier votre message.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    toast({
      title: "Défi rejoint !",
      description: "Vous participez maintenant à ce défi d'équipe.",
    });
  };

  const likePost = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  useEffect(() => {
    setPosts(mockPosts);
    setChallenges(mockChallenges);
    setTeamMembers(mockTeamMembers);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-purple-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Social Cocon
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Créez des liens authentiques et soutenez-vous mutuellement dans votre parcours bien-être
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Actualités
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Soutien
            </TabsTrigger>
          </TabsList>

          {/* Fil d'actualités */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Nouvelle publication */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-500" />
                        Partager un moment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre humeur, vos réussites, ou demandez du soutien..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <Badge key={cat.name} variant="outline" className="cursor-pointer hover:bg-gray-100">
                              {cat.icon} {cat.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          onClick={submitPost}
                          disabled={isPosting || !newPost.trim()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {isPosting ? "Publication..." : "Partager"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Publications */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  {post.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold">{post.author.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {post.author.mood}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                                </div>
                                
                                <p className="text-gray-700 mb-4">{post.content}</p>
                                
                                <div className="flex items-center gap-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => likePost(post.id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Heart className="h-4 w-4 mr-1" />
                                    {post.likes}
                                  </Button>
                                  
                                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.comments}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar d'activité */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Activité du jour
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Messages partagés</span>
                        <Badge variant="outline">24</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Réactions données</span>
                        <Badge variant="outline">67</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Défis actifs</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="h-5 w-5 text-orange-500" />
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Astuce du jour</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Prenez 2 minutes pour remercier un collègue qui vous a aidé cette semaine !
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Défis collaboratifs */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{challenge.title}</span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {challenge.participants} participants
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{challenge.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${challenge.progress}%` }}
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{challenge.duration}</span>
                        <Button
                          onClick={() => joinChallenge(challenge.id)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Rejoindre
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Équipe */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                      
                      <Badge variant="secondary" className="mb-3">
                        {member.mood}
                      </Badge>
                      
                      <div className="flex items-center justify-center gap-1 text-orange-500">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-bold">{member.points}</span>
                        <span className="text-xs text-gray-500">pts</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Soutien */}
          <TabsContent value="support" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Centre de Soutien
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Besoin d'aide ?</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Parler à un coach
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Rejoindre un groupe de soutien
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="h-4 w-4 mr-2" />
                          Ressources bien-être
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Message anonyme</h3>
                      <Textarea
                        placeholder="Partagez vos préoccupations de manière anonyme..."
                        className="min-h-[120px]"
                      />
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Envoyer anonymement
                      </Button>
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

export default B2CSocialCoconPageEnhanced;