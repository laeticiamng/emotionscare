
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import PremiumLayout from '@/components/layout/PremiumLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { User, Building2, Shield, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userMode) {
      // Rediriger vers le dashboard approprié
      switch (userMode) {
        case 'b2c':
          navigate('/b2c/dashboard');
          break;
        case 'b2b_user':
          navigate('/b2b/user/dashboard');
          break;
        case 'b2b_admin':
          navigate('/b2b/admin/dashboard');
          break;
      }
    }
  }, [isAuthenticated, userMode, navigate]);

  if (isLoading) {
    return (
      <PremiumLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </PremiumLayout>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const userTypes = [
    {
      icon: User,
      title: 'Particulier',
      description: 'Prenez soin de votre bien-être mental avec nos outils personnalisés',
      features: ['Scanner d\'émotions', 'Musique thérapeutique', 'Coach IA personnel', 'Journal privé'],
      path: '/choose-mode?type=b2c',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building2,
      title: 'Collaborateur',
      description: 'Améliorez votre bien-être au travail avec votre équipe',
      features: ['Check-in quotidien', 'Activités d\'équipe', 'Challenges collectifs', 'Support RH'],
      path: '/choose-mode?type=b2b_user',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Administrateur RH',
      description: 'Pilotez le bien-être de vos collaborateurs avec des outils avancés',
      features: ['Dashboard analytique', 'Gestion d\'équipes', 'Rapports détaillés', 'Configuration'],
      path: '/choose-mode?type=b2b_admin',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <PremiumLayout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              EmotionsCare
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Votre plateforme de bien-être mental premium
            </p>
            <p className="text-lg text-muted-foreground">
              Choisissez votre profil pour commencer votre parcours
            </p>
          </motion.div>

          {/* User type selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="h-full"
                >
                  <Card className="premium-card group cursor-pointer h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-1">{type.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Fonctionnalités incluses :</h4>
                        <ul className="space-y-2">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(type.path)}
                        className={`w-full bg-gradient-to-r ${type.color} hover:shadow-lg transition-all`}
                      >
                        Commencer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Déjà un compte ? 
              <Button variant="link" onClick={() => navigate('/choose-mode')}>
                Se connecter
              </Button>
            </p>
          </motion.div>
        </div>
      </div>
    </PremiumLayout>
  );
};

export default HomePage;
