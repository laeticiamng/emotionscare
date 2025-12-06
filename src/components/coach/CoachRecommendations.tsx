import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MessageCircle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoachRecommendationsProps {
  collapsed: boolean;
  onToggle: () => void;
  emotion?: string;
}

const CoachRecommendations: React.FC<CoachRecommendationsProps> = ({
  collapsed,
  onToggle,
  emotion
}) => {
  const navigate = useNavigate();
  
  // Generate recommendations based on emotion
  const getRecommendationsForEmotion = (emotion?: string) => {
    const baseRecommendations = [
      "Prendre 5 minutes pour respirer profondément",
      "Écouter une musique apaisante",
      "Faire une courte marche dehors"
    ];
    
    if (emotion === 'anxious') {
      return [
        "Pratiquer une méditation de pleine conscience",
        "Faire des exercices de respiration 4-7-8",
        "Écrire vos pensées dans un journal"
      ];
    } else if (emotion === 'energetic') {
      return [
        "Canaliser cette énergie dans une activité créative",
        "Faire une séance d'exercice physique",
        "Établir un plan pour un projet important"
      ];
    }
    
    return baseRecommendations;
  };
  
  const recommendations = getRecommendationsForEmotion(emotion);
  
  if (collapsed) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Recommandations du coach
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Recommandations du coach
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="p-3 bg-muted/20 rounded-lg">
                {recommendation}
              </li>
            ))}
          </ul>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/coach-chat')}
            >
              <MessageCircle className="h-4 w-4" />
              Parler au coach
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
