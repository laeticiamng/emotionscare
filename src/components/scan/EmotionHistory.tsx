
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Emotion } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineBody,
  TimelineContent,
} from "@/components/ui/timeline";
import { Badge } from '@/components/ui/badge';
import { Sparkles, Frown, Smile, Meh } from 'lucide-react';

interface EmotionHistoryProps {
  history: Emotion[];
}

const EmotionHistory = ({ history }: EmotionHistoryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (history.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Historique des scans</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Aucun scan émotionnel enregistré pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  // Préparer les données pour le graphique
  const chartData = history.slice(0, 7).map(entry => ({
    date: format(new Date(entry.date), 'dd/MM'),
    score: entry.score || calculateScoreFromIntensity(entry.emotion, entry.intensity)
  })).reverse();
  
  // Préparer les données pour la liste
  const listData = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Helper pour calculer un score à partir de l'émotion et de l'intensité si le score n'existe pas
  function calculateScoreFromIntensity(emotion: string, intensity: number): number {
    const positiveEmotions = ['happy', 'joy', 'calm', 'relaxed'];
    if (positiveEmotions.includes(emotion.toLowerCase())) {
      return 50 + (intensity * 5); // Score entre 55-100 pour émotions positives
    } else {
      return 50 - (intensity * 5); // Score entre 0-45 pour émotions négatives
    }
  }

  // Helper pour déterminer l'icône en fonction du score
  const getEmotionIcon = (emotion: Emotion) => {
    const score = emotion.score || calculateScoreFromIntensity(emotion.emotion, emotion.intensity);
    if (score >= 70) return <Smile className="h-5 w-5 text-green-500" />;
    if (score >= 40) return <Meh className="h-5 w-5 text-amber-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  // Helper pour déterminer la couleur du badge en fonction du score
  const getEmotionColor = (emotion: Emotion) => {
    const score = emotion.score || calculateScoreFromIntensity(emotion.emotion, emotion.intensity);
    if (score >= 70) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (score >= 40) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Historique des scans</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Graphique d'évolution du score émotionnel */}
        <div className="h-[250px] mb-8" aria-label="Graphique d'évolution du score émotionnel">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" name="Score émotionnel" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Timeline des derniers scans */}
        <h3 className="text-lg font-medium mb-4">Dernières analyses</h3>
        <Timeline>
          {listData.map((entry) => (
            <TimelineItem key={entry.id}>
              <TimelineHeader>
                <TimelineIcon>
                  {getEmotionIcon(entry)}
                </TimelineIcon>
                <TimelineTitle className="flex items-center justify-between">
                  <span>
                    {format(new Date(entry.date), 'EEEE d MMMM', { locale: fr })}
                  </span>
                  <Badge className={getEmotionColor(entry)}>
                    {entry.score || calculateScoreFromIntensity(entry.emotion, entry.intensity)}/100
                  </Badge>
                </TimelineTitle>
              </TimelineHeader>
              <TimelineContent>
                <TimelineBody className="text-sm text-muted-foreground">
                  {entry.text || "Aucune note pour ce scan."}
                </TimelineBody>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => navigate(`/scan/${user?.id || '0'}`)}
                    className="text-xs flex items-center gap-1 text-primary hover:underline transition-all"
                    aria-label="Voir le détail du scan"
                  >
                    <span>Voir le détail</span>
                    <Sparkles className="h-3 w-3" />
                  </button>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
