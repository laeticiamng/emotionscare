
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, ArrowRight } from 'lucide-react';

interface Checkin {
  id: string;
  date: string;
  score: number;
  status: string;
}

const UnifiedEmotionCheckin: React.FC = () => {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCheckins = async () => {
      setIsLoading(true);
      
      // Simuler un chargement de données
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Données simulées
      const mockCheckins: Checkin[] = [
        {
          id: '1',
          date: new Date(Date.now() - 86400000 * 1).toISOString(), // Hier
          score: 85,
          status: 'good'
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // Avant-hier
          score: 75,
          status: 'good'
        },
        {
          id: '3',
          date: new Date(Date.now() - 86400000 * 3).toISOString(), // Il y a 3 jours
          score: 40,
          status: 'low'
        },
        {
          id: '4',
          date: new Date(Date.now() - 86400000 * 5).toISOString(), // Il y a 5 jours
          score: 60,
          status: 'average'
        },
        {
          id: '5',
          date: new Date(Date.now() - 86400000 * 7).toISOString(), // Il y a 7 jours
          score: 30,
          status: 'low'
        },
      ];
      
      setCheckins(mockCheckins);
      setIsLoading(false);
    };
    
    loadCheckins();
  }, []);
  
  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  // Obtenir la couleur en fonction du score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Vos analyses récentes</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-sm">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : checkins.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-lg mb-2">Aucune analyse récente</h4>
              <p className="text-muted-foreground mb-6">
                Commencez à analyser vos émotions pour les voir apparaître ici
              </p>
              <Button>Commencer une analyse</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {checkins.map((checkin) => (
                <div key={checkin.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    checkin.status === 'good' ? 'bg-green-100' :
                    checkin.status === 'average' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    <Activity className={`h-5 w-5 ${
                      checkin.status === 'good' ? 'text-green-600' :
                      checkin.status === 'average' ? 'text-blue-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{formatDate(checkin.date)}</p>
                      <p className={`font-bold ${getScoreColorClass(checkin.score)}`}>
                        {checkin.score}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {checkin.status === 'good' ? 'Bien-être élevé' :
                       checkin.status === 'average' ? 'Bien-être moyen' :
                       'Bien-être bas'}
                    </p>
                  </div>
                  
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
