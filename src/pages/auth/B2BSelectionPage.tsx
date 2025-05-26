
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Building2, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'user',
      title: 'Collaborateur',
      description: 'Accédez à vos outils de bien-être personnel en entreprise',
      icon: User,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Dashboard personnel',
        'Journal et scan émotionnel',
        'Coach IA dédié',
        'Défis d\'équipe',
        'Social Cocoon'
      ],
      action: () => navigate('/b2b/user/login')
    },
    {
      id: 'admin',
      title: 'Administrateur RH',
      description: 'Gérez le bien-être de vos équipes avec des outils avancés',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Dashboard organisation',
        'Analytics équipes',
        'Gestion utilisateurs',
        'Rapports détaillés',
        'Configuration avancée'
      ],
      action: () => navigate('/b2b/admin/login')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Espace Entreprise
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choisissez votre profil pour accéder aux fonctionnalités adaptées
          </p>
        </motion.div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {userTypes.map((userType, index) => (
            <motion.div
              key={userType.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${userType.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <userType.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{userType.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userType.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {userType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={userType.action}
                    className={`w-full bg-gradient-to-r ${userType.color} hover:shadow-lg transition-all`}
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/choose-mode')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au choix de mode
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
