
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { useScanPage } from '@/hooks/useScanPage';
import { PlusCircle, Filter } from 'lucide-react';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import EmotionScanLive from '@/components/scan/EmotionScanLive';
import EmotionHistory from '@/components/scan/EmotionHistory';
import TeamOverview from '@/components/scan/TeamOverview';
import { fetchEmotionHistory } from '@/lib/scanService';
import { Emotion } from '@/types';
import EmotionTrendChart from '@/components/scan/EmotionTrendChart';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const { filteredUsers, selectedFilter, filterUsers } = useScanPage();
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90'>('7');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Cast Role to ensure we can compare correctly
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const loadEmotionHistory = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const history = await fetchEmotionHistory();
          setEmotions(history);
        } catch (error) {
          console.error("Error loading emotion history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEmotionHistory();
  }, [user?.id]);

  const handleScanSaved = () => {
    setShowScanForm(false);
    // Refresh data after saving
    fetchEmotionHistory().then(setEmotions);
  };

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-900">Votre Scan Émotionnel</h1>
          <p className="text-muted-foreground mb-4 italic">
            Exprimez-vous en texte, émojis ou voix – nous sommes là pour vous comprendre
          </p>
        </div>

        {!showScanForm && activeTab === 'scan' && (
          <Button 
            onClick={() => setShowScanForm(true)} 
            className="mb-4 sm:mb-0 bg-wellness-coral hover:bg-wellness-coral/90 text-white shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau scan émotionnel
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="rounded-full bg-muted/50 p-1">
          <TabsTrigger value="scan" className="rounded-full">Mon Scan</TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">Historique</TabsTrigger>
          {isAdmin && <TabsTrigger value="team" className="rounded-full">Équipe</TabsTrigger>}
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          {showScanForm ? (
            <Card className="p-6 shadow-md rounded-3xl">
              <EmotionScanForm
                onScanSaved={handleScanSaved}
                onClose={() => setShowScanForm(false)}
              />
            </Card>
          ) : (
            <EmotionScanLive onResultSaved={() => fetchEmotionHistory().then(setEmotions)} />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-8">
          <Card className="p-6 shadow-md rounded-3xl">
            <h3 className="text-xl font-semibold mb-4">Évolution des émotions</h3>
            <EmotionTrendChart emotions={emotions} days={7} />

            {emotions.length > 0 && (
              <div className="mt-6 text-center p-4 bg-blue-50 rounded-2xl">
                <p className="font-medium text-blue-800">
                  Votre humeur moyenne cette semaine : 
                  <span className="ml-1 text-lg">
                    {Math.round(emotions.slice(0, 7).reduce((acc, emotion) => acc + (emotion.score || 0), 0) / 
                      Math.min(emotions.length, 7))}% de bien-être
                  </span>
                </p>
                {emotions.slice(0, 2).every(e => (e.score || 0) < 50) && (
                  <p className="mt-2 text-sm text-blue-600">
                    Suggestion : Complétez un mini-défi de respiration pour améliorer votre humeur
                  </p>
                )}
              </div>
            )}
          </Card>

          <EmotionHistory />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="team">
            <Card className="p-6 shadow-md rounded-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">Scans Émotionnels de l'Équipe</h3>
                <div className="flex flex-wrap gap-2 items-center mt-4 sm:mt-0">
                  <span className="text-sm text-muted-foreground mr-2">Période:</span>
                  <div className="flex gap-1">
                    <Button
                      variant={periodFilter === '7' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPeriodFilter('7')}
                      className="rounded-full"
                    >
                      7j
                    </Button>
                    <Button
                      variant={periodFilter === '30' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPeriodFilter('30')}
                      className="rounded-full"
                    >
                      30j
                    </Button>
                    <Button
                      variant={periodFilter === '90' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPeriodFilter('90')}
                      className="rounded-full"
                    >
                      90j
                    </Button>
                  </div>
                
                  <span className="text-sm text-muted-foreground ml-4 mr-2">Filtrer:</span>
                  <div className="flex gap-1">
                    <Button
                      variant={selectedFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => filterUsers('all')}
                      className="rounded-full"
                    >
                      Tous
                    </Button>
                    <Button
                      variant={selectedFilter === 'risk' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => filterUsers('risk')}
                      className="rounded-full"
                    >
                      À risque
                    </Button>
                  </div>
                
                  <div className="ml-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Average emotion score widget */}
                <Card className="p-4 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Score émotionnel moyen</h4>
                  <p className="text-3xl font-bold">68%</p>
                  <span className="text-sm text-emerald-600 flex items-center">
                    ↑ +4% par rapport à la période précédente
                  </span>
                </Card>

                {/* At-risk percentage widget */}
                <Card className="p-4 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Collaborateurs à risque</h4>
                  <p className="text-3xl font-bold">12%</p>
                  <span className="text-sm text-rose-600 flex items-center">
                    ↑ +2% par rapport à la période précédente
                  </span>
                </Card>

                {/* Check-ins widget */}
                <Card className="p-4 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Scans réalisés</h4>
                  <p className="text-3xl font-bold">42</p>
                  <span className="text-sm text-emerald-600 flex items-center">
                    ↑ +8 par rapport à la période précédente
                  </span>
                </Card>
              </div>
              
              <TeamOverview users={filteredUsers} />

              <div className="mt-8 p-5 border rounded-2xl bg-blue-50">
                <h4 className="text-lg font-medium mb-3">Propositions IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-white">
                    <h5 className="font-medium">Atelier respiration</h5>
                    <p className="text-sm text-muted-foreground mb-3">Organiser une session de 15 min de respiration guidée</p>
                    <Button size="sm" variant="outline" className="w-full">Planifier</Button>
                  </Card>
                  <Card className="p-4 bg-white">
                    <h5 className="font-medium">Pause café collective</h5>
                    <p className="text-sm text-muted-foreground mb-3">Proposer un moment de détente informel en équipe</p>
                    <Button size="sm" variant="outline" className="w-full">Planifier</Button>
                  </Card>
                  <Card className="p-4 bg-white">
                    <h5 className="font-medium">Sondage bien-être</h5>
                    <p className="text-sm text-muted-foreground mb-3">Envoi d'un questionnaire anonyme sur les sources de stress</p>
                    <Button size="sm" variant="outline" className="w-full">Créer</Button>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="mt-8 text-xs text-center text-muted-foreground">
        <p>Conformité RGPD - Vos données sont traitées conformément à notre politique de confidentialité</p>
      </div>
    </div>
  );
};

export default ScanPage;
