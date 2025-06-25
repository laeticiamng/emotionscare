
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Heart, Share, Plus, Send, ArrowLeft, Shield, Smile, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: 'support' | 'success' | 'question' | 'general';
  anonymous: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
}

const SocialCoconPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const posts: Post[] = [
    {
      id: '1',
      author: 'Sarah M.',
      avatar: '/api/placeholder/40/40',
      content: 'Aujourd\'hui marque ma 30e journée consécutive d\'utilisation d\'EmotionsCare. Je me sens tellement mieux ! Les sessions de méditation VR m\'ont vraiment aidée à gérer mon stress.',
      timestamp: 'Il y a 2 heures',
      likes: 12,
      comments: 5,
      category: 'success',
      anonymous: false
    },
    {
      id: '2',
      author: 'Utilisateur Anonyme',
      avatar: '',
      content: 'Comment faites-vous pour rester motivé(e) les jours difficiles ? J\'ai du mal à maintenir ma routine de bien-être.',
      timestamp: 'Il y a 4 heures',
      likes: 8,
      comments: 15,
      category: 'support',
      anonymous: true
    },
    {
      id: '3',
      author: 'Dr. Martin L.',
      avatar: '/api/placeholder/40/40',
      content: 'Rappel important : la cohérence est plus importante que la perfection. Même 5 minutes de méditation par jour peuvent faire une différence significative.',
      timestamp: 'Il y a 6 heures',
      likes: 25,
      comments: 8,
      category: 'general',
      anonymous: false
    }
  ];

  const groups: Group[] = [
    {
      id: '1',
      name: 'Professionnels de santé',
      description: 'Espace dédié aux soignants pour partager expériences et conseils',
      members: 245,
      category: 'Professionnel',
      isJoined: true
    },
    {
      id: '2',
      name: 'Méditation & Mindfulness',
      description: 'Pratiques de méditation et pleine conscience',
      members: 189,
      category: 'Bien-être',
      isJoined: false
    },
    {
      id: '3',
      name: 'Gestion du stress',
      description: 'Techniques et astuces pour gérer le stress quotidien',
      members: 312,
      category: 'Santé mentale',
      isJoined: true
    },
    {
      id: '4',
      name: 'Nouveaux utilisateurs',
      description: 'Accueil et aide pour les nouveaux membres',
      members: 156,
      category: 'Support',
      isJoined: false
    }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) {
      toast.error('Veuillez écrire quelque chose avant de publier');
      return;
    }
    
    toast.success('Publication partagée avec succès !');
    setNewPost('');
  };

  const handleJoinGroup = (groupId: string) => {
    toast.success('Vous avez rejoint le groupe !');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'support': return <Heart className="h-3 w-3" />;
      case 'success': return <Smile className="h-3 w-3" />;
      case 'question': return <MessageCircle className="h-3 w-3" />;
      default: return <MessageCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                Social Cocon
              </h1>
              <p className="text-gray-600">Partagez et soutenez-vous mutuellement dans un espace bienveillant</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button data-testid="new-post-button">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle publication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Partager avec la communauté</DialogTitle>
                <DialogDescription>
                  Partagez vos expériences, posez des questions ou offrez votre soutien
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Environnement sécurisé et modéré</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="general">Général</option>
                    <option value="support">Demande de soutien</option>
                    <option value="success">Partage de réussite</option>
                    <option value="question">Question</option>
                  </select>
                </div>
                
                <Textarea
                  placeholder="Partagez vos pensées, expériences ou questions..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[120px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="text-sm">
                      Publier anonymement
                    </label>
                  </div>
                  <Button onClick={handleSubmitPost}>
                    <Send className="mr-2 h-4 w-4" />
                    Publier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Fil d'actualité
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groupes
            </TabsTrigger>
            <TabsTrigger value="guidelines" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Règles
            </TabsTrigger>
          </TabsList>

          {/* Feed */}
          <TabsContent value="feed">
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`post-${post.id}`}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={post.anonymous ? '' : post.avatar} />
                          <AvatarFallback>
                            {post.anonymous ? '?' : post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              {post.anonymous ? 'Utilisateur Anonyme' : post.author}
                            </span>
                            <Badge className={getCategoryColor(post.category)}>
                              {getCategoryIcon(post.category)}
                              <span className="ml-1 capitalize">{post.category}</span>
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.timestamp}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {post.content}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                              <Heart className="mr-1 h-4 w-4" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                              <MessageCircle className="mr-1 h-4 w-4" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                              <Share className="mr-1 h-4 w-4" />
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

          {/* Groups */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`group-${group.id}`}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>{group.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{group.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {group.members} membres
                        </div>
                        <Button
                          size="sm"
                          variant={group.isJoined ? "outline" : "default"}
                          onClick={() => !group.isJoined && handleJoinGroup(group.id)}
                        >
                          {group.isJoined ? 'Membre' : 'Rejoindre'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Guidelines */}
          <TabsContent value="guidelines">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Règles de la communauté
                </CardTitle>
                <CardDescription>
                  Pour maintenir un environnement sain et bienveillant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-700">✅ Encouragé</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Partager vos expériences personnelles</li>
                      <li>• Offrir un soutien constructif</li>
                      <li>• Poser des questions respectueuses</li>
                      <li>• Célébrer les réussites des autres</li>
                      <li>• Maintenir l'anonymat si souhaité</li>
                      <li>• Respecter la confidentialité</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-700">❌ Interdit</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Conseils médicaux non professionnels</li>
                      <li>• Contenu offensant ou discriminatoire</li>
                      <li>• Spam ou autopromotion</li>
                      <li>• Partage d'informations personnelles</li>
                      <li>• Harcèlement sous toute forme</li>
                      <li>• Contenu inapproprié</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Modération</h4>
                  <p className="text-sm text-blue-700">
                    Notre équipe de modération veille 24h/7j à maintenir un environnement sûr. 
                    N'hésitez pas à signaler tout contenu inapproprié. En cas de crise, 
                    contactez immédiatement les services d'urgence.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Confidentialité</h4>
                  <p className="text-sm text-green-700">
                    Vos données sont protégées. Les publications anonymes ne peuvent être 
                    liées à votre identité. Vous pouvez supprimer vos publications à tout moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialCoconPage;
