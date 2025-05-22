
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const personalFeatures = [
    "Coach émotionnel IA illimité",
    "Journal émotionnel personnalisé",
    "Musicothérapie adaptative",
    "Exercices audio guidés",
    "Analyse émotionnelle approfondie",
    "Suivi des progrès",
    "Support par email",
    "5 jours d'essai gratuit"
  ];
  
  const businessFeatures = [
    "Toutes les fonctionnalités Particulier",
    "Tableau de bord analytique d'équipe",
    "Ateliers collectifs mensuels",
    "Accès à des spécialistes qualifiés",
    "Rapports de bien-être anonymisés",
    "Coaching en leadership",
    "Support dédié",
    "5 jours d'essai gratuit"
  ];
  
  const enterpriseFeatures = [
    "Toutes les fonctionnalités Business",
    "Intégration personnalisée",
    "Formations sur mesure",
    "Accompagnement stratégique",
    "API dédiée",
    "Assistance premium 24/7",
    "Gestionnaire de compte dédié"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Des tarifs simples pour prendre soin de vous
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choisissez l'offre qui correspond à vos besoins, avec 5 jours d'essai gratuit pour découvrir tous les bénéfices.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Offre Particulier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Particulier</CardTitle>
                <CardDescription>Pour votre bien-être personnel</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">15€</span>
                  <span className="ml-1 text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {personalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group" 
                  onClick={() => navigate(isAuthenticated ? '/b2c/dashboard' : '/b2c/register')}
                >
                  <span>{isAuthenticated ? 'Accéder à mon espace' : 'Commencer l\'essai gratuit'}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Offre Entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col border-primary">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Populaire
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Entreprise</CardTitle>
                <CardDescription>Pour les équipes et collaborateurs</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">10€</span>
                  <span className="ml-1 text-muted-foreground">/utilisateur/mois HT</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {businessFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group" 
                  variant="default"
                  onClick={() => navigate('/b2b/selection')}
                >
                  <span>Démarrer avec votre équipe</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Offre Personnalisée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full flex flex-col bg-muted/50">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>Solutions sur mesure pour grandes organisations</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">Sur mesure</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {enterpriseFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group" 
                  variant="outline"
                  onClick={() => navigate('/support')}
                >
                  <span>Contactez-nous</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Des questions ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Notre équipe est disponible pour répondre à toutes vos questions et vous aider à choisir l'offre qui vous convient le mieux.
          </p>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/support')}
          >
            Contactez-nous
          </Button>
        </motion.div>
        
        <motion.div 
          className="mt-20 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>Les prix sont affichés en euros. TVA applicable en sus pour les offres Entreprise.</p>
          <p className="mt-1">
            Essai gratuit de 5 jours sans engagement. Annulation possible à tout moment.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
