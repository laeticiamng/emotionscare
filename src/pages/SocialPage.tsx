
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Shell from '@/Shell';
import { Button } from '@/components/ui/button';
import { Check, Users, MessageSquare, Share2 } from 'lucide-react';

const SocialPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Social Cocoon</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Communauté de soutien</CardTitle>
              <CardDescription>Rejoignez des groupes de personnes partageant les mêmes défis émotionnels</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connectez-vous avec d'autres personnes qui traversent des expériences similaires aux vôtres.</p>
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Explorer les groupes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Chat de soutien</CardTitle>
              <CardDescription>Discutez avec des personnes bienveillantes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Échangez en toute sécurité dans un environnement positif et modéré.</p>
              <Button className="w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Rejoindre le chat
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Partager votre parcours</CardTitle>
            <CardDescription>Inspirez les autres avec vos progrès et vos victoires</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Vous pouvez choisir de partager certains aspects de votre parcours de bien-être émotionnel pour inspirer d'autres personnes dans leur propre cheminement.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Partagez anonymement</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Contrôlez ce que vous partagez</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Recevez du soutien de la communauté</span>
              </div>
            </div>
            <Button className="mt-6">
              <Share2 className="mr-2 h-4 w-4" />
              Partager mon histoire
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default SocialPage;
