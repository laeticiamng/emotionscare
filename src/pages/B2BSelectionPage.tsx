
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Collaborateur',
      description: 'Accès aux fonctionnalités de bien-être pour les employés',
      icon: Users,
      path: '/b2b/user/login',
      features: ['Suivi personnel', 'Ressources bien-être', 'Support équipe'],
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Administrateur RH',
      description: 'Gestion complète du bien-être en entreprise',
      icon: Shield,
      path: '/b2b/admin/login',
      features: ['Analytics équipe', 'Gestion utilisateurs', 'Rapports détaillés'],
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Espace Entreprise
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Choisissez votre type d'accès professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.title}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => navigate(option.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{option.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-600 dark:text-slate-300">
                        <div className="h-2 w-2 bg-slate-400 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full bg-gradient-to-br ${option.gradient} hover:opacity-90 text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(option.path);
                    }}
                  >
                    Continuer en tant que {option.title}
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
