
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchEmotionHistory } from '@/lib/scanService';
import { EmotionResult } from '@/types/emotion';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryTabContentProps {
  userId?: string;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ userId }) => {
  const { user } = useAuth();
  const currentUserId = userId || user?.id || '';
  
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (currentUserId) {
      loadEmotionHistory();
    }
  }, [currentUserId, period]);
  
  const loadEmotionHistory = async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const history = await fetchEmotionHistory(currentUserId, period);
      setEmotions(history);
    } catch (error) {
      console.error('Error loading emotion history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle>Historique des émotions</CardTitle>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPeriod('week')}
              className={period === 'week' ? 'bg-primary text-primary-foreground' : ''}
            >
              7 jours
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPeriod('month')}
              className={period === 'month' ? 'bg-primary text-primary-foreground' : ''}
            >
              30 jours
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPeriod('year')}
              className={period === 'year' ? 'bg-primary text-primary-foreground' : ''}
            >
              12 mois
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Chargement de l'historique...</p>
          </div>
        ) : emotions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune émotion enregistrée durant cette période.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {emotions.map((emotion) => (
                <div key={emotion.id} className="flex items-center p-3 rounded-lg border">
                  <div className="text-2xl mr-4">{emotion.emojis || '😐'}</div>
                  <div className="flex-1">
                    <div className="font-medium">{emotion.emotion}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(emotion.timestamp || emotion.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{Math.round((emotion.score || 0.5) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Intensité</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTabContent;
