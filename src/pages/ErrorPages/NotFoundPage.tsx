
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/transitions/PageTransition';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition mode="fade">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="text-8xl font-bold text-muted-foreground/30">404</div>
            </div>
            <CardTitle className="text-2xl">Page non trouvée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/')} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
              
              <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Page précédente
              </Button>
              
              <Button onClick={() => navigate('/search')} variant="secondary" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Code d'erreur : 404 - Ressource introuvable
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
