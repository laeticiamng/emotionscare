// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Brain, Music, Heart, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routerV2';

interface FloatingAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
  gradient: string;
}

const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions: FloatingAction[] = [
    {
      id: 'scan',
      icon: <Eye className="w-5 h-5" />,
      label: 'Scan Rapide',
      path: routes.b2c.scan(),
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'emotions',
      icon: <Brain className="w-5 h-5" />,
      label: 'Analyse Émotions',
      path: routes.b2c.scan(), // Utilise scan au lieu d'emotions
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'music',
      icon: <Music className="w-5 h-5" />,
      label: 'Musicothérapie',
      path: routes.b2c.music(),
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      id: 'flash',
      icon: <Zap className="w-5 h-5" />,
      label: 'Flash Boost',
      path: routes.b2c.flashGlow(),
      color: 'bg-yellow-500',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'community',
      icon: <Heart className="w-5 h-5" aria-hidden="true" />,
      label: 'Communauté',
      path: routes.b2c.community(),
      color: 'bg-pink-500',
      gradient: 'from-pink-400 to-rose-600'
    },
    {
      id: 'exchange',
      icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
      label: 'Exchange Hub',
      path: routes.b2c.exchange(),
      color: 'bg-emerald-500',
      gradient: 'from-emerald-400 to-teal-600'
    }
  ];

  const handleActionClick = (action: FloatingAction) => {
    navigate(action.path);
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 50, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 50, 
                    y: 20,
                    transition: { delay: (quickActions.length - index - 1) * 0.05 }
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                        onClick={() => handleActionClick(action)}
                      >
                        {action.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="mr-2">
                      <p className="font-medium">{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 ${
              isOpen ? 'rotate-45' : 'rotate-0'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default FloatingActionMenu;