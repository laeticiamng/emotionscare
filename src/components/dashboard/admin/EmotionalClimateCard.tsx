
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

interface EmotionalClimateCardProps {
  emotionalScoreTrend?: Array<{ date: string; value: number }>;
}

const EmotionalClimateCard: React.FC<EmotionalClimateCardProps> = ({ emotionalScoreTrend = [] }) => {
  // Calculate current average score
  const currentScore = emotionalScoreTrend.length > 0 
    ? emotionalScoreTrend[emotionalScoreTrend.length - 1].value 
    : 75.5; // Default fallback value
  
  return (
    <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-[#1B365D]" />
          Score émotionnel moyen
        </CardTitle>
        <CardDescription>
          Évolution du bien-être collectif
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-semibold mb-2">
            <CountUp 
              end={currentScore} 
              duration={2} 
              decimals={1} 
              suffix="/100" 
              enableScrollSpy 
              scrollSpyOnce
            />
          </div>
          <Progress value={currentScore} className="h-2 bg-gray-100" />
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emotionalScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FF6F61" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#FF6F61', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalClimateCard;
