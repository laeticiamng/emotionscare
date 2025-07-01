
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      type: 'user',
      title: 'Collaborateur',
      description: 'Accès aux outils de bien-être émotionnel pour les employés',
      icon: Users,
      path: '/b2b/user/login',
      gradient: 'from-blue-500 to-cyan-600',
      features: [
        'Scan émotionnel personnel',
        'Musique thérapeutique',
        'Coach IA',
        'Social Cocon équipe'
      ]
    },
    {
      type: 'admin',
      title: 'Administrateur RH',
      description: 'Gestion complète du bien-être des équipes',
      icon: Shield,
      path: '/b2b/admin/login',
      gradient: 'from-purple-500 to-pink-600',
      features: [
        'Tableau de bord équipes',
        'Rapports et analytics',
        'Gestion des utilisateurs',
        'Optimisation RH'
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Espace Entreprise
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Choisissez votre type d'accès
            </p>
            <p className="text-muted-foreground">
              Sélectionnez le profil correspondant à votre rôle dans l'entreprise
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {roles.map((role, index) => {
              const IconComponent = role.icon;
              
              return (
                <motion.div
                  key={role.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer h-full"
                        onClick={() => navigate(role.path)}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    <CardHeader className="space-y-4 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center mx-auto`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{role.title}</CardTitle>
                      <CardDescription className="text-base">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {role.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className={`h-2 w-2 bg-gradient-to-r ${role.gradient} rounded-full mr-3`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full bg-gradient-to-br ${role.gradient} hover:opacity-90 text-white shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(role.path);
                        }}
                      >
                        Se connecter en tant que {role.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground">
              Besoin d'aide ? Contactez votre administrateur système ou l'équipe support
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default B2BSelectionPage;
