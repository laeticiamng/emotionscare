// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { EmotionScanService } from '@/modules/emotion-scan/emotionScanService';
import { Loader2 } from 'lucide-react';

interface AnalyticsTabProps {
  className?: string;
  personalOnly?: boolean;
}

interface EmotionAnalysis {
  date: string;
  emotion: string;
  score: number;
  type: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className, personalOnly }) => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<EmotionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const scans = await EmotionScanService.getUserScans(user.id, {
          limit: 10,
          orderBy: 'created_at',
          ascending: false
        });

        const analyses = scans.slice(0, 5).map((scan) => {
          const emotion = scan.payload?.dominant_emotion || scan.payload?.emotion || 'Neutre';
          const score = scan.mood_score || 7.0;
          const type = scan.payload?.analysis_type || 'Scan';

          return {
            date: new Date(scan.created_at).toLocaleDateString('fr-FR'),
            emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
            score: score,
            type: type.charAt(0).toUpperCase() + type.slice(1)
          };
        });

        setRecentAnalyses(analyses);
      } catch (error) {
        console.error('Error fetching analyses:', error);
        setRecentAnalyses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [user?.id]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'positif':
      case 'énergique':
        return 'bg-success/10 text-success';
      case 'calme':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyses récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune analyse récente</p>
                <p className="text-sm mt-2">Commencez votre première analyse émotionnelle !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getEmotionColor(analysis.emotion)}>
                        {analysis.emotion}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{analysis.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="text-lg font-semibold">
                    {analysis.score}/10
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Graphique des tendances</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">↑ 15%</div>
                  <p className="text-sm text-muted-foreground">Humeur positive</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">↓ 8%</div>
                  <p className="text-sm text-muted-foreground">Niveau de stress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
