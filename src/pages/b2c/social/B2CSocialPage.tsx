
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Heart, Share2, Plus, Search, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  isAnonymous?: boolean;
}

const B2CSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Alex M.',
      content: 'Magnifique session de méditation ce matin au lever du soleil. Je commence la journée avec une énergie positive incroyable ! 🌅✨',
      timestamp: 'Il y a 1 heure',
      likes: 12,
      comments: 4,
      tags: ['meditation', 'morning', 'positive'],
      isAnonymous: false
    },
    {
      id: '2',
      author: 'Utilisateur anonyme',
      content: 'Quelqu\'un d\'autre a des difficultés à gérer le stress ces derniers temps ? J\'ai l\'impression d\'être submergé par tout ce qui se passe...',
      timestamp: 'Il y a 3 heures',
      likes: 8,
      comments: 7,
      tags: ['stress', 'support', 'help'],
      isAnonymous: true
    },
    {
      id: '3',
      author: 'Marie L.',
      content: 'Partage du jour : j\'ai découvert que 10 minutes de marche en pleine conscience changent complètement ma perspective. Merci à cette communauté pour l\'inspiration ! 🚶‍♀️💚',
      timestamp: 'Il y a 5 heures',
      likes: 20,
      comments: 6,
      tags: ['walking', 'mindfulness', 'gratitude'],
      isAnonymous: false
    },
    {
      id: '4',
      author: 'Sam R.',
      content: 'Challenge de la semaine : noter 3 choses positives chaque soir avant de dormir. Qui se joint à moi ? 📝💫',
      timestamp: 'Il y a 1 jour',
      likes: 15,
      comments: 9,
      tags: ['challenge', 'positivity', 'gratitude'],
      isAnonymous: false
    }
  ];

  const communities = [
    { name: 'Méditation & Pleine Conscience', members: 1247, description: 'Pratiques et partages autour de la méditation' },
    { name: 'Gestion du Stress', members: 892, description: 'Techniques et soutien pour gérer le stress quotidien' },
    { name: 'Sport & Bien-être', members: 756, description: 'Motivation et conseils pour une vie active' },
    { name: 'Nutrition Consciente', members: 634, description: 'Alimentation saine et équilibrée' }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    toast.success("Publication partagée avec succès!");
    setNewPost('');
    setShowNewPost(false);
    setIsAnonymous(false);
  };

  const handleLike = (postId: string) => {
    toast.success("Vous avez aimé cette publication");
  };

  const handleComment = (postId: string) => {
    toast.info("Fonctionnalité de commentaire en développement");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communauté Bien-être</h1>
          <p className="text-muted-foreground">
            Partagez votre parcours et soutenez-vous mutuellement
          </p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          <Plus className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>

      {/* Search and Communities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des publications, des hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* New Post Form */}
          {showNewPost && (
            <Card>
              <CardHeader>
                <CardTitle>Partager avec la communauté</CardTitle>
                <CardDescription>
                  Votre expérience peut inspirer et aider d'autres personnes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Que souhaitez-vous partager aujourd'hui ?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      <span>Publier anonymement</span>
                    </label>
                    <div className="text-sm text-muted-foreground">
                      Utilisez # pour ajouter des hashtags
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                      Publier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          post.isAnonymous ? 'bg-gray-100' : 'bg-primary/10'
                        }`}>
                          {post.isAnonymous ? (
                            <Globe className="h-5 w-5 text-gray-600" />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm leading-relaxed">{post.content}</p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          className="text-muted-foreground hover:text-blue-500"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
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
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Votre impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-muted-foreground">Publications partagées</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">47</p>
                <p className="text-sm text-muted-foreground">Personnes aidées</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">156</p>
                <p className="text-sm text-muted-foreground">Interactions positives</p>
              </div>
            </CardContent>
          </Card>

          {/* Communities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communautés populaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communities.map((community, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <h4 className="font-medium text-sm">{community.name}</h4>
                  <p className="text-xs text-muted-foreground">{community.description}</p>
                  <p className="text-xs text-blue-600 mt-1">{community.members} membres</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Défi du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium mb-2">Gratitude Express</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Partagez une chose pour laquelle vous êtes reconnaissant aujourd'hui
                </p>
                <Button size="sm" className="w-full">
                  Participer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CSocialPage;
