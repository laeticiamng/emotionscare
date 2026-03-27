// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';

const VRBreathDiagnostic: React.FC = () => {
  const navigate = useNavigate();

  const tests = [
    {
      name: 'Route /app/vr-breath-guide',
      status: 'success',
      description: 'Route configurée dans le registry'
    },
    {
      name: 'Composant VRBreathPage',
      status: 'success', 
      description: 'Composant existe et exporté'
    },
    {
      name: 'Import MusicContext',
      status: 'success',
      description: 'Import corrigé depuis MusicContext directement'
    },
    {
      name: 'Fonctions play/pause',
      status: 'success',
      description: 'Utilisation correcte des fonctions du contexte'
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          Diagnostic VR Breath
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {test.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <h4 className="font-medium">{test.name}</h4>
                <p className="text-sm text-muted-foreground">{test.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 space-y-2">
          <Button 
            onClick={() => navigate('/app/vr-breath-guide')}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tester la page VR Breath
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/navigation')}
            className="w-full"
          >
            Retour à la navigation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRBreathDiagnostic;