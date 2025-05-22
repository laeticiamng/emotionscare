
import React, { useMemo } from 'react';
import { JournalEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface JournalMoodViewProps {
  entries: JournalEntry[];
}

interface EmotionCount {
  name: string;
  count: number;
  color: string;
}

const JournalMoodView: React.FC<JournalMoodViewProps> = ({ entries }) => {
  // Calculate emotion statistics
  const emotionStats = useMemo(() => {
    // Count emotions
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      const emotion = entry.mood || entry.emotion || 'neutral';
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
    
    // Transform into chart data
    const chartData: EmotionCount[] = Object.keys(counts).map(emotion => {
      // Get color based on the emotion
      let colorHex = '#64748b'; // Default color
      
      switch (emotion) {
        case 'joy':
        case 'happy':
          colorHex = '#22c55e';
          break;
        case 'excited':
        case 'proud':
          colorHex = '#f59e0b';
          break;
        case 'calm':
        case 'relaxed':
          colorHex = '#3b82f6';
          break;
        case 'sad':
          colorHex = '#6366f1';
          break;
        case 'angry':
          colorHex = '#ef4444';
          break;
        case 'stressed':
        case 'anxious':
          colorHex = '#f97316';
          break;
        case 'tired':
          colorHex = '#8b5cf6';
          break;
      }
      
      return {
        name: emotion,
        count: counts[emotion],
        color: colorHex
      };
    });
    
    // Sort by count (descending)
    return chartData.sort((a, b) => b.count - a.count);
  }, [entries]);
  
  // Calculate mood over time
  const moodOverTime = useMemo(() => {
    // Group by date
    const entriesByDate: Record<string, JournalEntry[]> = {};
    entries.forEach(entry => {
      const dateStr = new Date(entry.date).toISOString().split('T')[0];
      if (!entriesByDate[dateStr]) {
        entriesByDate[dateStr] = [];
      }
      entriesByDate[dateStr].push(entry);
    });
    
    // Sort dates
    const sortedDates = Object.keys(entriesByDate).sort();
    
    // Calculate average mood score for each date
    return sortedDates.map(dateStr => {
      const dateEntries = entriesByDate[dateStr];
      // Use mood_score if available, otherwise assign a default score based on emotion
      const moodScores = dateEntries.map(entry => {
        if (entry.mood_score !== undefined) {
          return entry.mood_score;
        }
        
        // Assign scores based on common emotions (very simplified)
        const emotion = entry.mood || entry.emotion || 'neutral';
        switch (emotion.toLowerCase()) {
          case 'happy':
          case 'joy':
          case 'excited':
            return 80;
          case 'calm':
          case 'relaxed':
            return 70;
          case 'neutral':
            return 50;
          case 'sad':
          case 'tired':
            return 30;
          case 'angry':
          case 'stressed':
          case 'anxious':
            return 20;
          default:
            return 50;
        }
      });
      
      // Calculate average
      const avgScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
      
      // Format date to be more readable
      const date = new Date(dateStr);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      
      return {
        date: formattedDate,
        score: Math.round(avgScore),
        count: dateEntries.length
      };
    });
  }, [entries]);
  
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground">Aucune donnée à afficher. Commencez à journaliser vos émotions.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution des émotions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {emotionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} entrée${value > 1 ? 's' : ''}`, name]}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex items-center">
                            <span className="mr-2">{getEmotionIcon(data.name)}</span>
                            <span className="font-semibold">{data.name}</span>
                          </div>
                          <p className="text-sm">{data.count} entrée{data.count > 1 ? 's' : ''}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Mood Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution de l'humeur</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodOverTime}>
                <XAxis dataKey="date" />
                <Tooltip
                  formatter={(value) => [`${value}/100`, 'Score d\'humeur']}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      let moodDescription = 'Neutre';
                      let moodColor = 'text-gray-500';
                      
                      if (data.score >= 80) {
                        moodDescription = 'Excellent';
                        moodColor = 'text-green-500';
                      } else if (data.score >= 65) {
                        moodDescription = 'Bien';
                        moodColor = 'text-blue-500';
                      } else if (data.score >= 45) {
                        moodDescription = 'Moyen';
                        moodColor = 'text-amber-500';
                      } else if (data.score >= 25) {
                        moodDescription = 'Pas très bien';
                        moodColor = 'text-orange-500';
                      } else {
                        moodDescription = 'Mauvais';
                        moodColor = 'text-red-500';
                      }
                      
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <p className="font-semibold">{data.date}</p>
                          <p className={`text-sm ${moodColor}`}>
                            Humeur: {moodDescription} ({data.score}/100)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {data.count} entrée{data.count > 1 ? 's' : ''}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {moodOverTime.map((entry, index) => {
                    let barColor = '#64748b'; // Default
                    
                    if (entry.score >= 80) barColor = '#22c55e';
                    else if (entry.score >= 65) barColor = '#3b82f6';
                    else if (entry.score >= 45) barColor = '#f59e0b';
                    else if (entry.score >= 25) barColor = '#f97316';
                    else barColor = '#ef4444';
                    
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Emotion Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Légende des émotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {emotionStats.map((emotion) => (
              <div
                key={emotion.name}
                className={`flex items-center gap-2 p-2 rounded-md ${getEmotionColor(emotion.name)}`}
              >
                <span className="text-xl">{getEmotionIcon(emotion.name)}</span>
                <div>
                  <p className="font-medium capitalize">{emotion.name}</p>
                  <p className="text-xs">{emotion.count} entrée{emotion.count > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalMoodView;
