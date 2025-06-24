
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OnboardingPage: React.FC = () => {
  const steps = [
    { id: 1, title: 'Profil personnel', completed: true },
    { id: 2, title: 'Préférences', completed: true },
    { id: 3, title: 'Premier scan émotionnel', completed: false },
    { id: 4, title: 'Configuration notifications', completed: false },
    { id: 5, title: 'Découverte modules', completed: false },
  ];

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Bienvenue dans EmotionsCare !</h1>
        <p className="text-lg text-muted-foreground">
          Configurons ensemble votre parcours de bien-être personnalisé
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progression de l'intégration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
              {step.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
              <div className="flex-1">
                <h3 className={`font-medium ${step.completed ? 'text-green-700' : 'text-gray-700'}`}>
                  {step.title}
                </h3>
              </div>
              {!step.completed && (
                <Button size="sm">
                  Continuer <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scanner d'émotions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analysez vos émotions en temps réel grâce à l'IA
            </p>
            <Button className="w-full">Essayer maintenant</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coach personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Votre assistant IA pour le bien-être au quotidien
            </p>
            <Button className="w-full">Démarrer chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Musicothérapie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Playlists adaptées à votre état émotionnel
            </p>
            <Button className="w-full">Explorer musique</Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button size="lg" className="px-8">
          Terminer l'intégration
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
