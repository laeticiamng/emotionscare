
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, MessageSquare, Share2, Heart, MessageCircle, Plus, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSocialCocon } from '@/contexts/SocialCoconContext';

const B2CSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const { posts, addPost, likePost, addComment } = useSocialCocon();
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const handleCreatePost = () => {
    if (newPost.trim()) {
      addPost(newPost, 'current-user');
      setNewPost('');
      setIsPostDialogOpen(false);
      toast.success('Publication partagée avec succès !');
    }
  };

  const handleLike = (postId: string) => {
    likePost(postId, 'current-user');
    toast.success('Publication aimée !');
  };

  const handleComment = (postId: string) => {
    if (newComment.trim()) {
      addComment(postId, newComment, 'current-user');
      setNewComment('');
      toast.success('Commentaire ajouté !');
    }
  };

  const mockPosts = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Marie L.',
      userAvatar: '/placeholder.svg',
      content: "Aujourd'hui, j'ai pris 10 minutes pour méditer et cela a complètement changé ma journée. Petit pas mais grand impact ! 🧘‍♀️",
      createdAt: '2024-01-20T10:30:00Z',
      likes: 12,
      comments: 3,
      tags: ['méditation', 'bien-être', 'mindfulness'],
      isAnonymous: false
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Utilisateur Anonyme',
      userAvatar: '/placeholder.svg',
      content: "Je traverse une période difficile mais je voulais partager que parler à quelqu'un m'aide vraiment. N'hésitez pas à tendre la main si vous en avez besoin.",
      createdAt: '2024-01-20T08:15:00Z',
      likes: 28,
      comments: 7,
      tags: ['soutien', 'entraide', 'courage'],
      isAnonymous: true
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Thomas K.',
      userAvatar: '/placeholder.svg',
      content: "Défi du jour : noter 3 choses positives qui me sont arrivées aujourd'hui. Qui se joint à moi ? 📝✨",
      createdAt: '2024-01-19T18:45:00Z',
      likes: 45,
      comments: 12,
      tags: ['challenge', 'positivity', 'gratitude'],
      isAnonymous: false
    }
  ];

  const communities = [
    { name: 'Méditation & Pleine Conscience', members: 1247, description: 'Pratiques et partages autour de la méditation' },
    { name: 'Gestion du Stress', members: 892, description: 'Techniques et conseils pour mieux gérer le stress' },
    { name: 'Sommeil Réparateur', members: 634, description: 'Améliorer la qualité de son sommeil' },
    { name: 'Parents Bienveillants', members: 456, description: 'Soutien entre parents pour une parentalité épanouie' }
  ];

  const challenges = [
    { title: '7 jours de gratitude', participants: 234, description: 'Noter chaque jour 3 choses pour lesquelles vous êtes reconnaissant' },
    { title: 'Méditation quotidienne', participants: 189, description: '10 minutes de méditation chaque jour pendant une semaine' },
    { title: 'Actes de bienveillance', participants: 156, description: 'Un acte de bienveillance par jour pendant 5 jours' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/b2c/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Social Cocoon</h1>
            <p className="text-muted-foreground">
              Connectez-vous avec une communauté bienveillante
            </p>
          </div>
        </div>
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle publication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Partager avec la communauté</DialogTitle>
              <DialogDescription>
                Partagez vos pensées, expériences ou encouragements avec la communauté.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-content">Votre message</Label>
                <Textarea
                  id="post-content"
                  placeholder="Que souhaitez-vous partager aujourd'hui ?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Publication publique</span>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreatePost}>
                  Publier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="communities">Communautés</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="support">Soutien</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid gap-6">
            {mockPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback>
                          {post.isAnonymous ? '?' : post.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    {post.isAnonymous && (
                      <Badge variant="secondary">
                        <Lock className="mr-1 h-3 w-3" />
                        Anonyme
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{post.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
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
                        <Heart className="mr-2 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        className="text-muted-foreground"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedPost === post.id && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex space-x-3">
                        <Input
                          placeholder="Ajouter un commentaire..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={() => handleComment(post.id)}>
                          Envoyer
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {community.name}
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {community.members}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Rejoindre la communauté</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid gap-6">
            {challenges.map((challenge, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {challenge.title}
                    <Badge variant="outline">
                      {challenge.participants} participants
                    </Badge>
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Participer au défi</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat de soutien 24/7</CardTitle>
                <CardDescription>
                  Discutez avec des personnes bienveillantes à tout moment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Rejoindre le chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buddy System</CardTitle>
                <CardDescription>
                  Trouvez un partenaire de soutien pour votre parcours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Trouver un buddy
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Ressources d'aide professionnelle</CardTitle>
                <CardDescription>
                  Accédez à des ressources et contacts professionnels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Lignes d'écoute</Button>
                  <Button variant="outline">Professionnels près de chez vous</Button>
                  <Button variant="outline">Ressources en ligne</Button>
                  <Button variant="outline">Guides d'auto-aide</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CSocialPage;
