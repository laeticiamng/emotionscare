// @ts-nocheck

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Clock, UserPlus, CheckCircle2, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CommunityProps {
  isAdmin?: boolean;
}

const CommunityChallenge: React.FC<CommunityProps> = ({ isAdmin = false }) => {
  const { toast } = useToast();
  
  const handleJoinChallenge = (challengeName: string) => {
    toast({
      title: `Félicitations !`,
      description: `Vous avez rejoint le défi "${challengeName}"`,
    });
  };
  
  const challenges = [
    {
      id: 1,
      name: "30 jours de méditation",
      description: "Prenez 5 minutes chaque jour pour méditer en suivant nos guides audio.",
      participants: 142,
      progress: 65,
      daysLeft: 12,
      joined: true,
      badge: "Populaire",
      badgeColor: "bg-amber-500"
    },
    {
      id: 2,
      name: "Respiration collective",
      description: "Rejoignez la session quotidienne de respiration guidée à 12h30.",
      participants: 87,
      progress: 40,
      daysLeft: 21,
      joined: false,
      badge: "Nouveau",
      badgeColor: "bg-blue-500"
    },
    {
      id: 3,
      name: "Journal de gratitude",
      description: "Notez 3 choses pour lesquelles vous êtes reconnaissant chaque jour.",
      participants: 211,
      progress: 80,
      daysLeft: 5,
      joined: true,
      badge: "Derniers jours",
      badgeColor: "bg-rose-500"
    }
  ];

  // Vue admin pour la gestion des challenges
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Challenges en cours</h3>
          <Button variant="outline" size="sm">
            <Trophy className="mr-2 h-4 w-4" />
            Créer un challenge
          </Button>
        </div>
        
        <div className="space-y-4">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{challenge.name}</h4>
                    <Badge className={`${challenge.badgeColor} text-white`}>{challenge.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {challenge.description}
                  </p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col justify-center">
                    <span className="text-lg font-medium">{challenge.participants}</span>
                    <span className="text-xs text-muted-foreground">participants</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Users className="mr-1 h-4 w-4" />
                    Voir détails
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Participation globale</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-1.5" />
              </div>
            </Card>
          ))}
        </div>
        
        <div className="bg-muted/20 p-4 rounded-lg mt-6">
          <h4 className="font-medium mb-2">Statistiques générales</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-xs text-muted-foreground">Engagement moyen</div>
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground">Challenges actifs</div>
            </div>
            <div>
              <div className="text-2xl font-bold">304</div>
              <div className="text-xs text-muted-foreground">Participants totaux</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue utilisateur
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-4 flex items-start">
        <div className="mr-4 mt-1">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Challenges communautaires</h3>
          <p className="text-sm text-muted-foreground">
            Participez à des défis pour améliorer votre bien-être émotionnel. 
            Rejoignez d'autres membres et gagnez des badges exclusifs !
          </p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="overflow-hidden">
            <div className="relative">
              {challenge.badge && (
                <Badge className={`absolute top-3 right-3 ${challenge.badgeColor} text-white`}>
                  {challenge.badge}
                </Badge>
              )}
              
              <div className="p-4">
                <h4 className="font-medium">{challenge.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {challenge.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{challenge.participants} participants</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Reste {challenge.daysLeft} jours</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progression</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-1.5" />
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant={challenge.joined ? "outline" : "default"}
                  onClick={() => !challenge.joined && handleJoinChallenge(challenge.name)}
                >
                  {challenge.joined ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Challenge rejoint
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Rejoindre le challenge
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center">
          <Award className="h-5 w-5 mr-3 text-primary" />
          <div>
            <div className="text-sm font-medium">Mes badges</div>
            <div className="text-xs text-muted-foreground">3 obtenus ce mois-ci</div>
          </div>
        </div>
        <Button variant="ghost" size="sm">Voir tous</Button>
      </div>
    </div>
  );
};

export default CommunityChallenge;
