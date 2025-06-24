
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="text-center space-y-6 p-8">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <h1 className="text-2xl font-bold">Page non trouvée</h1>
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
