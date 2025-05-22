
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Music, Headphones, MessageCircle, LineChart, Medal, Glasses, Heart } from 'lucide-react';

interface QuickAccessItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
  description?: string;
}

const QuickAccessMenu: React.FC = () => {
  const navigate = useNavigate();

  const items: QuickAccessItem[] = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      label: 'Journal',
      path: '/journal',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      description: 'Suivi émotionnel'
    },
    {
      icon: <Music className="h-6 w-6" />,
      label: 'Musique',
      path: '/music',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
      description: 'Thérapie musicale'
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      label: 'Audio',
      path: '/audio',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      description: 'Méditation guidée'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      label: 'Coach',
      path: '/coach',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      description: 'Conseils personnalisés'
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      label: 'Progression',
      path: '/progress',
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
      description: 'Suivi et statistiques'
    },
    {
      icon: <Medal className="h-6 w-6" />,
      label: 'Défis',
      path: '/gamification',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      description: 'Récompenses et badges'
    },
    {
      icon: <Glasses className="h-6 w-6" />,
      label: 'VR',
      path: '/vr',
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      description: 'Expériences immersives'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      label: 'Social',
      path: '/social',
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      description: 'Communauté et soutien'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.path}
          className="cursor-pointer"
          onClick={() => navigate(item.path)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${item.color}`}>
            <div className="mb-2">{item.icon}</div>
            <span className="text-sm font-medium">{item.label}</span>
            {item.description && (
              <span className="text-xs text-center mt-1 opacity-80">{item.description}</span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickAccessMenu;
