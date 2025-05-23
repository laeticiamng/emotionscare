
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const B2BUserScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    toast.success("Analyse émotionnelle terminée avec succès!");
    setShowScanForm(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/b2b/user/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analyse Émotionnelle</h1>
            <p className="text-muted-foreground">
              Analysez votre état émotionnel pour optimiser votre bien-être au travail
            </p>
          </div>
        </div>
        {!showScanForm && (
          <Button onClick={() => setShowScanForm(true)}>
            <Brain className="mr-2 h-4 w-4" />
            Nouvelle analyse
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
          <Card>
            <CardHeader>
              <CardTitle>Conseils pour l'analyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Analyse textuelle</h3>
                  <p className="text-sm text-muted-foreground">
                    Décrivez vos ressentis en quelques phrases pour une analyse précise.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Analyse vocale</h3>
                  <p className="text-sm text-muted-foreground">
                    Enregistrez un message vocal pour capturer les nuances émotionnelles.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Sélection d'émojis</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez les émojis qui représentent le mieux votre état actuel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <UnifiedEmotionCheckin />
        </div>
      )}
    </div>
  );
};

export default B2BUserScanPage;
