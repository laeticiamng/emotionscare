
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmotionScanCardProps {
  className?: string;
  style?: React.CSSProperties;
}

const EmotionScanCard: React.FC<EmotionScanCardProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data for the emotion trend chart (7 days)
  const emotionData = [
    { day: 'Lun', score: 65 },
    { day: 'Mar', score: 75 },
    { day: 'Mer', score: 68 },
    { day: 'Jeu', score: 82 },
    { day: 'Ven', score: 78 },
    { day: 'Sam', score: 87 },
    { day: 'Dim', score: 83 },
  ];

  return (
    <Card className={`${className} bg-gradient-to-br from-pastel-blue/30 to-white border-white/50`} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-cocoon-600" />
          Scan émotionnel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Votre état actuel</h3>
              <p className="text-xl font-semibold">Calme</p>
              <p className="text-sm text-muted-foreground">Basé sur votre dernier scan</p>
            </div>
            
            <Button
              onClick={() => navigate('/scan')}
              className="bg-cocoon-500 hover:bg-cocoon-600 text-white rounded-full"
              disabled={isLoading}
            >
              Nouveau check-in émotionnel <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="flex-1 h-[200px]">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tendance sur 7 jours</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, 'Score']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanCard;
