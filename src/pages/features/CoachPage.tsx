
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Brain, Calendar, TrendingUp } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const CoachPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Coach IA Personnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre accompagnateur intelligent pour le bien-être mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PremiumCard>
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-6 text-blue-500" />
              <h3 className="text-2xl font-bold mb-4">Chat avec le Coach</h3>
              <p className="text-muted-foreground mb-6">
                Discutez avec votre coach IA pour obtenir des conseils personnalisés
              </p>
              <PremiumButton variant="primary" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Démarrer la conversation
              </PremiumButton>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="text-center">
              <Brain className="h-16 w-16 mx-auto mb-6 text-purple-500" />
              <h3 className="text-2xl font-bold mb-4">Exercices Guidés</h3>
              <p className="text-muted-foreground mb-6">
                Accédez à des exercices de respiration et de méditation
              </p>
              <PremiumButton variant="secondary" className="w-full">
                <Brain className="mr-2 h-4 w-4" />
                Voir les exercices
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Planning Bien-être</h3>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span>Méditation matinale</span>
                <span className="text-sm text-blue-600">9:00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span>Pause respiration</span>
                <span className="text-sm text-green-600">14:00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span>Réflexion du soir</span>
                <span className="text-sm text-purple-600">20:00</span>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Progrès</h3>
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Séances cette semaine</span>
                <span className="font-bold text-blue-600">5/7</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Temps total</span>
                <span className="font-bold text-green-600">2h 30min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Objectif mensuel</span>
                <span className="font-bold text-purple-600">75%</span>
              </div>
            </div>
          </PremiumCard>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachPage;
