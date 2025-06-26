
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowRight, Users, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Espace Personnel',
      subtitle: 'Pour les particuliers',
      description: 'Accédez à votre espace personnel pour gérer votre bien-être émotionnel au quotidien.',
      icon: Heart,
      color: 'from-pink-500 to-purple-600',
      features: [
        'Scan émotionnel personnalisé',
        'Coach IA personnel',
        'Musicothérapie adaptative',
        'Journal émotionnel privé',
        'Suivi de progression individuel'
      ],
      action: () => navigate('/b2c/login'),
      popular: true
    },
    {
      id: 'b2b',
      title: 'Espace Entreprise',
      subtitle: 'Pour les organisations',
      description: 'Solutions complètes pour le bien-être émotionnel de vos équipes et collaborateurs.',
      icon: Building2,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Analytics équipe en temps réel',
        'Gestion RH intégrée',
        'Rapports détaillés',
        'Administration centralisée',
        'Support dédié entreprise'
      ],
      action: () => navigate('/b2b/selection')
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choisissez votre espace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            EmotionsCare s'adapte à vos besoins. Sélectionnez l'espace qui vous correspond 
            pour commencer votre parcours de bien-être émotionnel.
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {modes.map((mode, index) => {
            const IconComponent = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {mode.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Populaire
                    </span>
                  </div>
                )}
                
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 hover:border-opacity-50"
                      onClick={mode.action}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 rounded-lg`} />
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{mode.title}</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-600">
                      {mode.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 text-center">
                      {mode.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Fonctionnalités incluses :</h4>
                      <ul className="space-y-2">
                        {mode.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="h-2 w-2 bg-gray-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-br ${mode.color} hover:opacity-90 text-white py-3`}
                      onClick={(e) => {
                        e.stopPropagation();
                        mode.action();
                      }}
                    >
                      Accéder à {mode.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Sécurisé</h3>
              <p className="text-sm text-gray-600 text-center">
                Vos données sont protégées selon les standards RGPD
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Communauté</h3>
              <p className="text-sm text-gray-600 text-center">
                Rejoignez une communauté bienveillante
              </p>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Suivi</h3>
              <p className="text-sm text-gray-600 text-center">
                Visualisez vos progrès en temps réel
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-gray-500 mb-4">Besoin d'aide pour choisir ?</p>
            <Button variant="outline" onClick={() => navigate('/help-center')}>
              Contactez notre équipe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
