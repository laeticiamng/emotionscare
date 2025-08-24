import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import B2CGamification from '@/pages/b2c/Gamification';

const GamificationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Gamepad2 className="h-12 w-12 text-indigo-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Gamification
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Défis et récompenses pour votre progression
            </p>
          </div>

          <B2CGamification />
        </motion.div>
      </div>
    </div>
  );
};

export default GamificationPage;