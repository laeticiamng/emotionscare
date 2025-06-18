
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageCircle, Heart, Share2, Plus } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const [posts] = useState([
    {
      id: 1,
      author: 'Marie L.',
      avatar: '🌸',
      content: 'Aujourd\'hui j\'ai réussi à méditer 10 minutes sans interruption ! Petit pas mais je suis fière 💪',
      likes: 12,
      comments: 3,
      time: 'il y a 2h'
    },
    {
      id: 2,
      author: 'Thomas K.',
      avatar: '🌟',
      content: 'Quelqu\'un aurait des conseils pour gérer l\'anxiété avant un entretien important ?',
      likes: 8,
      comments: 7,
      time: 'il y a 4h'
    }
  ]);

  const groups = [
    { id: 1, name: 'Méditation Quotidienne', members: 1240, activity: 'Très actif' },
    { id: 2, name: 'Gestion du Stress', members: 890, activity: 'Actif' },
    { id: 3, name: 'Parents Bien-être', members: 567, activity: 'Modéré' }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Communauté</h1>
        <p className="text-muted-foreground">
          Connectez-vous avec d'autres personnes sur le même chemin de bien-être
        </p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      😊
                    </div>
                    <div className="flex-1">
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        placeholder="Partagez votre expérience, vos progrès ou demandez des conseils..."
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">📷</Button>
                          <Button variant="ghost" size="sm">🎵</Button>
                          <Button variant="ghost" size="sm">📊</Button>
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.author}</span>
                          <span className="text-sm text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <Share2 className="h-4 w-4" />
                            Partager
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Votre Profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-2xl">
                      😊
                    </div>
                    <h3 className="font-semibold">Vous</h3>
                    <p className="text-sm text-muted-foreground">Membre depuis 2 mois</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">15</div>
                        <div className="text-muted-foreground">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">42</div>
                        <div className="text-muted-foreground">Likes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">#MéditationMatinale</span>
                      <span className="text-xs text-muted-foreground">124 posts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">#GratitudeDuJour</span>
                      <span className="text-xs text-muted-foreground">89 posts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">#DéfiRelaxation</span>
                      <span className="text-xs text-muted-foreground">56 posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Membres:</span>
                      <span className="font-medium">{group.members.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Activité:</span>
                      <span className="font-medium">{group.activity}</span>
                    </div>
                  </div>
                  <Button className="w-full">Rejoindre</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Défi de la Semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">7 Jours de Gratitude</h3>
                <p className="text-muted-foreground mb-4">
                  Notez chaque jour 3 choses pour lesquelles vous êtes reconnaissant
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm">Participants: 234</span>
                  <span className="text-sm">Se termine dans 3 jours</span>
                </div>
                <Button className="w-full">Participer</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Défi du Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">30 Jours de Méditation</h3>
                <p className="text-muted-foreground mb-4">
                  Méditez au moins 5 minutes chaque jour pendant un mois complet
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm">Participants: 456</span>
                  <span className="text-sm">Se termine dans 18 jours</span>
                </div>
                <Button className="w-full">Participer</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
