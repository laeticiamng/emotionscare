
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DraggableKpiCardsGrid, { DraggableCardProps } from "../draggable/DraggableKpiCardsGrid";
import TeamEmotionCard from '../cards/TeamEmotionCard';
import ActivityChart from '../charts/ActivityChart';
import EmotionTrendChart from '../charts/EmotionTrendChart';
import TeamLeaderboardCard from '../cards/TeamLeaderboardCard';
import { Users, Brain, Clock, TrendingUp } from 'lucide-react';

const GlobalOverviewTab: React.FC = () => {
  const kpiCards: DraggableCardProps[] = [
    {
      id: "active-users",
      title: "Utilisateurs actifs",
      value: 87,
      icon: <Users className="h-4 w-4" />,
      change: { value: 12, trend: "up" },
      status: 'positive',
      color: "primary"
    },
    {
      id: "emotion-score",
      title: "Score émotionnel",
      value: 76,
      icon: <Brain className="h-4 w-4" />,
      change: { value: 5, trend: "up" },
      status: 'positive',
      color: "secondary"
    },
    {
      id: "avg-session",
      title: "Temps moyen",
      value: "12m",
      icon: <Clock className="h-4 w-4" />,
      change: { value: 2, trend: "down" },
      status: 'negative',
      color: "warning"
    },
    {
      id: "engagement",
      title: "Taux d'engagement",
      value: "68%",
      icon: <TrendingUp className="h-4 w-4" />,
      change: { value: 8, trend: "up" },
      status: 'positive',
      color: "info"
    }
  ];

  const emotionTrendData = [
    { date: "Lun", Calme: 20, Stress: 10, Joie: 15, Fatigue: 5 },
    { date: "Mar", Calme: 15, Stress: 20, Joie: 10, Fatigue: 8 },
    { date: "Mer", Calme: 25, Stress: 15, Joie: 20, Fatigue: 5 },
    { date: "Jeu", Calme: 22, Stress: 18, Joie: 17, Fatigue: 10 },
    { date: "Ven", Calme: 30, Stress: 10, Joie: 25, Fatigue: 5 },
  ];

  const emotions = [
    { name: "Calme", value: 45, color: "#8884d8" },
    { name: "Joie", value: 25, color: "#82ca9d" },
    { name: "Stress", value: 20, color: "#ffc658" },
    { name: "Fatigue", value: 10, color: "#ff8042" }
  ];

  const activityData = [
    { date: "10/05", value: 45 },
    { date: "11/05", value: 52 },
    { date: "12/05", value: 49 },
    { date: "13/05", value: 60 },
    { date: "14/05", value: 55 },
    { date: "15/05", value: 58 },
    { date: "16/05", value: 62 }
  ];

  const teamMembers = [
    { 
      id: "1", 
      name: "Sophie Martin", 
      avatar: "",
      department: "Marketing", 
      score: 87, 
      change: 5 
    },
    { 
      id: "2", 
      name: "Thomas Dubois", 
      avatar: "",
      department: "Développement", 
      score: 82, 
      change: 8 
    },
    { 
      id: "3", 
      name: "Julie Lefebvre", 
      avatar: "",
      department: "Design", 
      score: 79, 
      change: 2 
    },
    { 
      id: "4", 
      name: "Nicolas Bernard", 
      avatar: "",
      department: "RH", 
      score: 76, 
      change: -3 
    },
    { 
      id: "5", 
      name: "Camille Rousseau", 
      avatar: "",
      department: "Finance", 
      score: 72, 
      change: 4 
    }
  ];

  const emotionTrendColors = [
    { name: "Calme", color: "#8884d8" },
    { name: "Stress", color: "#ffc658" },
    { name: "Joie", color: "#82ca9d" },
    { name: "Fatigue", color: "#ff8042" }
  ];

  return (
    <div className="space-y-6">
      <DraggableKpiCardsGrid kpiCards={kpiCards} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tendance émotionnelle</CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionTrendChart 
              data={emotionTrendData} 
              emotions={emotionTrendColors}
              height={240}
            />
          </CardContent>
        </Card>
        
        <TeamEmotionCard emotions={emotions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Activité hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={activityData} height={240} />
          </CardContent>
        </Card>
        
        <TeamLeaderboardCard members={teamMembers} />
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
