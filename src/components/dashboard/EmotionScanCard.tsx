// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmotionScanCardProps {
  className?: string;
  style?: React.CSSProperties;
}

const EmotionScanCard: React.FC<EmotionScanCardProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: emotionData = [], isLoading } = useQuery({
    queryKey: ['emotion-scan-trend', user?.id],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('score, created_at')
        .eq('user_id', user?.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const grouped = new Map<string, number[]>();
      for (const row of data) {
        const day = days[new Date(row.created_at).getDay()];
        const arr = grouped.get(day) || [];
        arr.push(row.score ?? 50);
        grouped.set(day, arr);
      }
      return Array.from(grouped.entries()).map(([day, scores]) => ({
        day,
        score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }));
    },
    enabled: !!user?.id,
  });

  const latestScore = emotionData.length > 0 ? emotionData[emotionData.length - 1].score : null;
  const emotionLabel = latestScore !== null
    ? latestScore > 75 ? 'Positif' : latestScore > 50 ? 'Calme' : latestScore > 25 ? 'Neutre' : 'Tendu'
    : 'Aucun scan';

  return (
    <Card className={`${className} bg-gradient-to-br from-primary/10 to-card border-border/50`} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Scan emotionnel
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Votre etat actuel</h3>
              <p className="text-xl font-semibold">{emotionLabel}</p>
              <p className="text-sm text-muted-foreground">Base sur votre dernier scan</p>
            </div>

            <Button
              onClick={() => navigate('/scan')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Nouveau check-in emotionnel <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <div className="flex-1 h-[200px]">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tendance sur 7 jours</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : emotionData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Aucune donnee disponible
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emotionData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    formatter={(value: number) => [`${value}/100`, 'Score']}
                    labelFormatter={(label: string) => `${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanCard;
