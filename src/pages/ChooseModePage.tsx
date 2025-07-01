
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Shield } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';
import PremiumLayout from '@/components/layout/PremiumLayout';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const userModes = [
    {
      id: 'b2c',
      title: 'Espace Particulier',
      description: 'Accès personnel pour votre bien-être mental et émotionnel',
      icon: <User className="h-12 w-12" />,
      features: ['Scan émotionnel', 'Musique thérapeutique', 'Coach IA', 'Journal personnel', 'VR immersive'],
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      route: '/b2c/login'
    },
    {
      id: 'b2b_user',
      title: 'Collaborateur',
      description: 'Espace dédié aux employés pour le bien-être en entreprise',
      icon: <Users className="h-12 w-12" />,
      features: ['Outils personnels', 'Sessions de groupe', 'Cocon social', 'Gamification', 'Suivi équipe'],
      gradient: 'from-green-500 via-green-600 to-teal-700',
      route: '/b2b/user/login'
    },
    {
      id: 'b2b_admin',
      title: 'Administrateur RH',
      description: 'Interface complète pour la gestion du bien-être des équipes',
      icon: <Shield className="h-12 w-12" />,
      features: ['Gestion équipes', 'Rapports avancés', 'Événements', 'Optimisation IA', 'Paramètres admin'],
      gradient: 'from-purple-500 via-purple-600 to-violet-700',
      route: '/b2b/admin/login'
    }
  ];

  const handleModeSelect = (route: string) => {
    navigate(route);
  };

  return (
    <PremiumLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            EmotionsCare
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Choisissez votre espace pour commencer votre parcours de bien-être mental
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {userModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.6 + index * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <PremiumCard 
                  className="h-full cursor-pointer group hover:shadow-3xl transition-all duration-500"
                  onClick={() => handleModeSelect(mode.route)}
                >
                  <div className={`h-full bg-gradient-to-br ${mode.gradient} text-white p-8 rounded-3xl relative overflow-hidden`}>
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 text-center h-full flex flex-col">
                      {/* Icône */}
                      <motion.div 
                        className="p-4 bg-white/25 rounded-3xl w-fit mx-auto mb-6 group-hover:bg-white/35 group-hover:scale-110 transition-all duration-500"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {mode.icon}
                      </motion.div>
                      
                      {/* Titre */}
                      <h3 className="text-2xl font-bold mb-4">{mode.title}</h3>
                      
                      {/* Description */}
                      <p className="text-white/90 mb-6 flex-grow">{mode.description}</p>
                      
                      {/* Fonctionnalités */}
                      <div className="mb-8">
                        <div className="space-y-2">
                          {mode.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                              <span className="text-white/90">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bouton */}
                      <PremiumButton 
                        variant="ghost" 
                        className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white hover:text-white backdrop-blur-md group-hover:scale-105 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModeSelect(mode.route);
                        }}
                      >
                        Accéder à l'espace
                      </PremiumButton>
                    </div>
                    
                    {/* Effet de shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore de compte ?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PremiumButton variant="ghost" onClick={() => navigate('/b2c/register')}>
                Inscription Particulier
              </PremiumButton>
              <PremiumButton variant="ghost" onClick={() => navigate('/b2b/selection')}>
                Inscription Entreprise
              </PremiumButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PremiumLayout>
  );
};

export default ChooseModePage;
