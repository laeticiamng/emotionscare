
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Brain, Heart, Music, Sunset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModulesSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedMood?: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  collapsed,
  onToggle,
  selectedMood
}) => {
  const navigate = useNavigate();
  
  // Generate modules based on selected mood
  const getModulesForMood = (mood?: string) => {
    const baseModules = [
      {
        id: 'scanner',
        title: 'Scanner émotionnel',
        description: 'Analysez votre état émotionnel',
        icon: Brain,
        route: '/scan',
        color: 'bg-blue-100 dark:bg-blue-900/30'
      },
      {
        id: 'meditation',
        title: 'Méditation guidée',
        description: '5-15 minutes de pratique',
        icon: Heart,
        route: '/meditation',
        color: 'bg-purple-100 dark:bg-purple-900/30'
      },
      {
        id: 'music',
        title: 'Musique adaptative',
        description: 'Sons alignés avec vos émotions',
        icon: Music,
        route: '/music',
        color: 'bg-green-100 dark:bg-green-900/30'
      },
      {
        id: 'breathing',
        title: 'Exercices de respiration',
        description: 'Techniques pour se recentrer',
        icon: Sunset,
        route: '/breathing',
        color: 'bg-amber-100 dark:bg-amber-900/30'
      }
    ];
    
    // In a real app, you would customize recommendations based on mood
    if (mood) {
      // We could reorder or select specific modules based on mood
    }
    
    return baseModules;
  };
  
  const modules = getModulesForMood(selectedMood);
  
  if (collapsed) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Activités recommandées</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Activités recommandées</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map(module => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="transition-all hover:shadow-md cursor-pointer"
                  onClick={() => navigate(module.route)}
                >
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${module.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModulesSection;
