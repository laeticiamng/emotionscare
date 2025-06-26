
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle,
  Compass,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const suggestions = [
    {
      title: "Accueil",
      description: "Retourner à la page d'accueil",
      icon: Home,
      action: () => navigate('/'),
      color: "bg-blue-500"
    },
    {
      title: "Dashboard",
      description: "Accéder à votre tableau de bord",
      icon: Compass,
      action: () => navigate('/dashboard'),
      color: "bg-green-500"
    },
    {
      title: "Aide",
      description: "Consulter le centre d'aide",
      icon: HelpCircle,
      action: () => navigate('/help'),
      color: "bg-purple-500"
    },
    {
      title: "Contact",
      description: "Nous contacter pour de l'aide",
      icon: MessageCircle,
      action: () => navigate('/contact'),
      color: "bg-orange-500"
    }
  ];

  const popularPages = [
    { name: "Scan Émotionnel", path: "/scan" },
    { name: "Coach IA", path: "/coach" },
    { name: "Journal", path: "/journal" },
    { name: "Musique", path: "/music" },
    { name: "VR", path: "/vr" },
    { name: "Préférences", path: "/preferences" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-8xl font-bold text-primary mb-4">404</div>
            <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oops ! La page que vous recherchez semble avoir disparu dans les méandres d'Internet. 
              Mais ne vous inquiétez pas, nous sommes là pour vous aider à retrouver votre chemin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Suggestions de Navigation
                </CardTitle>
                <CardDescription>
                  Voici quelques endroits où vous pourriez vouloir aller
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={suggestion.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-lg border hover:border-primary/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${suggestion.color} text-white`}>
                        <suggestion.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{suggestion.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Pages Populaires
                </CardTitle>
                <CardDescription>
                  Les fonctionnalités les plus utilisées d'EmotionsCare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {popularPages.map((page, index) => (
                    <motion.button
                      key={index}
                      onClick={() => navigate(page.path)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium"
                    >
                      {page.name}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Si vous pensez qu'il s'agit d'une erreur ou si vous avez besoin d'assistance, 
                  n'hésitez pas à nous contacter.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/help')}
                    className="flex-1"
                  >
                    Centre d'aide
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/contact')}
                    className="flex-1"
                  >
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-lg font-semibold mb-2">
                Continuez votre parcours de bien-être
              </h3>
              <p className="text-muted-foreground mb-4">
                Même si cette page n'existe pas, votre bien-être émotionnel, lui, est bien réel. 
                Explorez nos outils pour prendre soin de vous.
              </p>
              <Button
                onClick={() => navigate('/scan')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                Commencer un scan émotionnel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
