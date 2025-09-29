import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  Star, 
  Trophy,
  ArrowUp,
  Clock,
  TrendingUp
} from 'lucide-react';
import { AmbitionRun } from '@/types/ambition';

interface GameBoardProps {
  currentRun: AmbitionRun | null;
  onGenerateQuests: () => void;
  onCompleteQuest: (questId: string) => void;
  isLoading: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  currentRun, 
  onGenerateQuests, 
  onCompleteQuest,
  isLoading 
}) => {
  if (!currentRun) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold mb-2">Aucun objectif actif</h3>
          <p className="text-muted-foreground mb-6">
            Créez votre premier objectif gamifié pour commencer l'aventure
          </p>
          <Button onClick={onGenerateQuests} size="lg">
            <Target className="h-4 w-4 mr-2" />
            Créer un objectif
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalQuests = currentRun.quests?.length || 0;
  const completedQuests = currentRun.quests?.filter(q => q.status === 'completed').length || 0;
  const progressPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête de l'objectif */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentRun.objective}</h2>
              <div className="flex items-center gap-2">
                {currentRun.tags?.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {currentRun.metadata?.totalXp || 0}
              </div>
              <div className="text-sm text-muted-foreground">XP Total</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression globale</span>
              <span className="font-medium">{completedQuests}/{totalQuests} quêtes</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{completedQuests}</div>
              <div className="text-xs text-muted-foreground">Complétées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {currentRun.quests?.filter(q => q.status === 'in_progress').length || 0}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {currentRun.quests?.filter(q => q.status === 'available').length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Disponibles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille des quêtes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentRun.quests?.map((quest) => (
          <Card 
            key={quest.id} 
            className={`transition-all hover:shadow-md ${
              quest.status === 'completed' ? 'bg-green-50 border-green-200' :
              quest.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
              'hover:border-primary/50'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {quest.status === 'completed' ? (
                    <Trophy className="h-5 w-5 text-green-600" />
                  ) : quest.status === 'in_progress' ? (
                    <Clock className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Target className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Badge 
                    variant={quest.status === 'completed' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {quest.status === 'completed' ? 'Terminée' :
                     quest.status === 'in_progress' ? 'En cours' : 'Disponible'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Star className="h-3 w-3" />
                  {quest.xp_reward || 25}
                </div>
              </div>

              <h3 className="font-semibold mb-2 line-clamp-2">{quest.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {quest.flavor}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {quest.est_minutes || 15} min
                </div>
                {quest.completed_at && (
                  <div className="text-green-600 font-medium">
                    Complétée !
                  </div>
                )}
              </div>

              {quest.status === 'available' && (
                <Button 
                  onClick={() => onCompleteQuest(quest.id)}
                  size="sm" 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Commencer
                </Button>
              )}

              {quest.status === 'in_progress' && (
                <Button 
                  onClick={() => onCompleteQuest(quest.id)}
                  size="sm" 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Terminer
                </Button>
              )}

              {quest.status === 'completed' && quest.result && (
                <div className="text-xs bg-green-100 text-green-800 p-2 rounded">
                  <strong>Résultat :</strong> {quest.result}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Artefacts obtenus */}
      {currentRun.artifacts && currentRun.artifacts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Artefacts d'Ambition Obtenus
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentRun.artifacts.map((artifact) => (
                <div 
                  key={artifact.id}
                  className="text-center p-3 bg-gradient-to-b from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg"
                >
                  <div className="text-2xl mb-1">{artifact.icon || '🏆'}</div>
                  <div className="text-sm font-medium">{artifact.name}</div>
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                  >
                    {artifact.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={onGenerateQuests} disabled={isLoading}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Nouvelles quêtes
            </Button>
            
            <Button variant="outline" disabled>
              <TrendingUp className="h-4 w-4 mr-2" />
              Boost d'ambition
            </Button>
            
            <Button variant="outline" disabled>
              <Star className="h-4 w-4 mr-2" />
              Prestige
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameBoard;