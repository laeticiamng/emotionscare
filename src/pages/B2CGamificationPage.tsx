import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Flame, Gift, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const B2CGamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'rewards' | 'leaderboard'>('achievements');
  const [streak, setStreak] = useState(7);
  const [level, setLevel] = useState(12);
  const [experience, setExperience] = useState(2340);
  const [nextLevelXp, setNextLevelXp] = useState(3000);

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Première Lueur',
      icon: '✨',
      description: 'Complète ta première séance',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Gardien de la Flamme',
      icon: '🔥',
      description: 'Maintiens une série de 7 jours',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Maître Zen',
      icon: '🧘',
      description: 'Complète 50 séances de méditation',
      progress: 32,
      maxProgress: 50,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Légende Émotionnelle',
      icon: '👑',
      description: 'Atteins le niveau 25',
      progress: 12,
      maxProgress: 25,
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const progressPercentage = (experience / nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Progression</h1>
        <div className="w-9" />
      </div>

      {/* Stats Header */}
      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Level & Progress */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold">Niveau {level}</h2>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3 mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600">{experience} / {nextLevelXp} XP</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-xl font-bold">{streak}</div>
              <div className="text-xs text-gray-600">jours de série</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-xs text-gray-600">succès obtenus</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-xl font-bold">{experience}</div>
              <div className="text-xs text-gray-600">points XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex bg-white/50 rounded-2xl p-1">
          {[
            { key: 'achievements', label: 'Succès', icon: Star },
            { key: 'rewards', label: 'Récompenses', icon: Gift },
            { key: 'leaderboard', label: 'Classement', icon: Trophy }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                selectedTab === key 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        <AnimatePresence mode="wait">
          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 ${getRarityBorder(achievement.rarity)} ${
                    achievement.unlocked ? 'shadow-lg' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-2xl shadow-lg ${
                      !achievement.unlocked ? 'grayscale' : ''
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        {achievement.unlocked && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progression</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Gift className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Récompenses à venir</h3>
              <p className="text-gray-600">Bientôt disponible !</p>
            </motion.div>
          )}

          {selectedTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Classement</h3>
              <p className="text-gray-600">Bientôt disponible !</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default B2CGamificationPage;