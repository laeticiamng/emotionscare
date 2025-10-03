
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Brain, Zap, Compass } from 'lucide-react';

interface CoachPersonality {
  id: string;
  name: string;
  avatar: string;
  style: 'supportive' | 'motivational' | 'analytical' | 'empathetic';
  description: string;
  specialties: string[];
  color: string;
  icon: React.ReactNode;
}

interface CoachPersonalitySelectorProps {
  selectedPersonality?: string;
  onSelect: (personality: CoachPersonality) => void;
}

const CoachPersonalitySelector: React.FC<CoachPersonalitySelectorProps> = ({
  selectedPersonality,
  onSelect
}) => {
  const personalities: CoachPersonality[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '/avatars/emma.jpg',
      style: 'empathetic',
      description: 'Douce et compréhensive, Emma excelle dans l\'écoute active et le soutien émotionnel.',
      specialties: ['Gestion des émotions', 'Stress', 'Anxiété', 'Relations'],
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '/avatars/alex.jpg',
      style: 'motivational',
      description: 'Énergique et inspirant, Alex vous pousse à dépasser vos limites et atteindre vos objectifs.',
      specialties: ['Motivation', 'Objectifs', 'Performance', 'Confiance en soi'],
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: 'sophie',
      name: 'Sophie',
      avatar: '/avatars/sophie.jpg',
      style: 'analytical',
      description: 'Méthodique et structurée, Sophie utilise des données pour personnaliser votre parcours.',
      specialties: ['Analyse comportementale', 'Habitudes', 'Productivité', 'Planification'],
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: 'maxime',
      name: 'Maxime',
      avatar: '/avatars/maxime.jpg',
      style: 'supportive',
      description: 'Bienveillant et patient, Maxime vous accompagne à votre rythme sans jugement.',
      specialties: ['Développement personnel', 'Méditation', 'Mindfulness', 'Équilibre'],
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: <Compass className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choisissez votre coach personnel</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez la personnalité qui correspond le mieux à vos besoins et préférences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality) => (
          <Card 
            key={personality.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPersonality === personality.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-muted-foreground/30'
            }`}
            onClick={() => onSelect(personality)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={personality.avatar} alt={personality.name} />
                  <AvatarFallback className={personality.color}>
                    {personality.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{personality.name}</CardTitle>
                  <Badge variant="secondary" className={`text-xs ${personality.color}`}>
                    {personality.style === 'empathetic' && 'Empathique'}
                    {personality.style === 'motivational' && 'Motivant'}
                    {personality.style === 'analytical' && 'Analytique'}
                    {personality.style === 'supportive' && 'Bienveillant'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {personality.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium">Spécialités :</p>
                <div className="flex flex-wrap gap-1">
                  {personality.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedPersonality === personality.id && (
                <div className="mt-3 p-2 bg-primary/10 rounded-md">
                  <p className="text-xs text-primary font-medium">
                    ✓ Coach sélectionné
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Vous pourrez changer de coach à tout moment dans vos paramètres.
        </p>
      </div>
    </div>
  );
};

export default CoachPersonalitySelector;
