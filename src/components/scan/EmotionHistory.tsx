
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getEmotionHistory } from '@/lib/scanService';
import LoadingAnimation from '@/components/ui/loading-animation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmotionHistoryProps {
  userId?: string; // Make userId optional to match usage in ScanPage
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ userId }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true);
        const userEmotions = await getEmotionHistory();
        setEmotions(userEmotions);
      } catch (error) {
        console.error('Error fetching emotion history:', error);
        toast({
          title: 'Erreur',
          description: "Impossible de charger l'historique des émotions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, [userId, toast]);

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the entry
    setEmotions(emotions.filter(emotion => emotion.id !== id));
    toast({
      title: 'Scan supprimé',
      description: "L'entrée a été supprimée de votre historique"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingAnimation text="Chargement de l'historique..." />
      </div>
    );
  }

  const getEmotionColor = (emotionName: string) => {
    const emotionColors: {[key: string]: string} = {
      'calme': 'bg-blue-100 text-blue-800',
      'heureux': 'bg-green-100 text-green-800',
      'joyeux': 'bg-green-100 text-green-800',
      'stressé': 'bg-orange-100 text-orange-800',
      'anxieux': 'bg-red-100 text-red-800',
      'concentré': 'bg-purple-100 text-purple-800',
      'fatigué': 'bg-amber-100 text-amber-800'
    };
    
    return emotionColors[emotionName.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="shadow-md rounded-3xl overflow-hidden">
      <CardHeader>
        <h3 className="text-xl font-semibold">Historique des Scans Émotionnels</h3>
      </CardHeader>
      <CardContent className="p-0">
        {emotions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Aucun scan émotionnel enregistré.
          </div>
        ) : (
          <div className="divide-y">
            {emotions.map((emotion) => (
              <div key={emotion.id} className="group p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getScoreColor(emotion.score)}`}></div>
                    <div>
                      <span className="font-medium">
                        {format(new Date(emotion.date), 'EEEE d MMMM', { locale: fr })}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {format(new Date(emotion.date), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(emotion.emotion || emotion.dominant_emotion || '')}`}>
                      {emotion.emotion || emotion.dominant_emotion}
                    </span>
                    <span className="text-sm px-2 py-1 bg-slate-100 rounded-full">{emotion.score}%</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(emotion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {emotion.text && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-sm mt-2">{emotion.text}</p>
                  </>
                )}
                
                {emotion.ai_feedback && (
                  <div className="mt-3 text-sm bg-blue-50 p-3 rounded-lg text-blue-800">
                    <span className="font-medium">Feedback IA:</span> {emotion.ai_feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
