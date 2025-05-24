
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">
            404
          </div>
          <CardTitle className="text-2xl">Page introuvable</CardTitle>
          <CardDescription className="text-lg">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Voici quelques suggestions pour continuer :
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={goBack} variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            <Button onClick={() => navigate('/')} className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Vous ne trouvez pas ce que vous cherchez ?
            </p>
            <Button 
              variant="link" 
              onClick={() => navigate('/help')}
              className="flex items-center mx-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Consulter l'aide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
