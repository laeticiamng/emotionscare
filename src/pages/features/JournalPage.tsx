
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import MainLayout from '@/components/layout/MainLayout';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import { BookOpen, Edit3, Calendar, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const JournalPage: React.FC = () => {
  const { userMode } = useUserMode();
  const [entries, setEntries] = React.useState([
    {
      id: 1,
      date: '2024-01-15',
      mood: 'Joyeux',
      title: 'Belle journée au travail',
      preview: 'Aujourd\'hui s\'est très bien passé, j\'ai eu une réunion productive...',
      emotion: 'positive'
    },
    {
      id: 2,
      date: '2024-01-14',
      mood: 'Réfléchi',
      title: 'Méditation matinale',
      preview: 'Ma session de méditation m\'a apporté beaucoup de clarté...',
      emotion: 'neutral'
    }
  ]);

  const moodColors = {
    positive: 'from-emerald-500 to-teal-600',
    neutral: 'from-blue-500 to-indigo-600',
    negative: 'from-orange-500 to-red-600'
  };

  return (
    <MainLayout>
      <div className="space-y-8" data-testid="page-root">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📔 Journal Émotionnel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Suivez votre parcours émotionnel et vos réflexions personnelles
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard className="text-center p-6">
            <Calendar className="h-8 w-8 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">7</h3>
            <p className="text-gray-600 dark:text-gray-300">Jours consécutifs</p>
          </PremiumCard>
          
          <PremiumCard className="text-center p-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">23</h3>
            <p className="text-gray-600 dark:text-gray-300">Entrées totales</p>
          </PremiumCard>
          
          <PremiumCard className="text-center p-6">
            <Heart className="h-8 w-8 mx-auto mb-4 text-pink-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">85%</h3>
            <p className="text-gray-600 dark:text-gray-300">Humeur positive</p>
          </PremiumCard>
        </div>

        {/* New Entry Button */}
        <div className="text-center">
          <PremiumButton variant="primary" className="px-8 py-4">
            <Edit3 className="mr-2 h-5 w-5" />
            Nouvelle entrée
          </PremiumButton>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes dernières réflexions
          </h2>
          
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <PremiumCard className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${moodColors[entry.emotion as keyof typeof moodColors]} text-white text-sm font-medium`}>
                        {entry.mood}
                      </div>
                      <span className="text-gray-500 text-sm">{entry.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {entry.preview}
                    </p>
                  </div>
                  <div className="ml-4">
                    <PremiumButton variant="ghost" size="sm">
                      <BookOpen className="h-4 w-4" />
                    </PremiumButton>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>

        {/* Insights */}
        {userMode && (
          <PremiumCard className="p-8" gradient>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Vos tendances émotionnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-2 text-white">Progression cette semaine</h4>
                <p className="text-white/90 mb-4">
                  Votre bien-être émotionnel s'améliore progressivement
                </p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-2 text-white">Recommandation</h4>
                <p className="text-white/90">
                  Continuez vos séances de méditation matinales, elles ont un impact positif
                </p>
              </div>
            </div>
          </PremiumCard>
        )}
      </div>
    </MainLayout>
  );
};

export default JournalPage;
