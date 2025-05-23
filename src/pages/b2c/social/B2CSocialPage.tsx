
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users,
  PlusCircle,
  Smile,
  Camera,
  Send,
  ThumbsUp,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';
import { toast } from 'sonner';

const B2CSocialPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const posts = [
    {
      id: 1,
      author: 'Marie L.',
      avatar: '',
      time: 'Il y a 2h',
      content: 'Excellente session de méditation ce matin ! Je me sens tellement plus sereine. Merci à la communauté pour vos encouragements hier 🧘‍♀️',
      likes: 12,
      comments: 3,
      mood: 'peaceful',
      hasLiked: false
    },
    {
      id: 2,
      author: 'Thomas K.',
      avatar: '',
      time: 'Il y a 4h',
      content: 'Jour difficile au travail, mais les exercices de respiration m\'ont vraiment aidé à garder mon calme. Parfois les petites victoires comptent le plus 💪',
      likes: 8,
      comments: 5,
      mood: 'determined',
      hasLiked: true
    },
    {
      id: 3,
      author: 'Sophie M.',
      avatar: '',
      time: 'Hier',
      content: 'Je voulais partager cette citation qui m\'a marquée aujourd\'hui : "Le bonheur n\'est pas une destination, c\'est un voyage." Qu\'est-ce qui vous rend heureux en ce moment ?',
      likes: 15,
      comments: 8,
      mood: 'inspired',
      hasLiked: false
    }
  ];

  const moodCategories = [
    { emoji: '😊', label: 'Joyeux', count: 23 },
    { emoji: '😌', label: 'Serein', count: 18 },
    { emoji: '💪', label: 'Motivé', count: 15 },
    { emoji: '🤔', label: 'Réfléchi', count: 12 },
    { emoji: '😴', label: 'Fatigué', count: 9 }
  ];

  const handlePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    
    // Simulate posting
    setTimeout(() => {
      setIsPosting(false);
      setNewPost('');
      toast.success('Votre message a été partagé avec la communauté !');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la communauté..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-light">
            Communauté <span className="text-primary">EmotionsCare</span>
          </h1>
          <p className="text-muted-foreground">
            Partagez votre parcours bien-être avec une communauté bienveillante
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {moodCategories.map((mood, index) => (
            <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
              <div className="text-xs text-muted-foreground">{mood.count} personnes</div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5 text-primary" />
                    Partager avec la communauté
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre expérience..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-20"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Smile className="h-4 w-4 mr-1" />
                            Humeur
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Camera className="h-4 w-4 mr-1" />
                            Photo
                          </Button>
                        </div>
                        <Button 
                          onClick={handlePost}
                          disabled={!newPost.trim() || isPosting}
                        >
                          {isPosting ? (
                            <LoadingAnimation size="small" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Partager
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{post.author}</div>
                              <div className="text-sm text-muted-foreground">{post.time}</div>
                            </div>
                            <Badge variant="outline" className="flex items-center">
                              {post.mood === 'peaceful' && '😌'}
                              {post.mood === 'determined' && '💪'}
                              {post.mood === 'inspired' && '✨'}
                              <span className="ml-1 capitalize">{post.mood}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-sm leading-relaxed">{post.content}</p>
                          
                          <div className="flex items-center space-x-4 pt-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={post.hasLiked ? 'text-red-500' : ''}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${post.hasLiked ? 'fill-current' : ''}`} />
                              {post.likes}
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments}
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Notre Communauté
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Membres actifs</span>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages aujourd'hui</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Nouveau cette semaine</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Règles de Bienveillance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p>Soyez respectueux et bienveillants</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p>Partagez vos expériences authentiques</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p>Encouragez et soutenez les autres</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p>Respectez la confidentialité</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sujets Populaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['#méditation', '#gratitude', '#motivation', '#équilibre', '#bienêtre'].map((tag, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CSocialPage;
