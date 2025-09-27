import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Calendar,
  Brain,
  Heart,
  Lightbulb,
  CheckCircle
} from "lucide-react";

const B2BUserCoachPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState(false);

  const coachingPrograms = [
    {
      id: 1,
      title: "Gestion du Stress",
      description: "Programme personnalisé pour réduire votre niveau de stress",
      progress: 65,
      sessions: 8,
      completedSessions: 5,
      icon: Brain,
      color: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      title: "Communication Efficace",
      description: "Améliorer vos compétences en communication interpersonnelle",
      progress: 40,
      sessions: 10,
      completedSessions: 4,
      icon: MessageCircle,
      color: "bg-accent/10 text-accent"
    },
    {
      id: 3,
      title: "Leadership Positif",
      description: "Développer votre style de leadership bienveillant",
      progress: 25,
      sessions: 12,
      completedSessions: 3,
      icon: Heart,
      color: "bg-secondary/10 text-secondary"
    }
  ];

  const todaysTips = [
    {
      category: "Productivité",
      tip: "Prenez une pause de 5 minutes toutes les heures pour maintenir votre concentration",
      icon: Target
    },
    {
      category: "Bien-être",
      tip: "Pratiquez 3 respirations profondes avant chaque réunion importante",
      icon: Heart
    },
    {
      category: "Innovation",
      tip: "Notez une idée créative par jour dans un carnet dédié",
      icon: Lightbulb
    }
  ];

  const achievements = [
    { name: "7 jours consécutifs", completed: true },
    { name: "Module stress complété", completed: true },
    { name: "Objectif communication", completed: false },
    { name: "Mentor de l'équipe", completed: false }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Mon Coach Personnel
            </h1>
            <p className="text-muted-foreground mt-2">
              Votre accompagnement personnalisé pour le développement professionnel
            </p>
          </div>
          <Button 
            onClick={() => setActiveConversation(true)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Nouvelle Session
          </Button>
        </div>

        {/* Coaching Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {coachingPrograms.map((program) => {
            const IconComponent = program.icon;
            return (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${program.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">
                      {program.completedSessions}/{program.sessions} sessions
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {program.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Continuer le Programme
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Tips and Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Conseils du Jour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {tip.category}
                      </Badge>
                      <p className="text-sm">{tip.tip}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Schedule & Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Prochaines Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Session Gestion du Stress</p>
                    <p className="text-sm text-muted-foreground">Aujourd'hui, 14h30</p>
                  </div>
                  <Button size="sm">Rejoindre</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Coaching Communication</p>
                    <p className="text-sm text-muted-foreground">Demain, 10h00</p>
                  </div>
                  <Button size="sm" variant="outline">Planifié</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Accomplissements
                </h4>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle 
                        className={`h-4 w-4 ${
                          achievement.completed 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                      <span className={`text-sm ${
                        achievement.completed 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        {activeConversation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Session de Coaching Live
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-xs">
                      Bonjour ! Comment vous sentez-vous aujourd'hui au travail ?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-accent text-accent-foreground rounded-lg px-3 py-2 max-w-xs">
                      Un peu stressé avec le nouveau projet, mais motivé !
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-xs">
                      C'est normal de se sentir ainsi. Parlons des techniques de gestion du stress que nous avons vues...
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Tapez votre message..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <Button>Envoyer</Button>
                <Button 
                  variant="outline"
                  onClick={() => setActiveConversation(false)}
                >
                  Terminer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default B2BUserCoachPage;