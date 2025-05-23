
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Brain } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
          <p className="text-muted-foreground mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </Button>
          </div>

          <div className="mt-8 pt-4 border-t text-xs text-muted-foreground">
            Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
