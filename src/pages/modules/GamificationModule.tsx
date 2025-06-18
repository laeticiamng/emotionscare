
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Gamepad2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GamificationModule: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const modules = [
    {
      id: 'boss-level-grit',
      name: 'Boss Level Grit',
      description: 'Développez votre résilience face aux défis',
      icon: Trophy,
      progress: 65,
      level: 3,
      points: 1250,
      color: 'bg-orange-500'
    },
    {
      id: 'mood-mixer',
      name: 'Mood Mixer',
      description: 'Apprenez à gérer et transformer vos émotions',
      icon: Star,
      progress: 40,
      level: 2,
      points: 800,
      color: 'bg-purple-500'
    },
    {
      id: 'ambition-arcade',
      name: 'Ambition Arcade',
      description: 'Atteignez vos objectifs avec motivation',
      icon: Target,
      progress: 85,
      level: 4,
      points: 2100,
      color: 'bg-blue-500'
    },
    {
      id: 'bounce-back-battle',
      name: 'Bounce-Back Battle',
      description: 'Rebondissez après les échecs',
      icon: Gamepad2,
      progress: 25,
      level: 1,
      points: 400,
      color: 'bg-green-500'
    },
    {
      id: 'story-synth-lab',
      name: 'Story Synth Lab',
      description: 'Créez votre narratif de réussite',
      icon: Zap,
      progress: 0,
      level: 0,
      points: 0,
      color: 'bg-indigo-500'
    }
  ];

  const handleModuleStart = async (moduleId: string) => {
    setIsLoading(true);
    setSelectedModule(moduleId);
    
    try {
      // Simulation d'appel API gamification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Module démarré !',
        description: `Vous avez commencé ${modules.find(m => m.id === moduleId)?.name}`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer le module',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setSelectedModule(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Modules de Gamification</h1>
        <p className="text-muted-foreground">
          Développez vos compétences émotionnelles à travers des défis ludiques
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = selectedModule === module.id && isLoading;
          
          return (
            <Card key={module.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 left-0 right-0 h-1 ${module.color}`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                    <IconComponent className={`h-6 w-6 text-current`} style={{ color: module.color.replace('bg-', '').replace('-500', '') }} />
                  </div>
                  <Badge variant="secondary">
                    Niveau {module.level}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl">{module.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-semibold">{module.points}</span>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleModuleStart(module.id)}
                    disabled={isActive}
                    variant={module.progress > 0 ? "default" : "outline"}
                  >
                    {isActive ? 'Chargement...' : module.progress > 0 ? 'Continuer' : 'Commencer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🏆 Votre Progression Globale</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {modules.reduce((sum, m) => sum + m.points, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Points Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Progression Moyenne</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {modules.filter(m => m.progress > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Modules Actifs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {Math.max(...modules.map(m => m.level))}
            </div>
            <div className="text-sm text-muted-foreground">Niveau Max</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationModule;
