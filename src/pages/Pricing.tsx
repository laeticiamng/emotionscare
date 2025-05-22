
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Stars, Building, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  
  const features = {
    individual: [
      "Journal émotionnel personnel",
      "Thérapie musicale personnalisée",
      "Coach IA personnalisé",
      "Sessions de relaxation audio",
      "Analyse émotionnelle hebdomadaire",
      "Suivi de progression personnelle",
      "Accès à la communauté d'entraide"
    ],
    business: [
      "Accès pour tous les collaborateurs",
      "Tableau de bord analytique pour RH",
      "Rapports de bien-être d'équipe",
      "Support dédié 7j/7",
      "Session de formation mensuelle",
      "Challenges collectifs bien-être",
      "Espace communauté privé entreprise"
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
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Particuliers</CardTitle>
              <CardDescription className="text-center">Pour votre bien-être personnel</CardDescription>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">15€</span>
                <span className="text-muted-foreground"> / mois</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-6 text-center">
                Accédez à toutes nos fonctionnalités personnelles :
              </p>
              <ul className="space-y-2">
                {features.individual.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 py-2 px-3 bg-primary/10 rounded-md text-sm">
                <div className="flex items-center">
                  <Stars className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">5 jours d'essai gratuit</span>
                </div>
                <p className="text-xs mt-1">Annulation possible à tout moment</p>
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
              <div className="flex items-center justify-center mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Building className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Entreprises</CardTitle>
              <CardDescription className="text-center">Pour le bien-être de vos équipes</CardDescription>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">10€</span>
                <span className="text-muted-foreground"> HT / utilisateur / mois</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-6 text-center">
                Une solution complète pour toute votre organisation :
              </p>
              <ul className="space-y-2">
                {features.business.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 py-2 px-3 bg-primary/10 rounded-md text-sm">
                <div className="flex items-center">
                  <Stars className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">5 jours d'essai gratuit</span>
                </div>
                <p className="text-xs mt-1">Tarifs dégressifs selon le nombre d'utilisateurs</p>
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
      
      {/* Fonctionnalités en détail */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Fonctionnalités détaillées</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-xl font-medium flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Journal émotionnel
            </h3>
            <p className="text-muted-foreground">
              Suivez vos émotions au quotidien, identifiez les facteurs déclencheurs et visualisez 
              vos progrès dans le temps grâce à des graphiques intuitifs.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-xl font-medium flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Dashboard analytique RH
            </h3>
            <p className="text-muted-foreground">
              Visualisez les tendances de bien-être au sein de vos équipes tout en 
              respectant la confidentialité des données individuelles.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-xl font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Confidentialité garantie
            </h3>
            <p className="text-muted-foreground">
              Vos données émotionnelles restent strictement confidentielles. Les entreprises n'ont 
              accès qu'à des données anonymisées et agrégées.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-xl font-medium flex items-center">
              <Stars className="h-5 w-5 mr-2 text-primary" />
              Support premium
            </h3>
            <p className="text-muted-foreground">
              Un accompagnement personnalisé pour les utilisateurs et un support dédié 
              pour les administrateurs d'entreprise.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-muted/50 rounded-lg p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Des questions ?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Notre équipe est disponible pour vous aider à choisir la formule la plus adaptée à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/support')}>
              Contactez-nous
            </Button>
            <Button onClick={() => navigate('/b2c/register')}>
              Commencer l'essai gratuit
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
