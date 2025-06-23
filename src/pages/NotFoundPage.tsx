
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
          <CardTitle className="text-2xl">Page introuvable</CardTitle>
          <CardDescription>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
