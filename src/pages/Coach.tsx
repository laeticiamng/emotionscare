
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Brain, Heart, Target } from 'lucide-react';

const Coach: React.FC = () => {
  const coachFeatures = [
    {
      title: 'Accompagnement personnalisé',
      description: 'Un coach IA qui s\'adapte à vos besoins',
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      title: 'Écoute empathique',
      description: 'Une présence bienveillante disponible 24h/7j',
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Objectifs sur-mesure',
      description: 'Des plans d\'action adaptés à votre rythme',
      icon: Target,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <MessageSquare className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Coach IA</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Votre accompagnateur personnel pour un bien-être durable
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {coachFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
          >
            <Card className="h-full text-center">
              <CardHeader>
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Commencez votre conversation</CardTitle>
            <CardDescription className="text-center">
              Votre coach IA est prêt à vous accompagner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Interface de chat en cours de développement
                </p>
                <Button>
                  Démarrer une conversation
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Confidentiel</span><br />
                <span className="text-blue-600 dark:text-blue-400">Vos conversations restent privées</span>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <span className="font-semibold text-green-700 dark:text-green-300">Disponible 24h/7j</span><br />
                <span className="text-green-600 dark:text-green-400">Assistance continue</span>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <span className="font-semibold text-purple-700 dark:text-purple-300">Personnalisé</span><br />
                <span className="text-purple-600 dark:text-purple-400">S'adapte à vos besoins</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Coach;
