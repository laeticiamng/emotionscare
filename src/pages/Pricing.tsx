
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  
  const features = {
    individual: [
      "Journal émotionnel personnel",
      "Thérapie musicale",
      "Coach IA personnalisé",
      "Sessions de relaxation audio",
      "Analyse émotionnelle hebdomadaire"
    ],
    business: [
      "Accès pour tous les collaborateurs",
      "Dashboard analytique pour RH",
      "Rapports de bien-être d'équipe",
      "Support dédié",
      "Session de formation mensuelle"
    ]
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nos offres
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Choisissez la formule qui correspond le mieux à vos besoins en matière de bien-être émotionnel
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Particuliers</CardTitle>
              <CardDescription>Pour votre bien-être personnel</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">15€</span>
                <span className="text-muted-foreground"> / mois</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-6">
                Accédez à toutes nos fonctionnalités personnelles :
              </p>
              <ul className="space-y-2">
                {features.individual.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 h-5 w-5 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 py-2 px-3 bg-muted/50 rounded-md text-sm">
                <span className="font-medium">5 jours d'essai gratuit</span> - Annulation possible à tout moment
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate('/b2c/register')}
              >
                Essayer gratuitement
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full flex flex-col border-primary/50">
            <CardHeader>
              <CardTitle className="text-2xl">Entreprises</CardTitle>
              <CardDescription>Pour le bien-être de vos équipes</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">10€</span>
                <span className="text-muted-foreground"> HT / utilisateur / mois</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-6">
                Une solution complète pour toute votre organisation :
              </p>
              <ul className="space-y-2">
                {features.business.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 h-5 w-5 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 py-2 px-3 bg-primary/10 rounded-md text-sm">
                <span className="font-medium">5 jours d'essai gratuit</span> - Tarifs dégressifs selon le nombre d'utilisateurs
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate('/b2b/selection')}
              >
                Demander une démonstration
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Des questions ?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Notre équipe est disponible pour vous aider à choisir la formule la plus adaptée à vos besoins.
        </p>
        <Button variant="outline" onClick={() => navigate('/support')}>
          Contactez-nous
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
