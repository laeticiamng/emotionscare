
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BreathingExercise from '@/components/meditation/BreathingExercise';
import GuidedSessionList from '@/components/meditation/GuidedSessionList';
import AmbientSoundSelector from '@/components/meditation/AmbientSoundSelector';
import MeditationTimer from '@/components/meditation/MeditationTimer';
import MeditationStats from '@/components/meditation/MeditationStats';
import { Brain, Heart, Waves, Timer, TrendingUp, Music } from 'lucide-react';

const MeditationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guided');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Centre de Méditation & Relaxation
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez la paix intérieure avec nos sessions guidées, exercices de respiration et ambiances sonores immersives
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Mindfulness
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Bien-être
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Waves className="h-3 w-3" />
              Relaxation
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="guided" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions Guidées</span>
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              <span className="hidden sm:inline">Respiration</span>
            </TabsTrigger>
            <TabsTrigger value="ambient" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Ambiances</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Minuteur</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-6">
            <GuidedSessionList />
          </TabsContent>

          <TabsContent value="breathing" className="space-y-6">
            <BreathingExercise />
          </TabsContent>

          <TabsContent value="ambient" className="space-y-6">
            <AmbientSoundSelector />
          </TabsContent>

          <TabsContent value="timer" className="space-y-6">
            <MeditationTimer />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <MeditationStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MeditationPage;
