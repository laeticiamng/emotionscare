
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Building2, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star
} from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Espace Personnel',
      subtitle: 'Pour les particuliers',
      description: 'Accès complet à votre coach IA personnel, scan émotionnel, musicothérapie et suivi personnalisé.',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      features: [
        'Coach IA personnalisé',
        'Scan émotionnel avancé',
        'Musicothérapie adaptative',
        'Journal personnel',
        'Suivi de progression',
        'Communauté bienveillante'
      ],
      route: '/b2c/login',
      popular: true
    },
    {
      id: 'b2b',
      title: 'Espace Entreprise',
      subtitle: 'Pour les organisations',
      description: 'Solution complète pour améliorer le bien-être émotionnel de vos collaborateurs avec des outils d\'administration avancés.',
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Tableau de bord administrateur',
        'Gestion des collaborateurs',
        'Analytics d\'équipe',
        'Rapports détaillés',
        'Support premium',
        'Intégration système'
      ],
      route: '/b2b/selection',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choisissez votre
            </span>
            <br />
            <span className="text-slate-800 dark:text-slate-100">expérience EmotionsCare</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Sélectionnez l'espace qui correspond le mieux à vos besoins pour commencer votre parcours de bien-être émotionnel.
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
                {mode.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Populaire
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <mode.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {mode.title}
                  </CardTitle>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {mode.subtitle}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {mode.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Fonctionnalités incluses :
                    </h4>
                    <ul className="space-y-2">
                      {mode.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button
                    size="lg"
                    onClick={() => navigate(mode.route)}
                    className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    Accéder à {mode.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Notre équipe est là pour vous accompagner dans le choix de l'espace le plus adapté à vos besoins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                  Contacter un conseiller
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="hover:bg-white/10"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
