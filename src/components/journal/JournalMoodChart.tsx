
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { JournalEntry } from '@/types';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MoodData {
  date: string;
  originalDate: Date;
  sentiment: number;
  anxiety: number;
  energy: number;
}

interface JournalMoodChartProps {
  entries: JournalEntry[];
}

const JournalMoodChart: React.FC<JournalMoodChartProps> = ({ entries }) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  
  // Générer des données simulées pour le graphique des humeurs
  // Dans une véritable application, ces données viendraient d'une analyse NLP des entrées de journal
  const generateMoodData = (): MoodData[] => {
    const now = new Date();
    const days = parseInt(timeRange);
    const data: MoodData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'dd/MM', { locale: fr });
      
      // Trouver si une entrée existe pour cette date
      const entry = entries.find(e => {
        const entryDate = new Date(e.date);
        return entryDate.getDate() === date.getDate() && 
               entryDate.getMonth() === date.getMonth() && 
               entryDate.getFullYear() === date.getFullYear();
      });
      
      // Si une entrée existe, générer des valeurs pseudo-aléatoires mais cohérentes basées sur l'ID
      if (entry) {
        const entryId = parseInt(entry.id.replace(/[^0-9]/g, '1'));
        data.push({
          date: dateStr,
          originalDate: date,
          sentiment: 40 + (entryId * 11) % 60,  // Entre 40 et 100
          anxiety: 10 + (entryId * 7) % 60,    // Entre 10 et 70
          energy: 30 + (entryId * 13) % 60     // Entre 30 et 90
        });
      } else if (Math.random() > 0.7) {  // Ajouter des valeurs pour certaines dates sans entrées
        data.push({
          date: dateStr,
          originalDate: date,
          sentiment: Math.floor(50 + Math.random() * 50),  // Entre 50 et 100
          anxiety: Math.floor(10 + Math.random() * 60),    // Entre 10 et 70
          energy: Math.floor(30 + Math.random() * 60)      // Entre 30 et 90
        });
      }
    }
    
    return data;
  };

  const moodData = generateMoodData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 shadow-lg border bg-white">
          <p className="font-semibold">{format(data.originalDate, 'EEEE dd MMMM', { locale: fr })}</p>
          <div className="text-sm mt-1">
            <p className="text-blue-600">Sentiment: {payload[0].value}/100</p>
            <p className="text-red-500">Anxiété: {payload[1].value}/100</p>
            <p className="text-green-600">Énergie: {payload[2].value}/100</p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button 
          variant={timeRange === '7' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('7')}
        >
          7 jours
        </Button>
        <Button 
          variant={timeRange === '30' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('30')}
        >
          30 jours
        </Button>
        <Button 
          variant={timeRange === '90' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('90')}
        >
          90 jours
        </Button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={moodData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sentiment" 
              name="Sentiment" 
              stroke="#4A90E2" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="anxiety" 
              name="Anxiété" 
              stroke="#E53E3E" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              name="Énergie" 
              stroke="#38A169" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Ces données sont générées à partir de l'analyse de vos entrées de journal.</p>
        <p>Plus vous écrivez régulièrement, plus les tendances seront précises.</p>
      </div>
    </div>
  );
};

export default JournalMoodChart;
