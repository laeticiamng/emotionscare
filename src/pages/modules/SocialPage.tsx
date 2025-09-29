import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Users, Heart, Share2, Plus, Search, Globe } from 'lucide-react';

const SocialPage = () => {
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const communityPosts = [
    {
      id: 1,
      author: 'Marie L.',
      avatar: '👩‍💼',
      time: 'Il y a 2h',
      content: 'Excellente session de méditation ce matin ! La technique de respiration m\'a vraiment aidée à me centrer avant ma présentation.',
      likes: 12,
      comments: 3,
      tags: ['méditation', 'respiration']
    },
    {
      id: 2,
      author: 'Thomas K.',
      avatar: '👨‍💻',
      time: 'Il y a 4h',
      content: 'Quelqu\'un a-t-il testé le nouveau module VR ? Je suis curieux de connaître vos retours !',
      likes: 8,
      comments: 7,
      tags: ['VR', 'nouveauté']
    },
    {
      id: 3,
      author: 'Sarah M.',
      avatar: '👩‍🎨',
      time: 'Il y a 6h',
      content: 'Partage de ma semaine de bien-être : 5 sessions de coach IA, 3 méditations VR et une amélioration de 15% de mon niveau de stress ! 💪',
      likes: 24,
      comments: 12,
      tags: ['progrès', 'coaching', 'stress']
    }
  ];

  const supportGroups = [
    {
      id: 1,
      name: 'Gestion du Stress au Travail',
      members: 248,
      description: 'Échanges et conseils pour mieux gérer le stress professionnel',
      activity: 'Très actif',
      image: '💼'
    },
    {
      id: 2,
      name: 'Méditation Débutants',
      members: 156,
      description: 'Groupe d\'entraide pour débuter la méditation en douceur',
      activity: 'Actif',
      image: '🧘'
    },
    {
      id: 3,
      name: 'Parents et Bien-être',
      members: 89,
      description: 'Concilier parentalité et prendre soin de soi',
      activity: 'Modéré',
      image: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6">
      {/* Skip Links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>
        <a 
          href="#community-feed" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Flux communauté
        </a>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-full">
              <Users className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Communauté Bien-être
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connectez-vous avec d'autres utilisateurs, partagez vos expériences et trouvez du soutien
          </p>
        </header>

        <main id="main-content" className="grid lg:grid-cols-3 gap-6">
          {/* Flux principal */}
          <section id="community-feed" className="lg:col-span-2 space-y-6" aria-labelledby="feed-title">
            <h2 id="feed-title" className="sr-only">Flux de la communauté</h2>
            
            {/* Nouveau message */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  Partager avec la communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Partagez votre expérience, posez une question ou encouragez la communauté..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="resize-none focus:ring-green-500 focus:border-green-500"
                  aria-label="Nouveau message pour la communauté"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Soyez bienveillant et respectueux 💚
                  </span>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    disabled={!newMessage.trim()}
                  >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Publier
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts de la communauté */}
            <div className="space-y-6">
              {communityPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{post.avatar}</div>
                        <div>
                          <div className="font-medium">{post.author}</div>
                          <div className="text-xs text-muted-foreground">{post.time}</div>
                        </div>
                      </div>
                      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                      <button 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label={`${post.likes} j'aime`}
                      >
                        <Heart className="h-4 w-4" aria-hidden="true" />
                        {post.likes}
                      </button>
                      <button 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
                        aria-label={`${post.comments} commentaires`}
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        {post.comments}
                      </button>
                      <button 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-500 transition-colors"
                        aria-label="Partager ce message"
                      >
                        <Share2 className="h-4 w-4" aria-hidden="true" />
                        Partager
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6" aria-labelledby="sidebar-title">
            <h2 id="sidebar-title" className="sr-only">Informations complémentaires</h2>
            
            {/* Recherche */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="Rechercher dans la communauté..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Rechercher dans la communauté"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Groupes de soutien */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-teal-500" aria-hidden="true" />
                  Groupes de soutien
                </CardTitle>
                <CardDescription>
                  Rejoignez des groupes qui vous correspondent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="p-3 rounded-lg border border-gray-100 hover:border-teal-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{group.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{group.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {group.members} membres • {group.activity}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {group.description}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3 w-full"
                          aria-label={`Rejoindre le groupe ${group.name}`}
                        >
                          <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                          Rejoindre
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Statistiques communauté */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Votre activité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-xs text-green-700">Messages publiés</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-xs text-blue-700">J'aime reçus</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-xs text-purple-700">Groupes rejoints</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default SocialPage;