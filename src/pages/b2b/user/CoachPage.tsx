
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, Heart } from 'lucide-react';

const B2BUserCoachPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coach IA</h1>
          <p className="text-muted-foreground">Votre accompagnateur personnalisé en bien-être émotionnel</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Chat en direct</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Discutez avec votre coach IA
              </p>
              <Button className="w-full">
                Démarrer une conversation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Bot className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Exercices guidés</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Exercices personnalisés
              </p>
              <Button variant="outline" className="w-full">
                Voir les exercices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Suivi émotionnel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Analyse de vos progrès
              </p>
              <Button variant="secondary" className="w-full">
                Voir mon suivi
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dernières conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Aucune conversation pour le moment. Commencez dès maintenant !
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserCoachPage;
