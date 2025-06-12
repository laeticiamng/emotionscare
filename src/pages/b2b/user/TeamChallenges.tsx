import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Calendar, Target, Star } from 'lucide-react';

const TeamChallenges = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeChallenges = [
    {
      id: 1,
      title: "Méditation en équipe",
      description: "Effectuer 5 séances de méditation cette semaine",
      participants: 18,
      totalMembers: 25,
      progress: 72,
      timeLeft: "3 jours",
      reward: "100 points + Badge Zen",
      difficulty: "Facile",
      category: "Mindfulness"
    },
    {
      id: 2,
      title: "Challenge VR Innovation",
      description: "Explorer 3 nouveaux environnements VR par équipe",
      participants: 12,
      totalMembers: 25,
      progress: 45,
      timeLeft: "5 jours",
      reward: "200 points + Badge Explorer",
      difficulty: "Moyen",
      category: "VR"
    }
  ];

  const completedChallenges = [
    {
      id: 3,
      title: "Scan émotionnel quotidien",
      completedAt: "Il y a 2 jours",
      reward: "150 points",
      rank: 2
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Facile: "bg-green-100 text-green-800",
      Moyen: "bg-yellow-100 text-yellow-800",
      Difficile: "bg-red-100 text-red-800"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Mindfulness: "bg-purple-100 text-purple-800",
      VR: "bg-blue-100 text-blue-800",
      Scan: "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Challenges Équipe</h1>
        <p className="text-muted-foreground">
          Participez aux défis collaboratifs et renforcez la cohésion d'équipe
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'active' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('active')}
        >
          <Target className="h-4 w-4 mr-1" />
          Actifs
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('completed')}
        >
          <Trophy className="h-4 w-4 mr-1" />
          Terminés
        </Button>
      </div>

      {activeTab === 'active' && (
        <div className="grid gap-6">
          {activeChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {challenge.title}
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(challenge.category)}
                      >
                        {challenge.category}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={getDifficultyColor(challenge.difficulty)}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participants}/{challenge.totalMembers} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{challenge.timeLeft} restants</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression équipe</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{challenge.reward}</span>
                  </div>
                  <Button size="sm">
                    Participer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="grid gap-4">
          {completedChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Terminé {challenge.completedAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">#{challenge.rank}</span>
                    </div>
                    <Badge variant="secondary">{challenge.reward}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamChallenges;