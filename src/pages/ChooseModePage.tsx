
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Particulier',
      description: 'Accès personnel à tous les outils de bien-être émotionnel',
      icon: User,
      features: [
        'Scanner d\'émotions personnel',
        'Coach IA personnalisé',
        'Journal privé avec insights',
        'Musicothérapie adaptée',
        'Suivi de progression individuel'
      ],
      action: () => navigate('/b2c/login'),
      registerAction: () => navigate('/b2c/register'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'b2b',
      title: 'Professionnel',
      description: 'Solutions pour entreprises et organisations',
      icon: Briefcase,
      features: [
        'Outils individuels + équipe',
        'Analytics organisationnelles',
        'Gestion des collaborateurs',
        'Rapports de bien-être collectif',
        'Support administrateur'
      ],
      action: () => navigate('/b2b/selection'),
      registerAction: () => navigate('/b2b/selection'),
      color: 'from-green-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Comment souhaitez-vous utiliser EmotionsCare ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez le mode qui correspond le mieux à vos besoins pour une expérience optimale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mode.color}`} />
                
                <CardHeader className="text-center">
                  <div className={`mx-auto p-4 bg-gradient-to-r ${mode.color} rounded-full w-fit mb-4`}>
                    <mode.icon className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">{mode.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Fonctionnalités incluses :</h3>
                    <ul className="space-y-2">
                      {mode.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mode.color}`} />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={mode.action}
                      className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 transition-opacity`}
                      size="lg"
                    >
                      Se connecter
                    </Button>
                    <Button 
                      onClick={mode.registerAction}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Créer un compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">✨ Nouveau sur EmotionsCare ?</h3>
              <p className="text-muted-foreground mb-4">
                Profitez de 3 jours d'essai gratuit pour découvrir toutes nos fonctionnalités, 
                quel que soit le mode choisi.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span>🔒 Sécurisé</span>
                <span>•</span>
                <span>❌ Sans engagement</span>
                <span>•</span>
                <span>⚡ Activation immédiate</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
