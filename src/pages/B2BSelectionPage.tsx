
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowRight, User, Settings, BarChart3, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'user',
      title: 'Collaborateur',
      subtitle: 'Accès employé',
      description: 'Interface dédiée aux collaborateurs pour leur bien-être personnel au travail.',
      icon: User,
      color: 'from-green-500 to-emerald-600',
      features: [
        'Dashboard personnel',
        'Scan émotionnel au travail',
        'Coach IA professionnel',
        'Suivi de bien-être',
        'Ressources RH'
      ],
      action: () => navigate('/b2b/user/login'),
      popular: true
    },
    {
      id: 'admin',
      title: 'Administrateur',
      subtitle: 'Gestion équipe',
      description: 'Interface d\'administration pour les RH et managers d\'équipe.',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Analytics équipe globales',
        'Gestion des utilisateurs',
        'Rapports RH détaillés',
        'Configuration système',
        'Support prioritaire'
      ],
      action: () => navigate('/b2b/admin/login')
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-indigo-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Espace Entreprise
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez votre rôle pour accéder aux fonctionnalités adaptées à vos responsabilités.
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {role.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Accès rapide
                    </span>
                  </div>
                )}
                
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 hover:border-opacity-50"
                      onClick={role.action}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5 rounded-lg`} />
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-600">
                      {role.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 text-center">
                      {role.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Fonctionnalités disponibles :</h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="h-2 w-2 bg-gray-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-br ${role.color} hover:opacity-90 text-white py-3`}
                      onClick={(e) => {
                        e.stopPropagation();
                        role.action();
                      }}
                    >
                      Se connecter comme {role.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Pourquoi choisir EmotionsCare Enterprise ?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Avancées</h4>
                <p className="text-gray-600">
                  Tableaux de bord détaillés pour comprendre le bien-être de vos équipes
                </p>
              </div>
              
              <div className="text-center">
                <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Sécurité Enterprise</h4>
                <p className="text-gray-600">
                  Conformité RGPD, chiffrement bout-en-bout et audit de sécurité
                </p>
              </div>
              
              <div className="text-center">
                <Headphones className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Support Dédié</h4>
                <p className="text-gray-600">
                  Accompagnement personnalisé et formation de vos équipes
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
