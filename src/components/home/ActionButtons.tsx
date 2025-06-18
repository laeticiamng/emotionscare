
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, Music, BookOpen, Users, Settings } from 'lucide-react';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Scanner Émotionnel",
      description: "Analysez vos émotions",
      path: "/scan",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Musicothérapie",
      description: "Musique adaptative",
      path: "/music",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Journal",
      description: "Suivez votre progression",
      path: "/journal",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Coach IA",
      description: "Accompagnement personnalisé",
      path: "/coach",
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communauté",
      description: "Partagez avec d'autres",
      path: "/community",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Paramètres",
      description: "Personnalisez votre expérience",
      path: "/settings",
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="group"
        >
          <Button
            onClick={() => navigate(action.path)}
            className={`w-full h-32 ${action.color} text-white flex flex-col items-center justify-center space-y-2 transition-all duration-300 shadow-lg hover:shadow-xl`}
            variant="default"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
              {action.icon}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ActionButtons;
