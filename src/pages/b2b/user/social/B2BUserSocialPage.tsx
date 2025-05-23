
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Heart, Share2, Plus, Search } from 'lucide-react';
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
}

const B2BUserSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Marie Dubois',
      content: 'Excellente session de méditation ce matin ! Je me sens plus concentrée pour la journée. Qui d\'autre a essayé ?',
      timestamp: 'Il y a 2 heures',
      likes: 8,
      comments: 3,
      tags: ['meditation', 'bien-être']
    },
    {
      id: '2',
      author: 'Pierre Martin',
      content: 'Rappel : pause collective à 15h aujourd\'hui dans la salle de détente. Venez nombreux !',
      timestamp: 'Il y a 4 heures',
      likes: 12,
      comments: 5,
      tags: ['pause', 'équipe']
    },
    {
      id: '3',
      author: 'Sophie Laurent',
      content: 'Mon score de bien-être est en hausse cette semaine grâce aux exercices de respiration. Merci pour les conseils !',
      timestamp: 'Il y a 1 jour',
      likes: 15,
      comments: 7,
      tags: ['respiration', 'progrès']
    }
  ]);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    toast.success("Publication partagée avec succès!");
    setNewPost('');
    setShowNewPost(false);
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
          <h1 className="text-3xl font-bold">Espace Social</h1>
          <p className="text-muted-foreground">
            Partagez et échangez avec votre équipe sur le bien-être au travail
          </p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle publication
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des publications, des personnes ou des hashtags..."
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
            <CardTitle>Nouvelle publication</CardTitle>
            <CardDescription>
              Partagez vos expériences et conseils bien-être avec votre équipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Que souhaitez-vous partager ?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-24"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Utilisez # pour ajouter des hashtags
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
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
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

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-muted-foreground">Membres actifs</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">156</p>
              <p className="text-sm text-muted-foreground">Publications ce mois</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">89%</p>
              <p className="text-sm text-muted-foreground">Taux d'engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserSocialPage;
