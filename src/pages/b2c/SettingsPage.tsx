
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-gray-800">
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
              <Settings className="h-12 w-12 text-gray-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Personnalisez votre expérience
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Configuration</CardTitle>
              <CardDescription className="text-center">
                Fonctionnalité en cours de développement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Personnalisez vos préférences et paramètres
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
