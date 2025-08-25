import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Brain, Sparkles, MessageCircle, Target, 
  Zap, Users, Star, ArrowLeft
} from 'lucide-react';
import CoachChat from '@/components/coach/CoachChat';

interface CoachType {
  id: 'emotional' | 'wellness' | 'mindfulness' | 'general';
  name: string;
  role: string;
  avatar: string;
  description: string;
  specialties: string[];
  color: string;
  bgColor: string;
}

const coaches: CoachType[] = [
  {
    id: 'emotional',
    name: 'Emma',
    role: 'Coach Émotionnel',
    avatar: '🧘‍♀️',
    description: 'Spécialisée dans la gestion des émotions, l\'anxiété et le développement de la résilience émotionnelle.',
    specialties: ['Gestion du stress', 'Anxiété', 'Confiance en soi', 'Intelligence émotionnelle'],
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
  {
    id: 'wellness',
    name: 'Alex',
    role: 'Coach Bien-être',
    avatar: '🌟',
    description: 'Expert en lifestyle sain, habitudes de vie et équilibre travail-vie personnelle.',
    specialties: ['Habitudes saines', 'Équilibre vie-travail', 'Motivation', 'Objectifs de vie'],
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    id: 'mindfulness',
    name: 'Sophia',
    role: 'Coach Mindfulness',
    avatar: '🧘',
    description: 'Guide experte en méditation, pleine conscience et développement spirituel.',
    specialties: ['Méditation', 'Pleine conscience', 'Spiritualité', 'Lâcher-prise'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'general',
    name: 'Jordan',
    role: 'Coach Personnel',
    avatar: '💭',
    description: 'Accompagnement personnalisé et écoute active pour tous types de défis personnels.',
    specialties: ['Écoute active', 'Développement personnel', 'Prise de décision', 'Clarification'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  }
];

const CoachPage: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<CoachType | null>(null);

  if (selectedCoach) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCoach(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux coaches
          </Button>
          
          <div className={`${selectedCoach.bgColor} rounded-lg p-6 mb-6`}>
            <div className="flex items-center gap-4">
              <div className="text-6xl">{selectedCoach.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedCoach.name}
                </h1>
                <p className={`text-lg font-medium ${selectedCoach.color} mb-2`}>
                  {selectedCoach.role}
                </p>
                <p className="text-muted-foreground max-w-2xl">
                  {selectedCoach.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CoachChat 
          coachType={selectedCoach.id} 
          showVoice={true}
          className="max-w-4xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Vos Coaches IA Personnels
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez nos coaches IA spécialisés, disponibles 24/7 pour vous accompagner 
          dans votre développement personnel et votre bien-être émotionnel.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {coaches.map((coach) => (
          <Card 
            key={coach.id} 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${coach.bgColor}`}
            onClick={() => setSelectedCoach(coach)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{coach.avatar}</div>
                  <div>
                    <CardTitle className="text-xl">{coach.name}</CardTitle>
                    <CardDescription className={`font-medium ${coach.color}`}>
                      {coach.role}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  Disponible
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {coach.description}
              </p>
              
              <Button 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCoach(coach);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Commencer une conversation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoachPage;