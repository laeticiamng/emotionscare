
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import MainLayout from '@/components/layout/MainLayout';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import { Music, Play, Pause, SkipForward, Volume2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const { userMode } = useUserMode();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrack, setCurrentTrack] = React.useState('Musique Relaxante - Océan');

  const musicCategories = [
    {
      title: 'Relaxation',
      description: 'Musiques apaisantes pour la détente',
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      tracks: ['Océan Calme', 'Forêt Mystique', 'Pluie Douce']
    },
    {
      title: 'Focus',
      description: 'Sons pour améliorer la concentration',
      gradient: 'from-green-500 via-teal-600 to-cyan-700',
      tracks: ['Bruit Blanc', 'Café Ambiant', 'Nature Zen']
    },
    {
      title: 'Énergie',
      description: 'Musiques motivantes et dynamisantes',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      tracks: ['Rythmes Positifs', 'Motivation', 'Énergie Pure']
    }
  ];

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
              🎵 Musique Thérapeutique
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez des musiques personnalisées pour votre bien-être émotionnel
            </p>
          </motion.div>
        </div>

        {/* Current Player */}
        <PremiumCard className="p-8" gradient>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-full">
                <Music className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{currentTrack}</h3>
                <p className="text-white/80">Relaxation • 3:45</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PremiumButton variant="ghost" className="p-3">
                <Heart className="h-5 w-5" />
              </PremiumButton>
              <PremiumButton 
                variant="ghost" 
                className="p-4"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </PremiumButton>
              <PremiumButton variant="ghost" className="p-3">
                <SkipForward className="h-5 w-5" />
              </PremiumButton>
              <PremiumButton variant="ghost" className="p-3">
                <Volume2 className="h-5 w-5" />
              </PremiumButton>
            </div>
          </div>
        </PremiumCard>

        {/* Music Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <PremiumCard className={`h-full bg-gradient-to-br ${category.gradient} text-white`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                  <p className="text-white/90 mb-6">{category.description}</p>
                  <div className="space-y-2 mb-6">
                    {category.tracks.map((track) => (
                      <div 
                        key={track}
                        className="p-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors cursor-pointer"
                        onClick={() => setCurrentTrack(track)}
                      >
                        {track}
                      </div>
                    ))}
                  </div>
                  <PremiumButton variant="ghost" className="w-full">
                    Écouter la playlist
                  </PremiumButton>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        {userMode && (
          <PremiumCard className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Recommandations personnalisées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <h4 className="font-semibold text-lg mb-2">Pour votre humeur actuelle</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Basé sur votre dernière analyse émotionnelle
                </p>
                <PremiumButton variant="primary" size="sm">
                  Découvrir
                </PremiumButton>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                <h4 className="font-semibold text-lg mb-2">Moment de la journée</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Playlist adaptée à votre emploi du temps
                </p>
                <PremiumButton variant="secondary" size="sm">
                  Explorer
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        )}
      </div>
    </MainLayout>
  );
};

export default MusicPage;
