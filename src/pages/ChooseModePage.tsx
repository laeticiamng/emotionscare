import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, User, Building2, Heart, Brain, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'b2c' | 'b2b' | null>(null);

  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    setSelectedMode(mode);
    
    // Animation de transition
    setTimeout(() => {
      if (mode === 'b2c') {
        navigate('/b2c');
      } else {
        navigate('/entreprise');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Choisissez votre expérience de bien-être émotionnel
          </p>
          <p className="text-gray-500">
            Découvrez la solution qui correspond le mieux à vos besoins
          </p>
        </motion.div>

        {/* Options de Mode */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Mode B2C - Personnel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                selectedMode === 'b2c' 
                  ? 'border-purple-500 shadow-lg bg-gradient-to-b from-purple-50 to-pink-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleModeSelection('b2c')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-purple-900">
                  Expérience Personnelle
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Votre voyage individuel vers le bien-être émotionnel avec des outils personnalisés et ludiques
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-left">
                    <Brain className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Scan émotionnel IA en temps réel</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">Musicothérapie adaptative</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Target className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm">Expériences VR immersives</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Users className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm">Communauté bienveillante</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-purple-600 font-medium">
                  <span>Commencer mon parcours</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mode B2B - Entreprise */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                selectedMode === 'b2b' 
                  ? 'border-blue-500 shadow-lg bg-gradient-to-b from-blue-50 to-indigo-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleModeSelection('b2b')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-blue-900">
                  Solution Entreprise
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Transformez le bien-être de vos équipes avec notre plateforme de gestion émotionnelle collective
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-left">
                    <Users className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Tableau de bord équipes</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Brain className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm">Analytics émotionnels collectifs</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Target className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Outils de management bienveillant</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Heart className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">Sessions de groupe VR</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <span>Découvrir l'offre entreprise</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Informations Supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            Vous pourrez toujours changer de mode dans vos paramètres
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            <span>🔒 Données sécurisées</span>
            <span>🌍 Conforme RGPD</span>
            <span>🚀 Mise à jour continue</span>
            <span>💬 Support 24/7</span>
          </div>
        </motion.div>

        {/* Animation de transition */}
        {selectedMode && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center z-50"
          >
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-semibold">
                {selectedMode === 'b2c' ? 'Préparation de votre espace personnel...' : 'Accès à la plateforme entreprise...'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChooseModePage;