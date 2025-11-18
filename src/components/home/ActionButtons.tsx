import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, Music, BookOpen, Users, Settings, Headphones, Trophy, Bell } from 'lucide-react';
import MiniMusicPlayer from './MiniMusicPlayer';
import PremiumButton from '@/components/ui/PremiumButton';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Scanner Émotionnel",
      description: "Analysez vos émotions",
      path: "/scan",
      gradient: "from-blue-500 via-blue-600 to-indigo-700"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Musicothérapie",
      description: "Musique adaptative",
      path: "/music",
      gradient: "from-purple-500 via-purple-600 to-pink-700",
      isMusic: true
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Journal",
      description: "Suivez votre progression",
      path: "/journal",
      gradient: "from-green-500 via-emerald-600 to-teal-700"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Coach IA",
      description: "Accompagnement personnalisé",
      path: "/coach",
      gradient: "from-red-500 via-pink-600 to-rose-700"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Réalité Virtuelle",
      description: "Expériences immersives",
      path: "/vr",
      gradient: "from-indigo-500 via-purple-600 to-violet-700"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communauté",
      description: "Partagez avec d'autres",
      path: "/community",
      gradient: "from-orange-500 via-amber-600 to-yellow-700"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Récompenses",
      description: "Badges et progression",
      path: "/gamification",
      gradient: "from-yellow-500 via-orange-600 to-red-700"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Notifications",
      description: "Système de notifications",
      path: "/notifications",
      gradient: "from-cyan-500 via-sky-600 to-blue-700"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Paramètres",
      description: "Personnalisez votre expérience",
      path: "/settings",
      gradient: "from-gray-500 via-slate-600 to-gray-700"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="group premium-card backdrop-blur-xl overflow-hidden"
        >
          {action.isMusic ? (
            <div className={`h-auto bg-gradient-to-br ${action.gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden group-hover:shadow-premium-hover transition-all duration-500`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center space-y-4 flex-col mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl mb-2">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
                <MiniMusicPlayer />
              </div>
            </div>
          ) : (
            <div 
              className={`premium-card-content bg-gradient-to-br ${action.gradient} text-white p-8 h-40 flex flex-col items-center justify-center space-y-4 cursor-pointer relative overflow-hidden group-hover:shadow-premium-hover transition-all duration-500`}
              onClick={() => navigate(action.path)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  {action.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-xl mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ActionButtons;
