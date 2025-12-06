// @ts-nocheck

// @ts-nocheck
import React, { useMemo } from 'react';
import { JournalEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';
import { format, subDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalMoodViewProps {
  entries: JournalEntry[];
}

const JournalMoodView: React.FC<JournalMoodViewProps> = ({ entries }) => {
  // Statistiques des émotions
  const emotionStats = useMemo(() => {
    if (!entries.length) return [];
    
    const stats: Record<string, number> = {};
    
    entries.forEach(entry => {
      const emotion = entry.mood || entry.emotion || 'neutral';
      stats[emotion] = (stats[emotion] || 0) + 1;
    });
    
    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
      icon: getEmotionIcon(name),
      color: getEmotionColor(name).split(' ')[0].replace('bg-', '') // Extraire la couleur principale
    }));
  }, [entries]);

  // Données pour le graphique des tendances des 7 derniers jours
  const weeklyTrendData = useMemo(() => {
    if (!entries.length) return [];
    
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    
    const dayData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayName = format(day, 'E', { locale: fr });
      
      // Trouver les entrées pour ce jour
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return format(entryDate, 'yyyy-MM-dd') === dayStr;
      });
      
      // Calculer le score moyen d'humeur pour ce jour
      let avgScore = 0;
      if (dayEntries.length) {
        avgScore = dayEntries.reduce((sum, entry) => sum + (entry.mood_score || 50), 0) / dayEntries.length;
      }
      
      return {
        day: dayName,
        date: dayStr,
        score: avgScore,
        count: dayEntries.length
      };
    });
    
    return dayData;
  }, [entries]);
  
  // Statistiques par période
  const getTimePeriodStats = (days: number) => {
    const today = new Date();
    const startDate = subDays(today, days);
    
    const periodEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: startDate, end: today });
    });
    
    const totalEntries = periodEntries.length;
    const avgScore = totalEntries ? 
      periodEntries.reduce((sum, entry) => sum + (entry.mood_score || 50), 0) / totalEntries : 0;
    
    // Émotion dominante
    const emotionCount: Record<string, number> = {};
    periodEntries.forEach(entry => {
      const emotion = entry.mood || entry.emotion || 'neutral';
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
    });
    
    let dominantEmotion = 'neutral';
    let maxCount = 0;
    
    Object.entries(emotionCount).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });
    
    return {
      totalEntries,
      avgScore: Math.round(avgScore),
      dominantEmotion,
      dominantEmotionIcon: getEmotionIcon(dominantEmotion)
    };
  };
  
  const weekStats = getTimePeriodStats(7);
  const monthStats = getTimePeriodStats(30);

  // Couleurs pour le graphique en camembert
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BDA', '#FF6B6B', '#4ECDC4', '#F8EDEB'];

  return (
    <div className="space-y-6">
      {/* Statistiques résumées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total des entrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Émotion dominante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {monthStats.dominantEmotionIcon} {monthStats.dominantEmotion}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekStats.totalEntries} entrées</div>
            <p className="text-xs text-muted-foreground">Score moyen: {weekStats.avgScore}/100</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthStats.totalEntries} entrées</div>
            <p className="text-xs text-muted-foreground">Score moyen: {monthStats.avgScore}/100</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques d'analyse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution des émotions */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des émotions</CardTitle>
          </CardHeader>
          <CardContent>
            {emotionStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emotionStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emotionStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color ? `var(--${entry.color}-500)` : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} entrées`, 'Fréquence']}
                    labelFormatter={(name) => `Émotion: ${name}`} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Pas assez de données pour afficher des statistiques.
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Tendances des 7 derniers jours */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances des 7 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyTrendData.some(day => day.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'score') return [`${value}/100`, 'Score moyen'];
                      return [`${value}`, 'Nombre d\'entrées'];
                    }}
                    labelFormatter={(day) => `Jour: ${day}`}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="score" name="Score d'humeur" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="count" name="Nombre d'entrées" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Pas assez de données pour afficher des tendances.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Conseils basés sur les données */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils personnalisés</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="prose dark:prose-invert max-w-none">
              <p>
                Basé sur vos {entries.length} entrées de journal, voici quelques observations et conseils :
              </p>
              
              <ul className="space-y-2">
                {weekStats.avgScore < 40 && (
                  <li>
                    Votre score moyen d'humeur cette semaine est assez bas ({weekStats.avgScore}/100). 
                    Pensez à pratiquer des activités qui vous apportent de la joie.
                  </li>
                )}
                
                {weekStats.avgScore >= 40 && weekStats.avgScore < 70 && (
                  <li>
                    Votre score moyen d'humeur cette semaine est modéré ({weekStats.avgScore}/100). 
                    Continuez vos efforts tout en accordant du temps à votre bien-être.
                  </li>
                )}
                
                {weekStats.avgScore >= 70 && (
                  <li>
                    Votre score moyen d'humeur cette semaine est excellent ({weekStats.avgScore}/100)! 
                    Continuez vos habitudes positives.
                  </li>
                )}
                
                {weekStats.dominantEmotion === 'stressed' || weekStats.dominantEmotion === 'anxious' && (
                  <li>
                    L'émotion {weekStats.dominantEmotion} est prédominante cette semaine. 
                    Essayez des techniques de respiration ou de méditation pour réduire le stress.
                  </li>
                )}
                
                {weekStats.totalEntries < 3 && (
                  <li>
                    Vous avez enregistré peu d'entrées cette semaine ({weekStats.totalEntries}). 
                    Essayez de noter régulièrement vos émotions pour un meilleur suivi.
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Commencez à enregistrer vos émotions pour obtenir des conseils personnalisés.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalMoodView;
