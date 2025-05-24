
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const suggestions = [
    {
      title: 'Accueil',
      description: 'Retourner à la page d\'accueil',
      icon: Home,
      action: () => navigate('/')
    },
    {
      title: 'Choisir votre mode',
      description: 'Sélectionner votre type d\'utilisation',
      icon: Search,
      action: () => navigate('/choose-mode')
    },
    {
      title: 'Centre d\'aide',
      description: 'Trouver de l\'aide et des réponses',
      icon: HelpCircle,
      action: () => navigate('/help')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* 404 Illustration */}
          <div className="space-y-4">
            <div className="text-8xl font-bold text-primary/20">404</div>
            <h1 className="text-4xl font-bold tracking-tight">
              Page introuvable
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Page précédente
            </Button>
            <Button onClick={() => navigate('/')} size="lg">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Que souhaitez-vous faire ?</CardTitle>
              <CardDescription>
                Voici quelques suggestions pour continuer votre navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      onClick={suggestion.action}
                      className="h-auto flex flex-col items-center gap-3 p-6 w-full"
                    >
                      <div className="p-2 bg-primary/10 rounded-full">
                        <suggestion.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {suggestion.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-sm text-muted-foreground">
            <p>
              Si le problème persiste, n'hésitez pas à{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate('/help')}
              >
                nous contacter
              </Button>
              {' '}pour obtenir de l'aide.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
