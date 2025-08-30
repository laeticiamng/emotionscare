import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, Heart, Brain, Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityData {
  date: string;
  sessions: number;
  duration: number;
  mood: number;
  energy: number;
}

const B2CActivitePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [animateStats, setAnimateStats] = useState(false);

  const weekData: ActivityData[] = [
    { date: 'Lun', sessions: 2, duration: 25, mood: 8, energy: 7 },
    { date: 'Mar', sessions: 1, duration: 15, mood: 6, energy: 6 },
    { date: 'Mer', sessions: 3, duration: 40, mood: 9, energy: 8 },
    { date: 'Jeu', sessions: 2, duration: 30, mood: 7, energy: 7 },
    { date: 'Ven', sessions: 1, duration: 20, mood: 8, energy: 8 },
    { date: 'Sam', sessions: 4, duration: 50, mood: 9, energy: 9 },
    { date: 'Dim', sessions: 2, duration: 35, mood: 8, energy: 8 }
  ];

  const totalSessions = weekData.reduce((sum, day) => sum + day.sessions, 0);
  const totalDuration = weekData.reduce((sum, day) => sum + day.duration, 0);
  const avgMood = weekData.reduce((sum, day) => sum + day.mood, 0) / weekData.length;
  const avgEnergy = weekData.reduce((sum, day) => sum + day.energy, 0) / weekData.length;

  const maxSessions = Math.max(...weekData.map(d => d.sessions));

  useEffect(() => {
    setTimeout(() => setAnimateStats(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Activité</h1>
        <div className="w-9" />
      </div>

      {/* Period Selector */}
      <div className="p-4">
        <div className="flex bg-white/50 rounded-2xl p-1">
          {[
            { key: 'week', label: '7 jours' },
            { key: 'month', label: '30 jours' },
            { key: 'year', label: 'Année' }
          ].map(({ key, label }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPeriod(key as any)}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-200 ${
                selectedPeriod === key 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateStats ? 1 : 0, y: animateStats ? 0 : 20 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Séances</h3>
                <p className="text-xs text-gray-600">Cette semaine</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateStats ? 1 : 0, y: animateStats ? 0 : 20 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Durée</h3>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{totalDuration}min</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateStats ? 1 : 0, y: animateStats ? 0 : 20 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Humeur</h3>
                <p className="text-xs text-gray-600">Moyenne</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{avgMood.toFixed(1)}/10</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateStats ? 1 : 0, y: animateStats ? 0 : 20 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Énergie</h3>
                <p className="text-xs text-gray-600">Moyenne</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{avgEnergy.toFixed(1)}/10</div>
          </motion.div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="px-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Activité quotidienne</h3>
          </div>
          
          <div className="space-y-4">
            {weekData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 text-sm text-gray-600 font-medium">{day.date}</div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.sessions / maxSessions) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    />
                  </div>
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <span className="text-xs font-medium text-gray-700">{day.sessions}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-gray-600">{day.mood}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-600">{day.energy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Insights</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Votre humeur s'améliore les jours où vous faites plus de séances</li>
            <li>• Les week-ends sont vos journées les plus actives</li>
            <li>• Votre niveau d'énergie reste stable tout au long de la semaine</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CActivitePage;