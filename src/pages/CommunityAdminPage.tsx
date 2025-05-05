
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

const mockData = {
  postsOverTime: [
    { date: '01/05', posts: 15, moderated: 2 },
    { date: '02/05', posts: 22, moderated: 1 },
    { date: '03/05', posts: 18, moderated: 3 },
    { date: '04/05', posts: 25, moderated: 2 },
    { date: '05/05', posts: 30, moderated: 4 },
    { date: '06/05', posts: 28, moderated: 2 },
    { date: '07/05', posts: 35, moderated: 5 }
  ],
  tagDistribution: [
    { name: 'Inspiration', count: 45 },
    { name: 'Bien-être', count: 38 },
    { name: 'Entraide', count: 32 },
    { name: 'Réussite', count: 25 },
    { name: 'Gratitude', count: 20 }
  ],
  moderationQueue: [
    { 
      id: '1', 
      excerpt: "Je trouve que les horaires sont vraiment difficiles à gérer...",
      tags: ['Feedback', 'Organisation'],
      reason: "Sentiment négatif (score: 0.3)", 
      date: '2023-05-06' 
    },
    { 
      id: '2', 
      excerpt: "Est-ce que quelqu'un d'autre trouve que les deadlines sont impossibles ?",
      tags: ['Question', 'Travail'],
      reason: "Sentiment négatif (score: 0.2)", 
      date: '2023-05-07' 
    },
  ],
  suggestions: [
    {
      title: "Atelier Gestion du Stress",
      description: "Organiser un atelier de 30min sur les techniques de respiration et méditation",
      cost: "Faible",
      participants: "Tous les services"
    },
    {
      title: "Défi Photo Positif",
      description: "Lancer un défi où les employés partagent une photo positive de leur journée",
      cost: "Aucun",
      participants: "Volontaires"
    },
    {
      title: "Pause Café Virtuelle",
      description: "Créer un espace d'échange informel de 15min une fois par semaine",
      cost: "Faible",
      participants: "Équipes marketing et développement"
    }
  ]
};

const CommunityAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'7j' | '30j' | '90j'>('7j');
  const [moderationFilter, setModerationFilter] = useState('all');
  
  const handleApprovePost = (id: string) => {
    toast({
      title: "Post approuvé",
      description: "Le post a été approuvé et publié",
    });
  };
  
  const handleRejectPost = (id: string) => {
    toast({
      title: "Post rejeté",
      description: "Le post a été définitivement supprimé",
    });
  };
  
  const handleScheduleEvent = (title: string) => {
    toast({
      title: "Événement planifié",
      description: `"${title}" a été ajouté au calendrier`,
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Social Cocoon - Vue Admin</h1>
          <p className="text-muted-foreground">Pilotage de la communauté et modération</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTimeRange('7j')} className={timeRange === '7j' ? 'bg-secondary/20' : ''}>
            7j
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('30j')} className={timeRange === '30j' ? 'bg-secondary/20' : ''}>
            30j
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('90j')} className={timeRange === '90j' ? 'bg-secondary/20' : ''}>
            90j
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <h3 className="text-2xl font-bold">173</h3>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12% vs période précédente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de Modération</p>
                <h3 className="text-2xl font-bold">8%</h3>
              </div>
              <div className="p-2 rounded-full bg-secondary/10">
                <AlertTriangle className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4 text-xs flex items-center text-muted-foreground">
              <span>14 posts modérés sur 173</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Bienveillance</p>
                <h3 className="text-2xl font-bold">84%</h3>
              </div>
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5% vs période précédente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Moyen</p>
                <h3 className="text-2xl font-bold">4.2</h3>
              </div>
              <div className="p-2 rounded-full bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <span>4.2 réactions par post</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="mb-4 w-full max-w-xl">
          <TabsTrigger value="statistics" className="flex-1">Statistiques</TabsTrigger>
          <TabsTrigger value="moderation" className="flex-1">Modération</TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1">Suggestions IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Posts au fil du temps</CardTitle>
                <CardDescription>Volume quotidien de publications</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.postsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="posts" stroke="#8884d8" activeDot={{ r: 8 }} name="Publications" />
                    <Line type="monotone" dataKey="moderated" stroke="#ff8042" name="Modérées" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des tags</CardTitle>
                <CardDescription>Sujets les plus discutés dans la communauté</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.tagDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Nombre d'utilisation" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags populaires</CardTitle>
              <CardDescription>Un aperçu des sujets de discussion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockData.tagDistribution.map(tag => (
                  <Badge key={tag.name} variant="outline" className="px-3 py-1 text-sm bg-secondary/10">
                    {tag.name} ({tag.count})
                  </Badge>
                ))}
                <Badge variant="outline" className="px-3 py-1 text-sm bg-secondary/10">
                  TeamBuilding (18)
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-secondary/10">
                  Développement (15)
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-secondary/10">
                  Motivation (12)
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="moderation" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Posts à modérer</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModerationFilter('all')} className={moderationFilter === 'all' ? 'bg-secondary/20' : ''}>
                Tous
              </Button>
              <Button variant="outline" onClick={() => setModerationFilter('auto')} className={moderationFilter === 'auto' ? 'bg-secondary/20' : ''}>
                Auto
              </Button>
              <Button variant="outline" onClick={() => setModerationFilter('manual')} className={moderationFilter === 'manual' ? 'bg-secondary/20' : ''}>
                Manuel
              </Button>
            </div>
          </div>
          
          {mockData.moderationQueue.map(post => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-secondary/10">{tag}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Raison : {post.reason}</p>
                      <p>Date : {new Date(post.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 self-end sm:self-center">
                    <Button 
                      onClick={() => handleApprovePost(post.id)} 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approuver
                    </Button>
                    <Button 
                      onClick={() => handleRejectPost(post.id)} 
                      variant="destructive"
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {mockData.moderationQueue.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun post à modérer</h3>
                <p className="text-muted-foreground">Tout est à jour !</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-6">
          <h2 className="text-xl font-medium">Suggestions d'actions IA</h2>
          
          {mockData.suggestions.map((suggestion, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{suggestion.title}</h3>
                    <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Coût:</span>
                        <Badge variant="outline">{suggestion.cost}</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Participants:</span>
                        <Badge variant="outline">{suggestion.participants}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-center">
                    <Button 
                      onClick={() => handleScheduleEvent(suggestion.title)} 
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Planifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityAdminPage;
