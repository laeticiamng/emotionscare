
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Home, 
  LogIn, 
  UserPlus, 
  HelpCircle, 
  ArrowLeft,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const authOptions = [
    {
      title: "Se connecter",
      description: "J'ai déjà un compte",
      icon: LogIn,
      action: () => navigate('/auth'),
      variant: "default" as const,
      color: "bg-blue-500"
    },
    {
      title: "Créer un compte",
      description: "Je suis nouveau sur EmotionsCare",
      icon: UserPlus,
      action: () => navigate('/auth'),
      variant: "outline" as const,
      color: "bg-green-500"
    },
    {
      title: "Mode Entreprise",
      description: "Accès professionnel B2B",
      icon: Shield,
      action: () => navigate('/b2b/selection'),
      variant: "outline" as const,
      color: "bg-purple-500"
    }
  ];

  const helpOptions = [
    {
      title: "Mot de passe oublié",
      description: "Récupérer l'accès à votre compte",
      path: "/reset-password"
    },
    {
      title: "Centre d'aide",
      description: "FAQ et guides d'utilisation",
      path: "/help"
    },
    {
      title: "Contact support",
      description: "Obtenir de l'aide personnalisée",
      path: "/contact"
    }
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
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                <Lock className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cette page nécessite une authentification pour être consultée. 
              Veuillez vous connecter ou créer un compte pour continuer votre parcours de bien-être.
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
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Accueil
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
                  <Key className="h-5 w-5" />
                  Options d'Authentification
                </CardTitle>
                <CardDescription>
                  Choisissez votre mode de connexion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={option.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-lg border hover:border-primary/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${option.color} text-white`}>
                        <option.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{option.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
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
                  <HelpCircle className="h-5 w-5" />
                  Besoin d'aide ?
                </CardTitle>
                <CardDescription>
                  Ressources pour résoudre vos problèmes d'accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {helpOptions.map((help, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(help.path)}
                    className="w-full p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="font-medium text-sm">{help.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {help.description}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6 border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  Information Importante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-amber-700">
                  <p>
                    <strong>Sécurité :</strong> Vos données émotionnelles sont sensibles et protégées.
                  </p>
                  <p>
                    <strong>Confidentialité :</strong> Seuls les utilisateurs authentifiés peuvent accéder à leurs données personnelles.
                  </p>
                  <p>
                    <strong>RGPD :</strong> Conformité totale avec la réglementation européenne sur la protection des données.
                  </p>
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
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-lg font-semibold mb-2">
                Rejoignez la communauté EmotionsCare
              </h3>
              <p className="text-muted-foreground mb-6">
                Découvrez un espace sécurisé pour prendre soin de votre bien-être émotionnel. 
                Plus de 10,000 utilisateurs nous font déjà confiance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  Créer mon compte gratuit
                </Button>
                <Button
                  onClick={() => navigate('/about')}
                  variant="outline"
                >
                  En savoir plus
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
