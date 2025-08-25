import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookMarked, 
  Target, 
  Clock, 
  Trophy,
  Brain,
  FileText,
  Music,
  Gamepad2
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function EdnHub() {
  const [selectedRank, setSelectedRank] = useState<'A' | 'B'>('A');
  const navAction = useNavAction();

  const ednItems = [
    {
      id: 'IC-290',
      title: 'Épidémiologie des cancers',
      rank: 'A' as const,
      specialty: 'Cancérologie',
      progress: 85,
      status: 'in_progress' as const,
      lastStudied: '2024-01-15'
    },
    {
      id: 'IC-331',
      title: 'Arrêt cardio-circulatoire',
      rank: 'A' as const,
      specialty: 'Urgences',
      progress: 100,
      status: 'mastered' as const,
      lastStudied: '2024-01-10'
    },
    {
      id: 'IC-360',
      title: 'Pneumothorax',
      rank: 'B' as const,
      specialty: 'Pneumologie',
      progress: 45,
      status: 'learning' as const,
      lastStudied: '2024-01-12'
    }
  ];

  const stats = {
    totalItems: 365,
    masteredA: 120,
    masteredB: 45,
    inProgress: 25,
    globalProgress: 67
  };

  const filteredItems = ednItems.filter(item => item.rank === selectedRank);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EDN 2025 - Items de Connaissances</h1>
          <p className="text-muted-foreground">
            Maîtrisez les 365 items des Épreuves Dématérialisées Nationales
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <GraduationCap className="w-4 h-4 mr-1" />
          Progression globale: {stats.globalProgress}%
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalItems}</div>
            <div className="text-sm text-muted-foreground">Items total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.masteredA}</div>
            <div className="text-sm text-muted-foreground">Rang A maîtrisés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.masteredB}</div>
            <div className="text-sm text-muted-foreground">Rang B maîtrisés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.globalProgress}%</div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </CardContent>
        </Card>
      </div>

      {/* Rank Tabs */}
      <Tabs value={selectedRank} onValueChange={(value) => setSelectedRank(value as 'A' | 'B')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="A">Rang A - Indispensables</TabsTrigger>
          <TabsTrigger value="B">Rang B - Approfondissement</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedRank} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.id}</CardTitle>
                      <CardDescription>{item.title}</CardDescription>
                    </div>
                    <Badge 
                      variant={
                        item.status === 'mastered' ? 'default' :
                        item.status === 'in_progress' ? 'secondary' : 'outline'
                      }
                    >
                      {item.specialty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maîtrise</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navAction({ 
                        type: 'modal', 
                        id: 'edn-study', 
                        payload: { itemId: item.id, mode: 'theory' } 
                      })}
                    >
                      <BookMarked className="w-4 h-4 mr-1" />
                      Étudier
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navAction({ 
                        type: 'modal', 
                        id: 'edn-quiz', 
                        payload: { itemId: item.id } 
                      })}
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      Quiz
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navAction({ 
                        type: 'modal', 
                        id: 'edn-music', 
                        payload: { itemId: item.id } 
                      })}
                    >
                      <Music className="w-4 h-4 mr-1" />
                      Musique
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navAction({ 
                        type: 'modal', 
                        id: 'edn-simulation', 
                        payload: { itemId: item.id } 
                      })}
                    >
                      <Gamepad2 className="w-4 h-4 mr-1" />
                      Simulation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'edn-search' })}
        >
          <Target className="w-4 h-4 mr-2" />
          Rechercher un item
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'edn-planning' })}
        >
          <Clock className="w-4 h-4 mr-2" />
          Planning de révision
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'edn-stats' })}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Statistiques détaillées
        </Button>
      </div>
    </div>
  );
}