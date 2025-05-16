
import React, { useEffect, useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { fetchEmotionHistory } from '@/lib/scanService';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmotionHistory from './EmotionHistory';
import EmotionTrendChart from './EmotionTrendChart';
import { Loader2 } from 'lucide-react';

const HistoryTabContent: React.FC = () => {
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const loadEmotionHistory = async () => {
      setIsLoading(true);
      try {
        // Call fetchEmotionHistory without arguments
        const history = await fetchEmotionHistory();
        setEmotions(history);
      } catch (error) {
        console.error('Error loading emotion history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmotionHistory();
  }, []);

  const handleEmotionSelect = (emotion: EmotionResult) => {
    console.log('Selected emotion:', emotion);
    // Handle emotion selection, e.g., show details
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="chart">Tendances</TabsTrigger>
          <TabsTrigger value="list">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="pt-2">
          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              {['week', 'month', 'year'].map((period) => (
                <Button 
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === 'week' ? 'Semaine' : 
                   period === 'month' ? 'Mois' : 'Année'}
                </Button>
              ))}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <EmotionTrendChart emotions={emotions} period={selectedPeriod as 'week' | 'month' | 'year'} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <EmotionHistory emotions={emotions} onSelectEmotion={handleEmotionSelect} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default HistoryTabContent;
