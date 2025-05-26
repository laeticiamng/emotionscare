
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Building2, Users, Brain, Sparkles } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Espace Personnel',
      description: 'Votre sanctuaire de bien-être émotionnel personnel',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      features: ['Journal privé', 'Scan émotionnel', 'Coach IA personnel', 'Musicothérapie'],
      action: () => navigate('/b2c/login')
    },
    {
      id: 'b2b',
      title: 'Espace Entreprise',
      description: 'Solutions de bien-être pour votre organisation',
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      features: ['Dashboard équipe', 'Analyses collectives', 'Gestion des collaborateurs', 'Rapports RH'],
      action: () => navigate('/b2b/selection')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-pink-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choisissez votre espace de bien-être émotionnel
          </p>
        </motion.div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <mode.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {mode.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {mode.description}
                  </p>
                  
                  <ul className="space-y-2 mb-8">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={mode.action}
                    className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-lg transition-all group-hover:scale-105`}
                    size="lg"
                  >
                    Accéder à {mode.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
