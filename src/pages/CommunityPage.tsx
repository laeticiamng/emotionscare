
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Heart, MessageCircle, Share, Filter, TrendingUp, Star, Shield } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const posts = [
    {
      id: 1,
      author: 'Marie L.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      time: '2h',
      content: 'Très belle séance de méditation ce matin ! 🧘‍♀️ Je me sens beaucoup plus centrée pour attaquer cette journée. Qui d\'autre a commencé sa journée par du bien-être ?',
      likes: 12,
      comments: 5,
      tags: ['méditation', 'matin', 'bien-être']
    },
    {
      id: 2,
      author: 'Thomas K.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
      time: '4h',
      content: 'Petit rappel pour ceux qui traversent une période difficile : il est normal de ne pas se sentir au top tous les jours. Prenez soin de vous, un pas à la fois. 💙',
      likes: 28,
      comments: 12,
      tags: ['soutien', 'encouragement']
    },
    {
      id: 3,
      author: 'Sophie M.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
      time: '6h',
      content: 'J\'ai découvert une technique de respiration incroyable dans l\'app aujourd\'hui. Qui veut que je partage ? Ça m\'a aidée à gérer mon stress au travail.',  
      likes: 15,
      comments: 8,
      tags: ['respiration', 'stress', 'travail']
    }
  ];

  const groups = [
    {
      id: 1,
      name: 'Méditation Quotidienne',
      description: 'Groupe pour partager nos pratiques de méditation',
      members: 1247,
      posts: 342,
      category: 'Mindfulness'
    },
    {
      id: 2,
      name: 'Gestion du Stress',
      description: 'Techniques et soutien pour gérer le stress',
      members: 856,
      posts: 189,
      category: 'Stress'
    },
    {
      id: 3,
      name: 'Parents Zen',
      description: 'Communauté pour les parents cherchant l\'équilibre',
      members: 623,
      posts: 234,
      category: 'Famille'
    }
  ];

  const challenges = [
    {
      id: 1,
      title: '7 jours de gratitude',
      description: 'Partager une chose pour laquelle vous êtes reconnaissant chaque jour',
      participants: 234,
      daysLeft: 3,
      difficulty: 'Facile'
    },
    {
      id: 2,
      title: 'Méditation de pleine conscience',
      description: '21 jours de méditation guidée de 10 minutes',
      participants: 156,
      daysLeft: 18,
      difficulty: 'Moyen'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Communauté EmotionsCare</h1>
        <p className="text-muted-foreground">
          Connectez-vous, partagez et soutenez-vous mutuellement dans votre parcours bien-être
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">10,234</div>
            <div className="text-sm text-muted-foreground">Membres actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">1,456</div>
            <div className="text-sm text-muted-foreground">Posts cette semaine</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">23,567</div>
            <div className="text-sm text-muted-foreground">Soutiens échangés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { id: 'feed', label: 'Actualités', icon: <MessageCircle className="h-4 w-4" /> },
          { id: 'groups', label: 'Groupes', icon: <Users className="h-4 w-4" /> },
          { id: 'challenges', label: 'Défis', icon: <TrendingUp className="h-4 w-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Create Post */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <Input placeholder="Partagez votre expérience, posez une question..." className="mb-3" />
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline">💭 Pensée</Badge>
                          <Badge variant="outline">❓ Question</Badge>
                          <Badge variant="outline">🎉 Victoire</Badge>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={post.avatar} 
                        alt={post.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.author}</span>
                          <span className="text-sm text-muted-foreground">• {post.time}</span>
                        </div>
                        
                        <p className="mb-4">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-6">
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
              ))}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-4">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {group.name}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{group.members.toLocaleString()} membres</span>
                        <span>{group.posts} posts</span>
                      </div>
                      <Button>Rejoindre</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      {challenge.title}
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm">
                        <span>{challenge.participants} participants</span>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {challenge.daysLeft} jours restants
                      </span>
                    </div>
                    <Button className="w-full">Participer au défi</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Règles de la Communauté
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>• Respectez les autres membres</div>
              <div>• Partagez de manière constructive</div>
              <div>• Pas de contenu inapproprié</div>
              <div>• Soutenez-vous mutuellement</div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Voir toutes les règles
              </Button>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Sujets Tendances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['#méditation', '#gratitude', '#stress', '#sommeil', '#motivation'].map((topic) => (
                <div key={topic} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                  <span className="text-sm">{topic}</span>
                  <Badge variant="secondary" className="text-xs">+12%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Connections */}
          <Card>
            <CardHeader>
              <CardTitle>Connexions Suggérées</CardTitle>
              <CardDescription>
                Membres avec des intérêts similaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Alex M.', 'Julie P.', 'Pierre L.'].map((name, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <span className="text-sm">{name}</span>
                  </div>
                  <Button variant="outline" size="sm">Suivre</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
