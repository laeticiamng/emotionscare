// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Calendar, Filter, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeatmapData {
  hour: number;
  day: string;
  intensity: number;
  mood: string;
  count: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  currentMood: string;
  weeklyScore: number;
}

const B2CHeatmapVibesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'team' | 'individual'>('team');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [animateHeatmap, setAnimateHeatmap] = useState(false);

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Sarah L.', avatar: '🌟', lastActive: 'Il y a 2h', currentMood: 'énergique', weeklyScore: 8.5 },
    { id: '2', name: 'Marc D.', avatar: '🎯', lastActive: 'Il y a 1h', currentMood: 'concentré', weeklyScore: 7.8 },
    { id: '3', name: 'Lisa K.', avatar: '🌸', lastActive: 'Il y a 30min', currentMood: 'serein', weeklyScore: 9.1 },
    { id: '4', name: 'Alex R.', avatar: '⚡', lastActive: 'Il y a 4h', currentMood: 'motivé', weeklyScore: 8.2 }
  ];

  // Génération de données simulées pour la heatmap
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    days.forEach((day, dayIndex) => {
      hours.forEach((hour) => {
        const intensity = Math.random() * 100;
        const moods = ['énergique', 'serein', 'concentré', 'créatif', 'motivé'];
        data.push({
          hour,
          day,
          intensity,
          mood: moods[Math.floor(Math.random() * moods.length)],
          count: Math.floor(Math.random() * 20) + 1
        });
      });
    });
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity: number) => {
    if (intensity < 20) return 'bg-info/20';
    if (intensity < 40) return 'bg-info/40';
    if (intensity < 60) return 'bg-info/60';
    if (intensity < 80) return 'bg-info/80';
    return 'bg-info';
  };

  const moods = [
    { name: 'all', emoji: '🌈', label: 'Toutes' },
    { name: 'énergique', emoji: '⚡', label: 'Énergique' },
    { name: 'serein', emoji: '🧘', label: 'Serein' },
    { name: 'concentré', emoji: '🎯', label: 'Concentré' },
    { name: 'créatif', emoji: '🎨', label: 'Créatif' }
  ];

  useEffect(() => {
    setTimeout(() => setAnimateHeatmap(true), 500);
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Heatmap Vibes</h1>
        <div className="w-9" />
      </div>

      {/* View Toggle */}
      <div className="p-4">
        <div className="flex bg-white/50 rounded-2xl p-1">
          {[
            { key: 'team', label: 'Équipe', icon: Users },
            { key: 'individual', label: 'Personnel', icon: BarChart3 }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedView(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                selectedView === key 
                  ? 'bg-background shadow-sm text-info' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mood Filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {moods.map((mood) => (
            <motion.button
              key={mood.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                selectedMood === mood.name
                  ? 'bg-info text-primary-foreground'
                  : 'bg-card/70 text-foreground hover:bg-card/90'
              }`}
            >
              <span>{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedView === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Team Overview */}
            <div className="px-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-info" />
                  <h3 className="font-semibold">État de l'équipe</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">4/4</div>
                    <div className="text-sm text-gray-600">Membres actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">8.4</div>
                    <div className="text-sm text-gray-600">Score moyen</div>
                  </div>
                </div>
                
                {/* Team Members */}
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-info to-accent rounded-full flex items-center justify-center text-lg">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.lastActive}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-info">{member.currentMood}</div>
                        <div className="text-xs text-gray-500">{member.weeklyScore}/10</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'individual' && (
          <motion.div
            key="individual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Heatmap */}
            <div className="px-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-info" />
                  <h3 className="font-semibold">Votre activité cette semaine</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Hours header */}
                    <div className="flex mb-2">
                      <div className="w-12"></div>
                      {[6, 9, 12, 15, 18, 21].map((hour) => (
                        <div key={hour} className="flex-1 text-center text-xs text-gray-500 min-w-[30px]">
                          {hour}h
                        </div>
                      ))}
                    </div>
                    
                    {/* Days with data */}
                    {days.map((day, dayIndex) => (
                      <div key={day} className="flex items-center mb-1">
                        <div className="w-12 text-xs text-gray-600 font-medium">{day}</div>
                        <div className="flex-1 flex gap-1">
                          {hours.filter(h => h >= 6 && h <= 23 && h % 3 === 0).map((hour) => {
                            const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                            const intensity = dataPoint?.intensity || 0;
                            return (
                              <motion.div
                                key={`${day}-${hour}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: animateHeatmap ? 1 : 0 }}
                                transition={{ delay: (dayIndex * 6 + hour / 3) * 0.05 }}
                                className={`aspect-square rounded-sm ${getIntensityColor(intensity)} min-w-[24px] min-h-[24px] cursor-pointer hover:scale-110 transition-transform`}
                                title={`${day} ${hour}h - Intensité: ${intensity.toFixed(0)}%`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                  <span>Moins actif</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className={`w-3 h-3 rounded-sm ${getIntensityColor(level * 20)}`} />
                    ))}
                  </div>
                  <span>Plus actif</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-info/10 to-accent/10 rounded-2xl p-6 border border-info/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-info" />
            <h3 className="font-semibold text-info">Insights</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Pic d'activité entre 9h et 12h</li>
            <li>• Meilleure humeur les mercredi et vendredi</li>
            <li>• L'équipe est plus créative en fin de semaine</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CHeatmapVibesPage;