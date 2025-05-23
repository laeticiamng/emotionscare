
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import EmotionResultCard from '@/components/scan/EmotionResultCard';
import ScanPageHeader from '@/components/scan/ScanPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4, Scan, History } from 'lucide-react';

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  
  const handleScanComplete = (result: EmotionResult) => {
    setScanResult(result);
    setShowScanForm(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ScanPageHeader
        showScanForm={showScanForm}
        activeTab={activeTab}
        setShowScanForm={setShowScanForm}
      />
      
      <Tabs 
        defaultValue="scan" 
        onValueChange={(value) => setActiveTab(value)}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            <span className="hidden sm:inline">Scanner</span>
            <span className="inline sm:hidden">Scanner</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
            <span className="inline sm:hidden">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
            <span className="inline sm:hidden">Insights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          {scanResult && !showScanForm ? (
            <div className="space-y-6">
              <EmotionResultCard 
                result={scanResult}
                onClose={() => setScanResult(null)}
              />
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setScanResult(null)}
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => setShowScanForm(true)}
                >
                  Nouvelle analyse
                </Button>
              </div>
            </div>
          ) : showScanForm ? (
            <EmotionScanForm 
              onComplete={handleScanComplete} 
              onClose={() => setShowScanForm(false)} 
            />
          ) : (
            <div className="text-center p-10 bg-muted rounded-lg space-y-4">
              <Scan className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-semibold">Prêt à analyser vos émotions ?</h3>
              <p className="text-muted-foreground">
                Notre scanner d'émotions utilise l'IA pour analyser votre texte, votre voix ou vos émojis.
              </p>
              <Button 
                onClick={() => setShowScanForm(true)}
                size="lg"
                className="mt-4"
              >
                Démarrer une analyse
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {user ? (
            <UnifiedEmotionCheckin />
          ) : (
            <div className="text-center p-10 bg-muted rounded-lg space-y-4">
              <History className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-semibold">Connexion requise</h3>
              <p className="text-muted-foreground">
                Vous devez être connecté pour voir votre historique émotionnel.
              </p>
              <Button 
                onClick={() => navigate('/b2c/login')}
                size="lg"
                className="mt-4"
              >
                Se connecter
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Recommandations personnalisées</h3>
                <p className="text-muted-foreground mb-4">
                  Basées sur vos dernières analyses émotionnelles, voici quelques recommandations :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>Pratiquez la méditation mindfulness pendant 10 minutes par jour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>Essayez des exercices de respiration profonde en cas de stress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>Prenez 30 minutes par jour pour une activité que vous aimez</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Conseils bien-être</h3>
                <p className="text-muted-foreground mb-4">
                  Conseils généraux pour améliorer votre bien-être émotionnel :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Maintenez une routine de sommeil régulière (7-8h par nuit)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Faites de l'exercice physique au moins 3 fois par semaine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>Limitez la consommation de caféine et d'alcool</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowScanForm(true)}
              className="w-full"
            >
              Faire une nouvelle analyse
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CScanPage;
