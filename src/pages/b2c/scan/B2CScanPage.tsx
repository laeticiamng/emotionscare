
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { Brain, ArrowLeft, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const B2CScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    toast.success("Analyse émotionnelle terminée avec succès!");
    setShowScanForm(false);
  };

  const tips = [
    {
      title: "Préparez-vous mentalement",
      content: "Prenez quelques instants pour vous centrer avant l'analyse. Une respiration profonde peut aider."
    },
    {
      title: "Soyez authentique",
      content: "Exprimez vos vraies émotions sans filtre. L'authenticité améliore la précision de l'analyse."
    },
    {
      title: "Contexte temporel",
      content: "Pensez à ce qui s'est passé récemment dans votre journée pour une analyse plus précise."
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/b2c/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analyse Émotionnelle</h1>
            <p className="text-muted-foreground">
              Découvrez et analysez votre état émotionnel du moment
            </p>
          </div>
        </div>
        {!showScanForm && (
          <Button onClick={() => setShowScanForm(true)}>
            <Brain className="mr-2 h-4 w-4" />
            Commencer une analyse
          </Button>
        )}
      </div>

      {showScanForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Scanner vos émotions</CardTitle>
            <CardDescription>
              Choisissez votre méthode d'analyse préférée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmotionScanForm 
              onComplete={handleScanComplete}
              onClose={() => setShowScanForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Tips and Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Conseils pour une meilleure analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Méthodes d'analyse disponibles</CardTitle>
              <CardDescription>
                Choisissez la méthode qui vous convient le mieux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-dashed border-blue-200 rounded-lg">
                  <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Analyse textuelle</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Décrivez vos ressentis en quelques phrases pour une analyse approfondie de vos émotions.
                  </p>
                  <div className="text-xs text-blue-600 font-medium">Recommandé pour les introspections</div>
                </div>

                <div className="text-center p-6 border-2 border-dashed border-green-200 rounded-lg">
                  <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Analyse vocale</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enregistrez un message vocal pour capturer les nuances émotionnelles de votre voix.
                  </p>
                  <div className="text-xs text-green-600 font-medium">Analyse des intonations</div>
                </div>

                <div className="text-center p-6 border-2 border-dashed border-purple-200 rounded-lg">
                  <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Sélection d'émojis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choisissez les émojis qui représentent le mieux votre état émotionnel actuel.
                  </p>
                  <div className="text-xs text-purple-600 font-medium">Rapide et intuitif</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <UnifiedEmotionCheckin />

          {/* Emotional Journey */}
          <Card>
            <CardHeader>
              <CardTitle>Votre parcours émotionnel</CardTitle>
              <CardDescription>
                Suivi de votre évolution émotionnelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Analyses effectuées ce mois</p>
                    <p className="text-2xl font-bold text-blue-600">23</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Objectif mensuel</p>
                    <p className="text-sm font-medium">30 analyses</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">78%</p>
                    <p className="text-sm text-muted-foreground">Score bien-être moyen</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">Joie</p>
                    <p className="text-sm text-muted-foreground">Émotion dominante</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default B2CScanPage;
