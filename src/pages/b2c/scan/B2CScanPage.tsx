
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScanForm, setShowScanForm] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const handleScanComplete = (result: EmotionResult) => {
    setLastResult(result);
    setShowScanForm(false);
    toast({
      title: "Analyse terminée !",
      description: "Votre état émotionnel a été analysé avec succès.",
      variant: "success"
    });
  };

  const handleNewScan = () => {
    setShowScanForm(true);
    setLastResult(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/b2c/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scanner vos émotions</h1>
          <p className="text-muted-foreground">
            Analysez votre état émotionnel en temps réel
          </p>
        </div>
        {!showScanForm && (
          <Button onClick={handleNewScan} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Nouvelle analyse
          </Button>
        )}
      </div>

      {/* Main Content */}
      {showScanForm ? (
        <EmotionScanForm 
          onComplete={handleScanComplete}
          onClose={() => setShowScanForm(false)}
        />
      ) : lastResult ? (
        /* Résultat de l'analyse */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résultat de votre analyse</CardTitle>
              <CardDescription>
                Votre état émotionnel analysé le {new Date().toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                  <span className="text-3xl font-bold text-primary">{lastResult.score}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Score émotionnel : {lastResult.score}/100</h3>
                <p className="text-muted-foreground">{lastResult.primaryEmotion}</p>
              </div>

              {lastResult.aiFeedback && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Analyse IA</h4>
                  <p className="text-sm">{lastResult.aiFeedback}</p>
                </div>
              )}

              {lastResult.recommendations && lastResult.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommandations</h4>
                  <ul className="space-y-1">
                    {lastResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={handleNewScan} className="flex-1">
                  Nouvelle analyse
                </Button>
                <Button variant="outline" onClick={() => navigate('/b2c/dashboard')} className="flex-1">
                  Retour au tableau de bord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* État initial */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment ça marche ?</CardTitle>
              <CardDescription>
                Notre technologie d'analyse émotionnelle avancée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Choisissez votre méthode</h4>
                    <p className="text-sm text-muted-foreground">Texte, audio ou émojis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Analysez vos émotions</h4>
                    <p className="text-sm text-muted-foreground">IA avancée pour comprendre votre état</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Recevez des conseils</h4>
                    <p className="text-sm text-muted-foreground">Recommandations personnalisées</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prêt à commencer ?</CardTitle>
              <CardDescription>
                Découvrez votre état émotionnel actuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">
                  Lancez votre première analyse émotionnelle
                </p>
                <Button onClick={handleNewScan} size="lg" className="w-full">
                  Commencer l'analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default B2CScanPage;
