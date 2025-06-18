
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Settings, ArrowRight, Heart, CheckCircle } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Utilisateur individuel',
      subtitle: 'Parcours personnel de bien-être',
      icon: <Users className="h-8 w-8" />,
      description: 'Accédez à tous les outils de bien-être émotionnel pour votre développement personnel',
      features: [
        'Scanner d\'émotions personnel',
        'Journal émotionnel privé',
        'Coach virtuel personnalisé',
        'Musicothérapie adaptée',
        'Suivi de progression individuel'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'Populaire',
      action: () => navigate('/b2c/login')
    },
    {
      id: 'b2b_user',
      title: 'Utilisateur B2B',
      subtitle: 'Bien-être en entreprise',
      icon: <Building className="h-8 w-8" />,
      description: 'Combinez outils personnels et collaboration d\'équipe pour un bien-être professionnel optimal',
      features: [
        'Tous les outils individuels',
        'Cocon social d\'équipe',
        'Gamification collaborative',
        'Challenges d\'équipe',
        'Partage sécurisé'
      ],
      color: 'from-green-500 to-emerald-500',
      badge: 'Collaboration',
      action: () => navigate('/b2b/user/login')
    },
    {
      id: 'b2b_admin',
      title: 'Administrateur B2B',
      subtitle: 'Gestion et analytics',
      icon: <Settings className="h-8 w-8" />,
      description: 'Gérez le bien-être de votre organisation avec des outils d\'administration avancés',
      features: [
        'Tableau de bord complet',
        'Gestion des équipes',
        'Rapports détaillés',
        'Événements d\'entreprise',
        'Analytics avancés'
      ],
      color: 'from-purple-500 to-violet-500',
      badge: 'Admin',
      action: () => navigate('/b2b/admin/login')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre mode d'utilisation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sélectionnez le mode qui correspond le mieux à vos besoins pour commencer votre parcours de bien-être
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modes.map((mode) => (
            <Card 
              key={mode.id} 
              className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
            >
              {mode.badge && (
                <div className="absolute -top-3 left-6">
                  <Badge className="bg-primary text-white">
                    {mode.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center text-white mx-auto mb-4`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{mode.title}</CardTitle>
                <p className="text-muted-foreground font-medium">{mode.subtitle}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-center text-gray-600">
                  {mode.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-900">Fonctionnalités incluses :</h4>
                  <ul className="space-y-2">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={mode.action}
                  className="w-full"
                  size="lg"
                >
                  Choisir ce mode
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-4">
            Vous avez des questions ? Besoin d'aide pour choisir ?
          </p>
          <Button variant="outline">
            Contactez notre équipe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
