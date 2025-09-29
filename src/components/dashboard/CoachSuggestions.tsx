
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, BookOpen, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockSuggestions = [
  {
    id: '1',
    title: 'Exercice de respiration',
    description: 'Une courte séance de respiration consciente pour réduire le stress',
    icon: Heart,
    link: '/coach/breathing'
  },
  {
    id: '2',
    title: 'Méditation guidée',
    description: 'Une méditation de 5 minutes pour se recentrer',
    icon: BookOpen,
    link: '/coach/meditation'
  },
  {
    id: '3',
    title: 'Musique relaxante',
    description: 'Une playlist adaptée à votre état émotionnel actuel',
    icon: Music,
    link: '/music'
  }
];

const CoachSuggestions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Suggestions du coach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSuggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            
            return (
              <div 
                key={suggestion.id} 
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent hover:cursor-pointer transition-colors"
                onClick={() => navigate(suggestion.link)}
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
                
                <Button variant="ghost" size="icon" className="rounded-full h-6 w-6">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
          
          {mockSuggestions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Aucune suggestion disponible pour le moment</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate('/coach')}
              >
                Consulter le coach
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachSuggestions;
