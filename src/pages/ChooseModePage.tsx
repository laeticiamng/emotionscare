
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, ArrowRight, Heart, Users, BarChart3, CheckCircle } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else {
      navigate('/b2b/selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-12"
        >
          <Badge variant="outline" className="mx-auto">
            <Heart className="h-3 w-3 mr-1" />
            Choisissez votre expérience EmotionsCare
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Comment souhaitez-vous
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}utiliser EmotionsCare ?
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sélectionnez le mode qui correspond le mieux à vos besoins. 
            Vous pourrez toujours changer par la suite.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* B2C Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Usage Personnel</CardTitle>
                <CardDescription className="text-lg">
                  Pour votre bien-être individuel et votre développement personnel
                </CardDescription>
                <Badge className="mx-auto w-fit">
                  3 jours d'essai gratuit
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Scanner émotionnel personnel avec IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Coach virtuel personnalisé 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Journal intime intelligent et sécurisé</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Musique thérapie adaptative</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Suivi de progression personnel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Confidentialité totale garantie</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    🎯 Idéal pour : Gestion du stress, amélioration du bien-être, 
                    développement personnel, accompagnement émotionnel quotidien
                  </p>
                </div>

                <Button 
                  onClick={() => handleModeSelection('b2c')} 
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  Commencer mon parcours personnel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  ✨ Accès immédiat • Sans engagement • Données privées
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* B2B Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Usage Professionnel</CardTitle>
                <CardDescription className="text-lg">
                  Pour les entreprises, organisations et équipes
                </CardDescription>
                <Badge variant="secondary" className="mx-auto w-fit">
                  Solution complète
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span>Gestion multi-utilisateurs avancée</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span>Analytics et rapports d'équipe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Dashboard administrateur complet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Toutes les fonctionnalités B2C incluses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Support prioritaire et formation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Conformité RGPD et sécurité renforcée</span>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    🏢 Idéal pour : RH, managers, dirigeants, consultants, 
                    organisations soucieuses du bien-être de leurs équipes
                  </p>
                </div>

                <Button 
                  onClick={() => handleModeSelection('b2b')} 
                  variant="outline"
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  Explorer les solutions entreprise
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  📞 Démo personnalisée • Tarifs sur mesure • Intégration complète
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            💡 Besoin d'aide pour choisir ? Nos équipes sont là pour vous accompagner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Retour à l'accueil
            </Button>
            <Button variant="outline">
              📞 Nous contacter
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
