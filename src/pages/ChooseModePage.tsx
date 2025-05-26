
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Shield, ArrowRight } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserModeType } from '@/types/userMode';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const modes = [
    {
      type: 'b2c' as UserModeType,
      title: 'Particulier',
      description: 'Accès personnel complet aux fonctionnalités de bien-être émotionnel',
      icon: User,
      features: ['Analyse émotionnelle IA', 'Musique thérapeutique', 'Coach personnel', 'Suivi privé'],
      loginPath: '/b2c/login',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      type: 'b2b_user' as UserModeType,
      title: 'Collaborateur',
      description: 'Espace dédié aux employés avec suivi équipe et bien-être professionnel',
      icon: Users,
      features: ['Bien-être au travail', 'Suivi équipe', 'Ressources RH', 'Support collaboratif'],
      loginPath: '/b2b/user/login',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      type: 'b2b_admin' as UserModeType,
      title: 'Administrateur RH',
      description: 'Tableau de bord complet pour la gestion du bien-être en entreprise',
      icon: Shield,
      features: ['Analytics équipe', 'Gestion utilisateurs', 'Rapports détaillés', 'Administration'],
      loginPath: '/b2b/admin/login',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const handleModeSelect = (mode: UserModeType, loginPath: string) => {
    setUserMode(mode);
    navigate(loginPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Sélectionnez le type d'utilisation qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Card 
                key={mode.type} 
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => handleModeSelect(mode.type, mode.loginPath)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{mode.title}</CardTitle>
                  <CardDescription className="text-base">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <div className="h-1.5 w-1.5 bg-slate-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full bg-gradient-to-br ${mode.gradient} hover:opacity-90 text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModeSelect(mode.type, mode.loginPath);
                    }}
                  >
                    Accéder en tant que {mode.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-slate-600 dark:text-slate-300"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
