import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Heart,
  Plus,
  Calendar,
  Trophy,
  Star
} from 'lucide-react';

const CommunityPage: React.FC = () => {
  const groups = [
    { name: 'Méditation matinale', members: 245, category: 'Bien-être' },
    { name: 'Gestion du stress', members: 189, category: 'Support' },
    { name: 'Parents bienveillants', members: 156, category: 'Famille' }
  ];

  const posts = [
    { author: 'Marie L.', content: 'Journée difficile mais j\'ai réussi ma séance de méditation !', likes: 12, replies: 3 },
    { author: 'Thomas R.', content: 'Quelqu\'un a des conseils pour mieux dormir ?', likes: 8, replies: 7 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Communauté EmotionsCare
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Rejoignez une communauté bienveillante de personnes partageant vos préoccupations de bien-être.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <Badge variant="secondary">{group.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{group.members} membres</p>
              <Button className="w-full">Rejoindre</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fil d'actualité</span>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{post.author}</span>
                    <span className="text-sm text-muted-foreground">il y a 2h</span>
                  </div>
                  <p className="text-sm">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.replies}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export { CommunityPage };
export default CommunityPage;