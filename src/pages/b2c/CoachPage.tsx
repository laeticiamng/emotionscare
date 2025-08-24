import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EnhancedCoachChat from '@/components/coach/EnhancedCoachChat';

const CoachPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
              <Brain className="h-12 w-12 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Coach IA
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Votre accompagnateur personnel intelligent
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-background rounded-lg border shadow-lg">
            <EnhancedCoachChat 
              initialMessage="Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous accompagner aujourd'hui dans votre parcours de bien-être ?" 
              showCharacter={true}
              showHeader={true}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoachPage;