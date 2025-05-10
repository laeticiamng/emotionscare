
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

interface GamificationWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  onToggle?: () => void;
  userId?: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ 
  className, 
  style,
  collapsed,
  onToggle,
  userId
}) => {
  const navigate = useNavigate();
  
  // Sample data for challenges and badges
  const streakCount = 5;
  const challenges = [
    { id: '1', title: 'Check-in émotionnel', completed: true },
    { id: '2', title: 'Partager dans Social Cocoon', completed: false },
    { id: '3', title: 'Utiliser Coach IA', completed: true }
  ];
  
  const badgeProgress = 75; // Percentage towards next badge

  return (
    <Card className={`${className} bg-gradient-to-br from-pastel-orange/30 to-white border-white/50`} style={style}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-cocoon-600" />
            Gamification
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-medium bg-pastel-green/50 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4 text-wellness-green" />
            <span>{streakCount} jours consécutifs</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Défis quotidiens</h3>
          <div className="space-y-2">
            {challenges.map(challenge => (
              <div 
                key={challenge.id} 
                className={`flex items-center justify-between p-3 rounded-xl ${
                  challenge.completed ? 'bg-pastel-green/30' : 'bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    challenge.completed ? 'bg-wellness-green text-white' : 'border border-slate-300'
                  }`}>
                    {challenge.completed && <CheckCircle size={14} />}
                  </div>
                  <span className="text-sm">{challenge.title}</span>
                </div>
                {!challenge.completed && (
                  <Button variant="ghost" size="sm" className="text-xs h-7 rounded-full">
                    Compléter
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Prochain badge</h3>
          <div className="bg-white/70 p-3 rounded-xl flex items-center gap-4">
            <div className="bg-pastel-purple/30 p-2 rounded-full">
              <Award className="h-6 w-6 text-cocoon-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Badge "Bien-être"</span>
                <span className="text-xs">{badgeProgress}%</span>
              </div>
              <Progress value={badgeProgress} className="h-2" />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/gamification')}
          variant="ghost" 
          className="w-full rounded-full border border-cocoon-200 hover:bg-white"
        >
          Voir tous les badges <ArrowRight size={14} className="ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;
