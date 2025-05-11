
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GamificationWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  collapsed,
  onToggle,
  userId
}) => {
  if (collapsed) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Progrès et récompenses
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
          <Trophy className="h-5 w-5 mr-2" />
          Progrès et récompenses
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Niveau 7</div>
              <div className="text-sm text-muted-foreground">423 / 500 XP</div>
            </div>
            <Progress value={84} className="h-2" />
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Badges récents</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  🔥
                </div>
                <div className="text-xs text-center">Série de 3j</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  🧠
                </div>
                <div className="text-xs text-center">5 scans</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  🌊
                </div>
                <div className="text-xs text-center">Méditant</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  🎯
                </div>
                <div className="text-xs text-center">Objectifs</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Défis en cours</h4>
            <Card className="p-3 mb-2">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">Semaine zen</div>
                <div className="text-sm text-muted-foreground">3/7</div>
              </div>
              <Progress value={42} className="h-1 mb-1" />
              <div className="text-xs text-muted-foreground">
                7 jours consécutifs de méditation
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">Explorer</div>
                <div className="text-sm text-muted-foreground">2/5</div>
              </div>
              <Progress value={40} className="h-1 mb-1" />
              <div className="text-xs text-muted-foreground">
                Essayer 5 différents exercices
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;
