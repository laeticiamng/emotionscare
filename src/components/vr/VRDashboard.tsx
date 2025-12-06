// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VRSessionTemplate } from '@/types/vr';
import { Play, Clock, BarChart3, Star, TrendingUp } from 'lucide-react';
import VRTemplateGrid from './VRTemplateGrid';
import VRSessionHistory from './VRSessionHistory';

interface VRDashboardProps {
  templates: VRSessionTemplate[];
  onStartSession: (template: VRSessionTemplate) => void;
}

const VRDashboard: React.FC<VRDashboardProps> = ({ templates, onStartSession }) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'history' | 'progress'>('featured');

  // Mock data for dashboard
  const userStats = {
    totalSessions: 47,
    totalTime: '12h 34m',
    weeklyGoal: 180, // minutes
    weeklyProgress: 142, // minutes
    currentStreak: 5,
    favoriteCategory: 'Méditation'
  };

  const recentSessions = [
    { id: '1', title: 'Méditation pleine conscience', date: '2024-01-20', duration: 10, rating: 5 },
    { id: '2', title: 'Respiration profonde', date: '2024-01-19', duration: 5, rating: 4 },
    { id: '3', title: 'Relaxation guidée', date: '2024-01-18', duration: 15, rating: 5 }
  ];

  const featuredTemplates = templates.filter(t => t.isFeatured || templates.indexOf(t) < 3);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions totales</p>
                <p className="text-2xl font-bold">{userStats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temps total</p>
                <p className="text-2xl font-bold">{userStats.totalTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Streak actuel</p>
                <p className="text-2xl font-bold">{userStats.currentStreak} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Catégorie préférée</p>
                <p className="text-lg font-semibold">{userStats.favoriteCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Objectif hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{userStats.weeklyProgress} min</span>
              <span>{userStats.weeklyGoal} min</span>
            </div>
            <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} />
            <p className="text-xs text-muted-foreground">
              Plus que {userStats.weeklyGoal - userStats.weeklyProgress} minutes pour atteindre votre objectif !
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'featured' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('featured')}
          className="flex-1"
        >
          Sessions recommandées
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          Historique
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('progress')}
          className="flex-1"
        >
          Progression
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'featured' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sessions recommandées pour vous</h3>
            <Badge variant="secondary">Personnalisé</Badge>
          </div>
          <VRTemplateGrid templates={featuredTemplates} onSelectTemplate={onStartSession} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sessions récentes</h3>
          <div className="grid gap-3">
            {recentSessions.map(session => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.date} • {session.duration} min
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: session.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analyse de vos progrès</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Évolution cette semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lundi</span>
                    <Badge variant="outline">15 min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mardi</span>
                    <Badge variant="outline">20 min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mercredi</span>
                    <Badge variant="outline">25 min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aujourd'hui</span>
                    <Badge>30 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catégories préférées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Méditation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Respiration</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Relaxation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRDashboard;
