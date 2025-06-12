import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Users, Calendar } from 'lucide-react';

const SocialPage = () => {
  const [posts] = useState([
    {
      id: 1,
      author: "Marie Dupont",
      avatar: "/avatars/marie.jpg",
      time: "il y a 2h",
      content: "Excellente séance de méditation ce matin ! Je me sens plus sereine pour aborder la journée. 🧘‍♀️",
      likes: 12,
      comments: 3,
      category: "Mindfulness"
    },
    {
      id: 2,
      author: "Thomas Martin",
      avatar: "/avatars/thomas.jpg",
      time: "il y a 4h",
      content: "Challenge équipe de la semaine : 5 sessions VR complétées ! Qui se joint à nous ?",
      likes: 8,
      comments: 5,
      category: "Challenge"
    }
  ]);

  const [challenges] = useState([
    {
      id: 1,
      title: "Méditation quotidienne",
      participants: 24,
      timeLeft: "3 jours",
      progress: 75
    },
    {
      id: 2,
      title: "Scan émotionnel équipe",
      participants: 18,
      timeLeft: "5 jours",
      progress: 60
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Cocon</h1>
        <p className="text-muted-foreground">
          Partagez votre parcours bien-être avec votre équipe
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Feed principal */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Fil d'actualité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{post.author}</span>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{post.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <button className="flex items-center space-x-1 hover:text-primary">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          <span>Partager</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Challenges actifs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Challenges en cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{challenge.title}</h4>
                    <span className="text-xs text-muted-foreground">{challenge.timeLeft}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{challenge.participants} participants</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <Button size="sm" className="w-full" variant="outline">
                Voir tous les challenges
              </Button>
            </CardContent>
          </Card>

          {/* Équipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mon équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                24 membres actifs cette semaine
              </p>
              <Button size="sm" className="w-full" variant="outline">
                Voir l'équipe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;