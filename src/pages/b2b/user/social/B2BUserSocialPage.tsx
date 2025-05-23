
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Heart, Share2, Plus, Search, Shield, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  department: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  isAnonymous?: boolean;
}

const B2BUserSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sophie M.',
      department: 'Marketing',
      content: 'Grande session de team building cette semaine ! L\'atelier sur la gestion du stress était vraiment enrichissant. Merci à l\'équipe RH pour cette initiative 🙌',
      timestamp: 'Il y a 2 heures',
      likes: 15,
      comments: 8,
      tags: ['teambuilding', 'stress', 'rh'],
      isAnonymous: false
    },
    {
      id: '2',
      author: 'Utilisateur anonyme',
      department: 'Confidentiel',
      content: 'Je traverse une période difficile avec la charge de travail. Quelqu\'un aurait-il des conseils pour mieux organiser ses priorités ?',
      timestamp: 'Il y a 4 heures',
      likes: 12,
      comments: 15,
      tags: ['help', 'workload', 'tips'],
      isAnonymous: true
    },
    {
      id: '3',
      author: 'Thomas R.',
      department: 'IT',
      content: 'Partage du jour : j\'ai commencé à faire des pauses actives toutes les 2h. Incroyable comme ça améliore la concentration ! Qui veut se joindre au challenge ? 💪',
      timestamp: 'Il y a 6 heures',
      likes: 23,
      comments: 11,
      tags: ['pauseactive', 'concentration', 'challenge'],
      isAnonymous: false
    }
  ]);

  const departments = [
    { name: 'Marketing', members: 24, color: 'bg-blue-100 text-blue-800' },
    { name: 'IT', members: 18, color: 'bg-green-100 text-green-800' },
    { name: 'RH', members: 12, color: 'bg-purple-100 text-purple-800' },
    { name: 'Ventes', members: 30, color: 'bg-orange-100 text-orange-800' },
    { name: 'Finance', members: 15, color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    toast.success("Publication partagée avec l'équipe!");
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
          <h1 className="text-3xl font-bold flex items-center">
            <Building2 className="mr-3 h-8 w-8 text-primary" />
            Espace Équipe
          </h1>
          <p className="text-muted-foreground">
            Partagez et échangez avec vos collègues en toute confidentialité
          </p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          <Plus className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>

      {/* Company Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Espace Sécurisé Entreprise</h3>
                <p className="text-sm text-blue-700">Tous les échanges restent confidentiels et internes à l'organisation</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              156 collaborateurs actifs
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les publications de l'équipe..."
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
                <CardTitle>Partager avec l'équipe</CardTitle>
                <CardDescription>
                  Partagez vos expériences et conseils avec vos collègues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Que souhaitez-vous partager avec l'équipe ?"
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
                            <Shield className="h-5 w-5 text-gray-600" />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {post.department} • {post.timestamp}
                          </p>
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
          {/* Team Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques Équipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">85%</p>
                <p className="text-sm text-muted-foreground">Participation active</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-sm text-muted-foreground">Satisfaction équipe</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">47</p>
                <p className="text-sm text-muted-foreground">Échanges cette semaine</p>
              </div>
            </CardContent>
          </Card>

          {/* Departments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Départements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <h4 className="font-medium text-sm">{dept.name}</h4>
                    <p className="text-xs text-muted-foreground">{dept.members} membres</p>
                  </div>
                  <Badge className={dept.color}>
                    Actif
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/b2b/user/scan')}>
                <Heart className="mr-2 h-4 w-4" />
                Check-in émotionnel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Créer un groupe
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Support RH
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserSocialPage;
