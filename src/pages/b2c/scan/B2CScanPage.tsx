
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Calendar, ChevronDown, PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmotionScanner from '@/components/scan/EmotionScanner';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const [showScanForm, setShowScanForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'trends'>('history');
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      score: 85,
      primaryEmotion: 'Joie',
      emotions: { joie: 0.85, calme: 0.7, confiance: 0.65, anxiété: 0.1 },
      text: "J'ai eu une journée productive avec de bonnes nouvelles."
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
      score: 60,
      primaryEmotion: 'Anxiété',
      emotions: { anxiété: 0.6, tension: 0.5, stress: 0.55, joie: 0.2 },
      text: "Beaucoup de pression au travail aujourd'hui."
    }
  ]);

  const handleScanComplete = (result: EmotionResult) => {
    setIsLoading(true);
    
    // Simuler un traitement d'API
    setTimeout(() => {
      const newResult = {
        ...result,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      
      setScanHistory([newResult, ...scanHistory]);
      setShowScanForm(false);
      setIsLoading(false);
      toast.success("Analyse émotionnelle complétée avec succès !");
    }, 1500);
  };

  const calculateColorFromScore = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analyse d'émotions</h1>
          <p className="text-muted-foreground">
            Scannez et suivez vos émotions pour améliorer votre bien-être
          </p>
        </div>
        
        {!showScanForm && (
          <Button 
            onClick={() => setShowScanForm(true)}
            className="mt-4 md:mt-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Button>
        )}
      </header>
      
      {showScanForm ? (
        <div className="mb-8">
          <EmotionScanner 
            onScanComplete={handleScanComplete} 
            onClose={() => setShowScanForm(false)}
          />
          
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p className="text-lg">Analyse en cours...</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-medium">Score émotionnel actuel</h2>
                <div className="flex justify-center items-center">
                  <div className="bg-primary/10 rounded-full p-6">
                    <span className="text-5xl font-bold text-primary">
                      {scanHistory.length > 0 ? scanHistory[0].score : '--'}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {scanHistory.length > 0 
                    ? `Émotion dominante : ${scanHistory[0].primaryEmotion}`
                    : "Effectuez votre première analyse pour voir votre score"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Historique
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tendances
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              {scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-muted/50 inline-block p-4 rounded-full mb-4">
                    <Activity className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-xl mb-2">Aucune analyse trouvée</h3>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore effectué d'analyse émotionnelle
                  </p>
                  <Button onClick={() => setShowScanForm(true)}>
                    Commencer une analyse
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map(scan => (
                    <Card key={scan.id} className="overflow-hidden">
                      <div className="flex">
                        <div 
                          className={`w-2 ${scan.score >= 80 ? 'bg-green-500' : 
                                          scan.score >= 60 ? 'bg-blue-500' : 
                                          scan.score >= 40 ? 'bg-yellow-500' : 
                                          'bg-red-500'}`}
                        />
                        <CardContent className="p-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <span className={`text-xl font-bold ${calculateColorFromScore(scan.score)}`}>
                                  {scan.score}
                                </span>
                                <span className="ml-2 text-lg font-medium">{scan.primaryEmotion}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(scan.date).toLocaleString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                          {scan.text && (
                            <p className="mt-2 text-sm border-t pt-2">{scan.text}</p>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trends">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="bg-muted/50 inline-block p-4 rounded-full mb-4">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-xl mb-2">Tendances émotionnelles</h3>
                    <p className="text-muted-foreground mb-2">
                      {scanHistory.length >= 3 
                        ? "Visualisez l'évolution de vos émotions sur la durée"
                        : "Effectuez au moins 3 analyses pour voir vos tendances"}
                    </p>
                    
                    {scanHistory.length < 3 && (
                      <Button onClick={() => setShowScanForm(true)} className="mt-4">
                        Nouvelle analyse
                      </Button>
                    )}
                    
                    {scanHistory.length >= 3 && (
                      <div className="h-60 mt-6 bg-muted/20 rounded-md flex items-center justify-center">
                        <Activity className="h-10 w-10 text-muted-foreground" />
                        <p className="ml-2 text-muted-foreground">Graphique des tendances</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default B2CScanPage;
