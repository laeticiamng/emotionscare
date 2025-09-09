/**
 * SocialB2CPage - Réseau social exclusif aux particuliers B2C
 * INTERDIT aux utilisateurs B2B (employés et RH)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp, 
  Plus,
  Smile,
  Camera,
  Send,
  TrendingUp,
  Star,
  User,
  Globe,
  Lock,
  Filter
} from 'lucide-react';

const SocialB2CPage: React.FC = () => {
  const [newPost, setNewPost] = useState('');

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/app/home" className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">EmotionsCare</span>
              </Link>
              <Badge variant="default" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Social B2C
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Particuliers uniquement
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">Retour accueil</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">
                  Bienvenue sur votre réseau social bien-être
                </h1>
                <p className="text-muted-foreground">
                  Partagez, inspirez et connectez-vous avec d'autres particuliers sur leur parcours émotionnel
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="groups">Groupes</TabsTrigger>
            </TabsList>

            {/* FIL D'ACTUALITÉ */}
            <TabsContent value="feed" className="space-y-6">
              {/* Create Post */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Partager votre ressenti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Comment vous sentez-vous aujourd'hui ? Partagez votre expérience avec EmotionsCare..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Smile className="h-4 w-4 mr-1" />
                            Humeur
                          </Button>
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-1" />
                            Photo
                          </Button>
                        </div>
                        <Button size="sm" disabled={!newPost.trim()}>
                          <Send className="h-4 w-4 mr-1" />
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6">
                {/* Post 1 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          SM
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Sarah M.</div>
                        <div className="text-sm text-muted-foreground">Il y a 2 heures • Particulier</div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        <Heart className="h-3 w-3 mr-1" />
                        Optimiste
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        🌟 Incroyable séance de Flash Glow ce matin ! J'ai commencé la journée stressée par ma présentation, 
                        mais 5 minutes d'exercices et me voilà transformée. La technologie émotionnelle d'EmotionsCare est 
                        vraiment magique ✨
                        
                        <br/><br/>
                        Pour ceux qui hésitent encore, lancez-vous ! Ça change vraiment la donne au quotidien 💪
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-blue-50 rounded-full">#FlashGlow</span>
                        <span className="px-2 py-1 bg-purple-50 rounded-full">#BienEtre</span>
                        <span className="px-2 py-1 bg-green-50 rounded-full">#Motivation</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                          <span>24</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span>8</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          <span>3</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Commenter
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Post 2 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          ML
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Marc L.</div>
                        <div className="text-sm text-muted-foreground">Il y a 4 heures • Particulier</div>
                      </div>
                      <Badge variant="outline" className="text-orange-600">
                        <Heart className="h-3 w-3 mr-1" />
                        Réfléchi
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        Question du jour : Comment gérez-vous les moments de stress intense ? 🤔
                        
                        <br/><br/>
                        Personnellement, j'ai découvert que la combinaison Scanner émotionnel + Musicothérapie 
                        est redoutable. Le scan me dit où j'en suis vraiment, et ensuite la musique adaptative 
                        d'EmotionsCare fait le reste. 
                        
                        <br/><br/>
                        Et vous, quelles sont vos techniques ? J'aimerais découvrir d'autres approches ! 🧘‍♂️
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-orange-50 rounded-full">#Stress</span>
                        <span className="px-2 py-1 bg-purple-50 rounded-full">#Musicotherapie</span>
                        <span className="px-2 py-1 bg-blue-50 rounded-full">#PartageExpérience</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                          <span>18</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span>12</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          <span>5</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Commenter
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Post 3 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          EK
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Emma K.</div>
                        <div className="text-sm text-muted-foreground">Il y a 6 heures • Particulier</div>
                      </div>
                      <Badge variant="outline" className="text-purple-600">
                        <Heart className="h-3 w-3 mr-1" />
                        Inspirée
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        💜 Milestone personnel : 30 jours de méditation quotidienne avec EmotionsCare ! 
                        
                        <br/><br/>
                        Au début, je n'y croyais pas trop... Mais les résultats sont là : sommeil amélioré, 
                        moins d'anxiété, et surtout une meilleure connaissance de moi-même grâce aux analyses 
                        émotionnelles.
                        
                        <br/><br/>
                        Merci à cette communauté pour le soutien quotidien 🙏 On continue !
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-purple-50 rounded-full">#30DaysChallenge</span>
                        <span className="px-2 py-1 bg-blue-50 rounded-full">#Meditation</span>
                        <span className="px-2 py-1 bg-green-50 rounded-full">#Milestone</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                          <span>31</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span>15</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          <span>7</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Commenter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* DÉCOUVRIR */}
            <TabsContent value="discover" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Tendances de la semaine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">#FlashGlow</span>
                      <span className="text-sm font-medium">487 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">#MeditationQuotidienne</span>
                      <span className="text-sm font-medium">312 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">#JournalEmotionnel</span>
                      <span className="text-sm font-medium">298 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">#MusicotherapieIA</span>
                      <span className="text-sm font-medium">256 posts</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Membres actifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gold-100 text-gold-600">⭐</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Julie P.</div>
                        <div className="text-xs text-muted-foreground">Mentor bien-être</div>
                      </div>
                      <Button variant="outline" size="sm">Suivre</Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">TA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Thomas A.</div>
                        <div className="text-xs text-muted-foreground">Coach motivation</div>
                      </div>
                      <Button variant="outline" size="sm">Suivre</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* GROUPES */}
            <TabsContent value="groups" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Débutants EmotionsCare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Groupe d'entraide pour les nouveaux utilisateurs. Questions, conseils et soutien.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Public • 1,247 membres
                      </div>
                      <Button size="sm">Rejoindre</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Méditation Avancée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Techniques avancées et partage d'expériences pour les pratiquants expérimentés.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Lock className="h-4 w-4 inline mr-1" />
                        Privé • 342 membres
                      </div>
                      <Button size="sm" variant="outline">Demander</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Parents Zen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Concilier vie de famille et bien-être personnel. Conseils et soutien entre parents.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Public • 823 membres
                      </div>
                      <Button size="sm">Rejoindre</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Challenges Mensuels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relevez des défis bien-être chaque mois avec la communauté. Motivation garantie !
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Public • 2,156 membres
                      </div>
                      <Button size="sm">Rejoindre</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SocialB2CPage;