
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Shell from '@/Shell';
import { Building, Users, ChartBar, Calendar } from 'lucide-react';

const BusinessPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/b2b/selection');
  };
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Solutions pour Entreprises</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Améliorez le bien-être émotionnel et la productivité au sein de votre organisation
          </p>
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="mt-8 text-lg px-8 py-6 h-auto"
          >
            Commencer maintenant
          </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
              title: "Bien-être des équipes",
              description: "Améliorer la santé émotionnelle et réduire le burnout"
            },
            {
              icon: <ChartBar className="h-8 w-8 text-green-600 dark:text-green-400" />,
              title: "Analyse des données",
              description: "Visualisez les tendances émotionnelles au sein de votre organisation"
            },
            {
              icon: <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
              title: "Culture d'entreprise",
              description: "Favorisez une culture basée sur l'empathie et le bien-être"
            },
            {
              icon: <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
              title: "Formations",
              description: "Sessions personnalisées sur la gestion des émotions"
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4">{card.icon}</div>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Comment ça fonctionne</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  step: "1",
                  title: "Évaluation",
                  description: "Analyse du climat émotionnel actuel de votre entreprise"
                },
                {
                  step: "2",
                  title: "Implémentation",
                  description: "Déploiement des solutions adaptées à vos besoins spécifiques"
                },
                {
                  step: "3",
                  title: "Suivi",
                  description: "Analyse continue et ajustements pour des résultats optimaux"
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre entreprise ?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez les nombreuses organisations qui ont déjà adopté EmotionsCare
            </p>
            <Button onClick={handleGetStarted} size="lg" className="px-8">
              Contacter un conseiller
            </Button>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default BusinessPage;
