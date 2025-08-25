import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Trophy, 
  Users, 
  TrendingUp,
  FileText,
  Target,
  CheckCircle
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function EcosHub() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const navAction = useNavAction();

  const ecosCases = [
    {
      id: 'cardio-urgence',
      title: 'Urgence Cardiologique',
      specialty: 'Cardiologie',
      duration: 25,
      difficulty: 'Avancé',
      progress: 0,
      status: 'available'
    },
    {
      id: 'pediatrie-asthme',
      title: 'Crise d\'Asthme Pédiatrique',
      specialty: 'Pédiatrie',
      duration: 20,
      difficulty: 'Intermédiaire',
      progress: 60,
      status: 'in_progress'
    },
    {
      id: 'psychiatrie-crise',
      title: 'Crise Psychotique',
      specialty: 'Psychiatrie',
      duration: 30,
      difficulty: 'Expert',
      progress: 100,
      status: 'completed'
    }
  ];

  const stats = {
    casesCompleted: 12,
    averageScore: 16.5,
    totalTime: 8.5,
    rank: 'Externe 3ème année'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ECOS - Examens Cliniques</h1>
          <p className="text-muted-foreground">
            Entraînez-vous aux examens cliniques objectifs structurés
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Trophy className="w-4 h-4 mr-1" />
          {stats.rank}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.casesCompleted}</div>
            <div className="text-sm text-muted-foreground">Cas terminés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.averageScore}/20</div>
            <div className="text-sm text-muted-foreground">Score moyen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTime}h</div>
            <div className="text-sm text-muted-foreground">Temps d'entraînement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">Top 15%</div>
            <div className="text-sm text-muted-foreground">Classement</div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ecosCases.map((cas) => (
          <Card 
            key={cas.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCase === cas.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCase(cas.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{cas.title}</CardTitle>
                  <CardDescription>{cas.specialty}</CardDescription>
                </div>
                {cas.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {cas.duration} min
                </div>
                <Badge 
                  variant={
                    cas.difficulty === 'Expert' ? 'destructive' :
                    cas.difficulty === 'Avancé' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {cas.difficulty}
                </Badge>
              </div>

              {cas.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{cas.progress}%</span>
                  </div>
                  <Progress value={cas.progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                {cas.status === 'available' && (
                  <Button 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navAction({ type: 'modal', id: 'ecos-start', payload: { caseId: cas.id } });
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Commencer
                  </Button>
                )}
                {cas.status === 'in_progress' && (
                  <Button 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navAction({ type: 'modal', id: 'ecos-resume', payload: { caseId: cas.id } });
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reprendre
                  </Button>
                )}
                {cas.status === 'completed' && (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navAction({ type: 'modal', id: 'ecos-results', payload: { caseId: cas.id } });
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Résultats
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'ecos-search' })}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Parcourir tous les cas
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'ecos-stats' })}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Mes statistiques
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'ecos-leaderboard' })}
        >
          <Users className="w-4 h-4 mr-2" />
          Classements
        </Button>
      </div>
    </div>
  );
}