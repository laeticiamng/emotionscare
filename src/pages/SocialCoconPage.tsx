
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Heart } from 'lucide-react';

const SocialCoconPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Cocon Social</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Communauté
            </CardTitle>
            <CardDescription>
              Connectez-vous avec d'autres utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rejoignez une communauté bienveillante pour partager votre parcours de bien-être.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Discussions
            </CardTitle>
            <CardDescription>
              Échangez avec vos pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Participez à des discussions enrichissantes sur le bien-être émotionnel.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Soutien
            </CardTitle>
            <CardDescription>
              Entraide et bienveillance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recevez et offrez du soutien dans un environnement sécurisé et confidentiel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialCoconPage;
