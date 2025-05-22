
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scan, BookOpen, Music, BrainCircuit, PenLine, Medal } from 'lucide-react';

interface ActionButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  to: string;
  color: string;
}

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  
  const buttons: ActionButton[] = [
    {
      id: 'scan',
      icon: <Scan size={24} />,
      label: 'Scan émotionnel',
      description: 'Analyser votre état actuel',
      to: '/scan',
      color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'journal',
      icon: <BookOpen size={24} />,
      label: 'Journal',
      description: 'Noter vos pensées',
      to: '/journal',
      color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'music',
      icon: <Music size={24} />,
      label: 'Musique',
      description: 'Relaxation sonore',
      to: '/music',
      color: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
    },
    {
      id: 'coach',
      icon: <BrainCircuit size={24} />,
      label: 'Coach IA',
      description: 'Conseils personnalisés',
      to: '/coach',
      color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'gamification',
      icon: <Medal size={24} />,
      label: 'Récompenses',
      description: 'Vos accomplissements',
      to: '/achievements',
      color: 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400'
    },
    {
      id: 'community',
      icon: <PenLine size={24} />,
      label: 'Communauté',
      description: 'Partager anonymement',
      to: '/community',
      color: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {buttons.map((button) => (
        <motion.div
          key={button.id}
          variants={itemVariants}
          whileHover="hover"
          className="cursor-pointer"
          onClick={() => navigate(button.to)}
        >
          <div className={`flex flex-col items-center justify-center p-6 rounded-xl ${button.color} h-full`}>
            <div className="mb-3">
              {button.icon}
            </div>
            <h3 className="font-medium text-lg mb-1">{button.label}</h3>
            <p className="text-sm text-center opacity-80">{button.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ActionButtons;
