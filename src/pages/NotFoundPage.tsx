import React from 'react';
import { PageRoot } from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageRoot className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Fun 404 Visual */}
        <div className="relative">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>

        {/* Warm Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Cette page s'est envolée... 🦋
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Pas de panique ! Même les meilleures aventures ont parfois des chemins inattendus. 
            Retournons ensemble vers un endroit familier.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 max-w-lg mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5" />
                Retour à l'accueil
              </CardTitle>
              <CardDescription>
                Retrouvez votre tableau de bord et toutes vos fonctionnalités préférées
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(-1)}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowLeft className="h-5 w-5" />
                Page précédente
              </CardTitle>
              <CardDescription>
                Retourner là où vous étiez juste avant
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/scan')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" />
                Scanner de bien-être
              </CardTitle>
              <CardDescription>
                Commencez par découvrir votre état du moment
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Popular Destinations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ou explorez nos espaces populaires :</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/music')}>
              🎵 Musicothérapie
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/breathwork')}>
              🫁 Respiration
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/mood-mixer')}>
              🎧 Mood Mixer
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/journal')}>
              📝 Journal
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/coach')}>
              💬 Coach IA
            </Button>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground italic">
            "Chaque détour peut devenir une belle découverte. Prenez votre temps, nous sommes là pour vous accompagner." ✨
          </p>
        </div>
      </div>
    </PageRoot>
  );
};

export default NotFoundPage;