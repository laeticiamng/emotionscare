
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const b2cFeatures = [
    "Accès illimité au scan émotionnel",
    "Journal émotionnel personnalisé",
    "Musicothérapie et audio guidé",
    "Coach IA personnalisé",
    "Accès à la réalité virtuelle",
    "Suivi des progrès et statistiques",
    "Exercices de bien-être quotidiens",
    "Support communautaire"
  ];

  const b2bFeatures = [
    "Tableau de bord RH d'analyse d'équipe",
    "Scan émotionnel pour chaque collaborateur",
    "Rapports hebdomadaires par équipe",
    "Alertes préventives sur le stress",
    "Statistiques d'amélioration du bien-être",
    "Espace collaborateur personnalisé",
    "Ressources et formations",
    "Support dédié 24/7"
  ];

  return (
    <Shell>
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Investissez dans votre <span className="text-primary">bien-être émotionnel</span>
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Des solutions adaptées à vos besoins, avec 5 jours d'essai gratuits pour tous nos plans.
          </motion.p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* B2C Plan */}
          <motion.div 
            className="rounded-2xl border bg-card shadow-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold">Particuliers</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">15€</span>
                <span className="ml-1 text-muted-foreground">/mois</span>
              </div>
              <p className="mt-4 text-muted-foreground">
                La solution complète pour votre bien-être émotionnel quotidien
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/b2c/register')} 
                  className="w-full"
                  size="lg"
                >
                  Commencer l'essai gratuit
                </Button>
              </div>
              <p className="mt-3 text-xs text-center text-muted-foreground">
                5 jours d'essai gratuit, sans engagement
              </p>
            </div>
            <div className="p-6 md:p-8 bg-muted/50">
              <h4 className="text-sm font-medium mb-4">Ce qui est inclus :</h4>
              <ul className="space-y-3">
                {b2cFeatures.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* B2B Plan */}
          <motion.div 
            className="rounded-2xl border bg-card shadow-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold">Entreprises</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">10€ HT</span>
                <span className="ml-1 text-muted-foreground">/collaborateur/mois</span>
              </div>
              <p className="mt-4 text-muted-foreground">
                La solution idéale pour le bien-être de vos équipes
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/b2b/selection')} 
                  className="w-full"
                  size="lg"
                >
                  Découvrir nos solutions B2B
                </Button>
              </div>
              <p className="mt-3 text-xs text-center text-muted-foreground">
                5 jours d'essai gratuit, facturation mensuelle
              </p>
            </div>
            <div className="p-6 md:p-8 bg-muted/50">
              <h4 className="text-sm font-medium mb-4">Ce qui est inclus :</h4>
              <ul className="space-y-3">
                {b2bFeatures.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium mb-2">Comment fonctionne l'essai gratuit ?</h3>
              <p className="text-muted-foreground">
                Tous nos plans incluent 5 jours d'essai gratuit. Vous pouvez explorer toutes les fonctionnalités sans engagement. Vous ne serez facturé qu'après la période d'essai si vous décidez de continuer.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-muted-foreground">
                Oui, vous pouvez annuler votre abonnement à tout moment. Vous aurez accès aux fonctionnalités jusqu'à la fin de votre période de facturation.
              </p>
            </div>
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium mb-2">Comment est facturé le plan Entreprise ?</h3>
              <p className="text-muted-foreground">
                Le plan Entreprise est facturé à 10€ HT par collaborateur et par mois. Vous ne payez que pour les utilisateurs actifs, et pouvez ajuster le nombre de licences à tout moment.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à améliorer votre bien-être émotionnel ?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/b2c/register')} 
              size="lg"
              className="px-8"
            >
              Essai gratuit Particulier
            </Button>
            <Button 
              onClick={() => navigate('/b2b/selection')} 
              variant="outline"
              size="lg"
              className="px-8"
            >
              Solutions Entreprise
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Pricing;
