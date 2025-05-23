
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Building2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'user',
      title: 'Collaborateur',
      description: 'Accédez à votre espace personnel de bien-être professionnel',
      features: [
        'Scanner vos émotions',
        'Accéder aux ressources bien-être',
        'Participer à la communauté',
        'Suivre vos objectifs personnels'
      ],
      icon: Users,
      color: 'bg-blue-500',
      path: '/b2b/user/login'
    },
    {
      id: 'admin',
      title: 'Administrateur',
      description: 'Gérez le bien-être de votre organisation et de vos équipes',
      features: [
        'Tableau de bord organisationnel',
        'Gestion des utilisateurs',
        'Analytics et rapports',
        'Modération du contenu'
      ],
      icon: Shield,
      color: 'bg-purple-500',
      path: '/b2b/admin/login'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          >
            <Building2 className="h-10 w-10 text-primary" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Espace Professionnel B2B
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Choisissez votre rôle pour accéder à votre espace EmotionsCare professionnel
          </motion.p>
        </div>

        {/* Sélection des rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className={`${role.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Fonctionnalités incluses
                    </h4>
                    <ul className="space-y-2">
                      {role.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={() => navigate(role.path)}
                  >
                    Accéder en tant que {role.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Première fois sur EmotionsCare B2B ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Notre plateforme aide les organisations à améliorer le bien-être de leurs équipes 
                grâce à des outils d'analyse émotionnelle et de soutien collectif.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="ghost" size="sm">
                  En savoir plus
                </Button>
                <Button variant="ghost" size="sm">
                  Demander une démo
                </Button>
                <Button variant="ghost" size="sm">
                  Nous contacter
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la sélection du mode
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default B2BSelection;
