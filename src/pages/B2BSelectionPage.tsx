
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      type: 'employee',
      title: 'Employé / Collaborateur',
      description: 'Accédez à votre espace personnel de bien-être au travail',
      icon: User,
      color: 'from-green-500 to-emerald-600',
      features: [
        'Dashboard personnel',
        'Suivi émotionnel',
        'Recommandations IA',
        'Outils de bien-être'
      ],
      loginRoute: '/b2b/user/login',
      registerRoute: '/b2b/user/register'
    },
    {
      type: 'admin',
      title: 'Administrateur / RH',
      description: 'Gérez le bien-être de vos équipes avec des outils avancés',
      icon: Shield,
      color: 'from-blue-500 to-purple-600',
      features: [
        'Analytics RH complets',
        'Gestion d\'équipes',
        'Rapports détaillés',
        'Configuration avancée'
      ],
      loginRoute: '/b2b/admin/login',
      registerRoute: '/b2b/admin/register'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare B2B
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Choisissez votre type d'accès pour continuer
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {userTypes.map((userType) => (
            <Card 
              key={userType.type} 
              className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200"
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${userType.color} flex items-center justify-center mb-4`}>
                  <userType.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{userType.title}</CardTitle>
                <CardDescription className="text-base">
                  {userType.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Fonctionnalités incluses :</h4>
                  <ul className="space-y-2">
                    {userType.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    onClick={() => navigate(userType.loginRoute)}
                    className={`w-full bg-gradient-to-r ${userType.color} hover:opacity-90`}
                  >
                    Se Connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate(userType.registerRoute)}
                    className="w-full"
                  >
                    Créer un Compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Vous n'êtes pas sûr ? Contactez votre administrateur RH
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-blue-600"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
