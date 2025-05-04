
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Emotion } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
    score: entry.score
  })).reverse();
  
  // Préparer les données pour la liste
  const listData = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Historique des scans</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Graphique d'évolution du score émotionnel */}
        <div className="h-[250px] mb-8">
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
        
        {/* Liste des derniers scans */}
        <h3 className="text-lg font-medium mb-4">Derniers scans</h3>
        <div className="space-y-3">
          {listData.map((entry) => (
            <div 
              key={entry.id}
              onClick={() => navigate(`/scan/${user?.id || '0'}`)}
              className="flex items-center justify-between p-3 bg-background hover:bg-accent/50 rounded-lg cursor-pointer"
            >
              <div>
                <div className="font-medium">
                  Score: <span className="text-primary">{entry.score}/100</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(entry.date), 'PPPP à HH:mm', { locale: fr })}
                </div>
              </div>
              <div className="text-sm">
                {entry.text && entry.text.length > 30 
                  ? `${entry.text.substring(0, 30)}...` 
                  : entry.text}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
