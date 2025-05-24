
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, ArrowLeft, Heart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Particulier',
      description: 'Accès personnel à toutes les fonctionnalités de bien-être émotionnel',
      icon: User,
      color: 'from-blue-500 to-purple-600',
      features: [
        'Scanner d\'émotions personnel',
        'Coach IA adaptatif',
        'Musique thérapeutique',
        'Journal privé',
        'Suivi de progression',
        '3 jours d\'essai gratuit'
      ],
      action: () => navigate('/b2c/login'),
      registerAction: () => navigate('/b2c/register')
    },
    {
      id: 'b2b',
      title: 'Professionnel',
      description: 'Solutions dédiées aux entreprises et organisations',
      icon: Building2,
      color: 'from-green-500 to-teal-600',
      features: [
        'Gestion d\'équipes',
        'Analytics avancées',
        'Tableau de bord admin',
        'Rapports de bien-être',
        'Alertes automatiques',
        'Support prioritaire'
      ],
      action: () => navigate('/b2b/selection'),
      registerAction: () => navigate('/b2b/selection')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold">EmotionsCare</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Choisissez votre mode d'utilisation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez l'option qui correspond le mieux à vos besoins pour commencer votre parcours de bien-être émotionnel
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center mx-auto mb-4`}>
                    <mode.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{mode.title}</CardTitle>
                  <CardDescription className="text-base">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={mode.action} 
                      className="w-full"
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

                  {/* Trial Badge */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      3 jours d'essai gratuit
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold">Sécurisé</h3>
              <p className="text-sm text-muted-foreground text-center">
                Vos données sont protégées avec les plus hauts standards de sécurité
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold">Instantané</h3>
              <p className="text-sm text-muted-foreground text-center">
                Commencez immédiatement, aucune configuration complexe requise
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold">Personnalisé</h3>
              <p className="text-sm text-muted-foreground text-center">
                Une expérience adaptée à vos besoins et objectifs spécifiques
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
