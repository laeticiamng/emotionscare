
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { EmotionalTeamViewProps } from '@/types/emotion';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ 
  teamId,
  period = 'week',
  userId,
  className = '',
  dateRange,
  onRefresh
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [teamData, setTeamData] = useState<any[]>([]);

  useEffect(() => {
    loadTeamData();
  }, [teamId, selectedPeriod, dateRange]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // Here you would fetch real data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setTeamData([
        { id: 1, name: 'Alice', dominantEmotion: 'joy', averageIntensity: 78 },
        { id: 2, name: 'Bob', dominantEmotion: 'calm', averageIntensity: 65 },
        { id: 3, name: 'Charlie', dominantEmotion: 'stress', averageIntensity: 82 },
        { id: 4, name: 'Diana', dominantEmotion: 'focus', averageIntensity: 71 }
      ]);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTeamData();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">État émotionnel de l'équipe</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            teamData.map(member => (
              <div key={member.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{member.dominantEmotion}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{member.averageIntensity}%</p>
                  <p className="text-sm text-muted-foreground">Intensité</p>
                </div>
              </div>
            ))
          )}
          
          {!isLoading && teamData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée disponible pour cette période
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
