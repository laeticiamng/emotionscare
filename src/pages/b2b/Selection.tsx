
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Building, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Solutions Entreprise</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EmotionsCare propose des solutions adaptées aux besoins spécifiques de votre organisation pour favoriser le bien-être au travail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full flex flex-col border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl text-center">Collaborateur</CardTitle>
                  <CardDescription className="text-center">
                    Accès à l'espace entreprise EmotionsCare
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-center mb-6">
                    Bénéficiez de toutes les fonctionnalités d'EmotionsCare dans le cadre de votre entreprise.
                  </p>
                  
                  <ul className="space-y-3">
                    {[
                      "Suivi émotionnel personnalisé",
                      "Accès aux contenus bien-être",
                      "Participation aux challenges collectifs",
                      "Journal émotionnel professionnel",
                      "Musique et sons adaptés au travail"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-blue-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/b2b/user/login')}
                  >
                    Accéder à mon espace
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full flex flex-col border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl text-center">Administrateur</CardTitle>
                  <CardDescription className="text-center">
                    Gestion de la solution au sein de votre entreprise
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <p className="text-center mb-6">
                    Gérez et optimisez l'utilisation d'EmotionsCare pour votre organisation.
                  </p>
                  
                  <ul className="space-y-3">
                    {[
                      "Tableau de bord analytique RH",
                      "Rapports de bien-être d'équipe",
                      "Gestion des utilisateurs",
                      "Configuration des fonctionnalités",
                      "Organisation d'activités collectives"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-purple-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/b2b/admin/login')}
                    variant="default"
                  >
                    Accéder au dashboard
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Vous n'avez pas encore de compte entreprise ?</h2>
            <p className="text-lg mb-6">
              Découvrez notre offre complète avec un essai gratuit de 5 jours, sans engagement.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/pricing')}
              variant="outline"
            >
              Voir nos tarifs et demander une démo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelection;
