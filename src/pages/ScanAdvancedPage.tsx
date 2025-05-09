
import React, { useState } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScanAdvancedPage = () => {
  const [activeTab, setActiveTab] = useState('voice');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setResult(null);

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Mock results based on active tab
      if (activeTab === 'voice') {
        setResult({
          emotionScore: 82,
          primaryEmotion: 'calm',
          secondaryEmotion: 'focused',
          insights: [
            'Votre ton indique un état calme et équilibré',
            'Légère tension détectée dans certaines inflexions vocales',
            'Rythme de parole régulier suggérant une concentration stable'
          ]
        });
      } else if (activeTab === 'facial') {
        setResult({
          emotionScore: 75,
          primaryEmotion: 'neutral',
          secondaryEmotion: 'mild_stress',
          insights: [
            'Expression faciale généralement neutre',
            'Légère tension au niveau des sourcils',
            'Micro-expressions indiquant un stress léger'
          ]
        });
      } else {
        setResult({
          emotionScore: 68,
          primaryEmotion: 'concern',
          secondaryEmotion: 'thoughtful',
          insights: [
            'Vos mots révèlent une préoccupation modérée',
            'Champ lexical orienté vers la réflexion',
            'Structure de phrases indiquant une analyse approfondie'
          ]
        });
      }
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scan émotionnel avancé</h1>
          <p className="text-muted-foreground">
            Analyse multi-canal pour une compréhension émotionnelle approfondie
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="voice">Analyse vocale</TabsTrigger>
          <TabsTrigger value="facial">Analyse faciale</TabsTrigger>
          <TabsTrigger value="text">Analyse textuelle</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {activeTab === 'voice' && 'Analyse des inflexions vocales'}
                {activeTab === 'facial' && 'Analyse des micro-expressions faciales'}
                {activeTab === 'text' && 'Analyse sémantique du texte'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                {isScanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Scan en cours...</p>
                  </div>
                ) : result ? (
                  <div className="text-center p-6">
                    <div className="mb-4">
                      <div className="text-4xl font-bold mb-1">{result.emotionScore}</div>
                      <div className="text-sm text-muted-foreground">Score émotionnel</div>
                    </div>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="font-medium capitalize">{result.primaryEmotion}</div>
                        <div className="text-xs text-muted-foreground">Émotion primaire</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-medium capitalize">{result.secondaryEmotion}</div>
                        <div className="text-xs text-muted-foreground">Émotion secondaire</div>
                      </div>
                    </div>
                    
                    <ul className="text-left text-sm space-y-1">
                      {result.insights.map((insight: string, index: number) => (
                        <li key={index}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    {activeTab === 'voice' && (
                      <>
                        <p>Prêt à analyser vos inflexions vocales</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Parlez pendant 15 secondes pour une analyse précise
                        </p>
                      </>
                    )}
                    {activeTab === 'facial' && (
                      <>
                        <p>Prêt à analyser vos expressions faciales</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Assurez-vous d'être bien éclairé et face à la caméra
                        </p>
                      </>
                    )}
                    {activeTab === 'text' && (
                      <>
                        <p>Prêt à analyser votre texte</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Décrivez votre état émotionnel actuel en quelques phrases
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleStartScan}
                disabled={isScanning}
              >
                {isScanning ? 'Scan en cours...' : 'Démarrer le scan'}
              </Button>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">À propos de cette analyse</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {activeTab === 'voice' && (
                  <p>
                    L'analyse vocale évalue les variations de ton, de rythme et d'intonation pour détecter les émotions sous-jacentes qui peuvent être imperceptibles à l'oreille humaine.
                  </p>
                )}
                {activeTab === 'facial' && (
                  <p>
                    L'analyse faciale identifie les micro-expressions qui durent moins de 500ms et révèlent des émotions authentiques que nous ne contrôlons pas consciemment.
                  </p>
                )}
                {activeTab === 'text' && (
                  <p>
                    L'analyse textuelle évalue le choix des mots, la structure des phrases et les associations sémantiques pour comprendre l'état émotionnel sous-jacent.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Confidentialité</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  Toutes les analyses sont effectuées localement sur votre appareil. Aucune donnée n'est stockée ou partagée avec des tiers. Votre vie privée est notre priorité.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default function WrappedScanAdvancedPage() {
  return (
    <ProtectedLayoutWrapper>
      <ScanAdvancedPage />
    </ProtectedLayoutWrapper>
  );
}
