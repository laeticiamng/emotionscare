import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Heart, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<'b2c' | 'b2b_user' | 'b2b_admin' | null>(null);

  const steps = [
    {
      id: 1,
      title: "Bienvenue sur EmotionsCare",
      description: "Votre plateforme de bien-être émotionnel",
      icon: Heart
    },
    {
      id: 2,
      title: "Choisissez votre profil",
      description: "Sélectionnez le type d'utilisateur qui vous correspond",
      icon: Users
    },
    {
      id: 3,
      title: "Personnalisation",
      description: "Configurez votre expérience selon vos besoins",
      icon: Brain
    }
  ];

  const userTypes = [
    {
      id: 'b2c',
      title: 'Utilisateur Personnel',
      description: 'Gérez votre bien-être émotionnel personnel',
      features: ['Scan émotionnel', 'Coach IA', 'Musicothérapie', 'Journal'],
      color: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      id: 'b2b_user',
      title: 'Collaborateur',
      description: 'Accédez aux outils d\'entreprise pour votre équipe',
      features: ['Tableaux de bord', 'Analytics', 'Collaboration', 'Rapports'],
      color: 'bg-gradient-to-r from-green-500 to-teal-600'
    },
    {
      id: 'b2b_admin',
      title: 'Administrateur RH',
      description: 'Gérez le bien-être de votre organisation',
      features: ['Dashboard admin', 'Gestion équipes', 'Analytics avancées', 'Paramètres'],
      color: 'bg-gradient-to-r from-orange-500 to-red-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Rediriger selon le type d'utilisateur
      if (userType === 'b2c') {
        navigate('/b2c/dashboard');
      } else if (userType === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else if (userType === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      } else {
        navigate('/choose-mode');
      }
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">EmotionsCare</h1>
          <p className="text-muted-foreground">Votre parcours vers le bien-être émotionnel commence ici</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {step.id < steps.length && (
                  <div className={`w-20 h-1 ml-2 ${
                    step.id < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "h-12 w-12 text-primary"
              })}
            </div>
            <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="text-center space-y-4">
                <p className="text-lg mb-6">
                  EmotionsCare vous accompagne dans la gestion de votre bien-être émotionnel
                  grâce à l'intelligence artificielle et des outils innovants.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Scan Émotionnel</h3>
                    <p className="text-sm text-muted-foreground">Analysez vos émotions en temps réel</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Coach IA</h3>
                    <p className="text-sm text-muted-foreground">Un accompagnement personnalisé</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Communauté</h3>
                    <p className="text-sm text-muted-foreground">Partagez avec d'autres utilisateurs</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-center mb-6">
                  Sélectionnez le type d'utilisation qui correspond à vos besoins :
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {userTypes.map((type) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        userType === type.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setUserType(type.id as any)}
                    >
                      <CardHeader>
                        <div className={`h-16 w-16 rounded-full ${type.color} mx-auto mb-2 flex items-center justify-center`}>
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-center text-lg">{type.title}</CardTitle>
                        <p className="text-center text-sm text-muted-foreground">{type.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {type.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <p className="text-lg mb-6">
                  Parfait ! Votre profil {userTypes.find(t => t.id === userType)?.title} est configuré.
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Prochaines étapes :</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Accédez à votre tableau de bord personnalisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Explorez les fonctionnalités disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Commencez votre première session</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentStep === 2 && !userType}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length ? 'Commencer' : 'Suivant'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;