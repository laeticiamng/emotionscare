
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
            <CardTitle className="text-2xl mb-2">Page non trouvée</CardTitle>
            <CardDescription className="text-lg">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-6">
              <p>Voici quelques suggestions :</p>
              <ul className="mt-2 space-y-1">
                <li>• Vérifiez l'URL dans votre barre d'adresse</li>
                <li>• Retournez à la page précédente</li>
                <li>• Visitez notre page d'accueil</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={goHome} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
              
              <Button onClick={goBack} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-center text-sm text-muted-foreground">
                Besoin d'aide ? Contactez notre{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate('/help')}
                >
                  support client
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
