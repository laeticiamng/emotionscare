
import React, { useMemo } from 'react';
import { JournalEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDistanceToNow, subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalMoodViewProps {
  entries: JournalEntry[];
}

interface MoodDataPoint {
  date: string;
  rawDate: Date;
  formattedDate: string;
  score: number;
}

const JournalMoodView: React.FC<JournalMoodViewProps> = ({ entries }) => {
  const moodData = useMemo(() => {
    // Filter entries that have a mood_score
    const entriesWithScore = entries.filter(entry => entry.mood_score !== undefined);
    
    // Sort entries by date
    const sortedEntries = [...entriesWithScore].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    return sortedEntries.map(entry => {
      const entryDate = new Date(entry.date);
      return {
        date: format(entryDate, 'yyyy-MM-dd'),
        rawDate: entryDate,
        formattedDate: format(entryDate, 'dd MMM', { locale: fr }),
        score: entry.mood_score || 0
      };
    });
  }, [entries]);

  // Calculate average mood
  const averageMood = useMemo(() => {
    if (moodData.length === 0) return 0;
    const sum = moodData.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / moodData.length);
  }, [moodData]);

  // Get the mood trend (up, down or stable)
  const moodTrend = useMemo(() => {
    if (moodData.length < 2) return 'stable';
    const firstHalf = moodData.slice(0, Math.floor(moodData.length / 2));
    const secondHalf = moodData.slice(Math.floor(moodData.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((acc, curr) => acc + curr.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, curr) => acc + curr.score, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 5) return 'up';
    if (secondHalfAvg < firstHalfAvg - 5) return 'down';
    return 'stable';
  }, [moodData]);

  // Calculate most common mood
  const mostCommonMood = useMemo(() => {
    const moodCounts = entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    let maxCount = 0;
    let maxMood = '';
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMood = mood;
      }
    });
    
    return maxMood;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Aucune donnée émotionnelle à afficher pour l'instant.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Humeur moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMood}/100</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {moodTrend === 'up' && (
                <>En hausse <span className="text-green-500 ml-2">↑</span></>
              )}
              {moodTrend === 'down' && (
                <>En baisse <span className="text-red-500 ml-2">↓</span></>
              )}
              {moodTrend === 'stable' && (
                <>Stable <span className="text-blue-500 ml-2">→</span></>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Humeur fréquente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{mostCommonMood}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de votre humeur</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="formattedDate" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, 'Humeur']}
                  labelFormatter={(label) => `Date: ${label}`} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Niveau d'humeur"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="h-full flex items-center justify-center text-muted-foreground">
              Pas assez de données pour afficher un graphique.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalMoodView;
