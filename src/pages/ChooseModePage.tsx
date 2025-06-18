
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';
import { Users, Building2, Shield } from 'lucide-react';
import type { UserMode } from '@/types/auth';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleModeSelection = (mode: UserMode) => {
    setUserMode(mode);
    navigate(`/${mode === 'b2c' ? 'b2c' : mode === 'b2b_user' ? 'b2b/user' : 'b2b/admin'}/login`);
  };

  const modes = [
    {
      id: 'b2c' as UserMode,
      title: 'Particulier',
      description: 'Accès personnel à la plateforme de bien-être émotionnel',
      icon: Users,
      color: 'from-blue-500 to-purple-600',
      features: ['Journal personnel', 'Modules de bien-être', 'Suivi individuel']
    },
    {
      id: 'b2b_user' as UserMode,
      title: 'Collaborateur',
      description: 'Accès collaborateur avec fonctionnalités d\'équipe',
      icon: Building2,
      color: 'from-green-500 to-teal-600',
      features: ['Outils collaboratifs', 'Partage d\'équipe', 'Analytics groupe']
    },
    {
      id: 'b2b_admin' as UserMode,
      title: 'Administrateur RH',
      description: 'Gestion complète et analytics avancés',
      icon: Shield,
      color: 'from-orange-500 to-red-600',
      features: ['Dashboard RH', 'Gestion utilisateurs', 'Rapports détaillés']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-muted-foreground text-lg">
            Sélectionnez le type d'accès qui correspond à vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mode.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleModeSelection(mode.id)}
                    className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 transition-opacity`}
                  >
                    Choisir ce mode
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
