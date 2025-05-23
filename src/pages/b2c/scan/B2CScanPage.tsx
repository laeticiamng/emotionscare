
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ScanTabContent from '@/components/scan/ScanTabContent';
import { EmotionResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, Calendar } from 'lucide-react';

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const [showScanForm, setShowScanForm] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanComplete = async (result: EmotionResult) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('emotions')
        .insert({
          user_id: user.id,
          emojis: result.emojis,
          text: result.text,
          audio_url: result.audio_url,
          score: result.score,
          ai_feedback: result.ai_feedback
        });

      if (error) throw error;

      toast.success('Scan émotionnel enregistré !');
      setShowScanForm(false);
      
      // Recharger les scans récents
      loadRecentScans();
    } catch (error: any) {
      console.error('Erreur sauvegarde scan:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentScans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentScans(data || []);
    } catch (error) {
      console.error('Erreur chargement scans:', error);
    }
  };

  React.useEffect(() => {
    loadRecentScans();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scanner vos émotions</h1>
          <p className="text-muted-foreground">
            Analysez votre état émotionnel et recevez des conseils personnalisés
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Scans totaux</p>
                  <p className="text-2xl font-bold">{recentScans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Score moyen</p>
                  <p className="text-2xl font-bold">
                    {recentScans.length > 0 
                      ? Math.round(recentScans.reduce((acc: number, scan: any) => acc + (scan.score || 50), 0) / recentScans.length)
                      : '-'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Dernier scan</p>
                  <p className="text-sm">
                    {recentScans.length > 0 
                      ? new Date(recentScans[0]?.date).toLocaleDateString('fr-FR')
                      : 'Aucun'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ScanTabContent 
          showScanForm={showScanForm}
          setShowScanForm={setShowScanForm}
          onScanComplete={handleScanComplete}
        />

        {/* Historique des scans */}
        {recentScans.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Scans récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan: any) => (
                  <div key={scan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{scan.emojis}</span>
                        <span className="font-medium">Score: {scan.score}/100</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(scan.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {scan.text && (
                      <p className="text-sm mb-2">{scan.text}</p>
                    )}
                    {scan.ai_feedback && (
                      <div className="bg-muted p-3 rounded text-sm">
                        <strong>Conseil IA:</strong> {scan.ai_feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2CScanPage;
