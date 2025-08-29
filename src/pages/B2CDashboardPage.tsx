
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Music, BookOpen, Globe, Trophy, Users, Settings, 
         Scan, Play, MessageCircle, Target, Clock, TrendingUp, Zap, Wind, Mic } from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [wellbeingScore, setWellbeingScore] = useState(78);
  const [todaysGoals] = useState([
    { id: 1, title: "Méditation matinale", completed: true },
    { id: 2, title: "Scan émotionnel", completed: false },
    { id: 3, title: "15 min d'exercice", completed: false },
  ]);

  const quickActions = [
    { 
      title: "Scan Émotionnel", 
      icon: Scan, 
      path: "/app/scan", 
      description: "Analysez votre état émotionnel actuel",
      color: "bg-blue-500" 
    },
    { 
      title: "Journal Personnel", 
      icon: BookOpen, 
      path: "/app/journal", 
      description: "Notez vos pensées et émotions",
      color: "bg-green-500" 
    },
    { 
      title: "Musicothérapie", 
      icon: Music, 
      path: "/app/music", 
      description: "Musique adaptée à votre humeur",
      color: "bg-purple-500" 
    },
    { 
      title: "Coach IA", 
      icon: MessageCircle, 
      path: "/app/coach", 
      description: "Conversations avec votre coach virtuel",
      color: "bg-orange-500" 
    },
    { 
      title: "Expérience VR",
      icon: Globe, 
      path: "/app/vr", 
      description: "Immersion dans des environnements apaisants",
      color: "bg-cyan-500" 
    },
            { 
              title: "Cocon Social", 
              icon: Users, 
              path: "/app/social-cocon", 
              description: "Connectez avec la communauté",
              color: "bg-pink-500" 
            },
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec accueil personnalisé */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Bonjour ! 👋
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Comment vous sentez-vous aujourd'hui ?
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/settings/general')} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Préférences
            </Button>
            <Button onClick={() => navigate('/app/scan')} className="bg-gradient-to-r from-blue-500 to-purple-500">
              <Heart className="w-4 h-4 mr-2" />
              Scan Rapide
            </Button>
          </div>
        </div>

        {/* Score de bien-être */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Score de Bien-être</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">{wellbeingScore}%</span>
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    <span className="text-sm">+5% cette semaine</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Progress value={wellbeingScore} className="w-32 mb-2" />
                <Badge variant="secondary" className="text-blue-600">
                  Excellent progrès
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectifs du jour */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Objectifs du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <input 
                    type="checkbox" 
                    checked={goal.completed}
                    className="w-5 h-5 text-blue-600"
                    readOnly
                  />
                  <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                    {goal.title}
                  </span>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {action.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Modules Fun-First */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Modules Fun-First</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Flash Glow", icon: Zap, path: "/app/flash-glow", description: "Boost d'énergie instantané", color: "bg-yellow-500" },
              { title: "Breathwork", icon: Wind, path: "/app/breath", description: "Techniques de respiration", color: "bg-cyan-500" },
              { title: "Emotion Scan", icon: Scan, path: "/app/emotion-scan", description: "Analyse émotionnelle avancée", color: "bg-indigo-500" },
              { title: "VR Galaxy", icon: Globe, path: "/app/vr-galaxy", description: "Voyage cosmique immersif", color: "bg-purple-500" },
              { title: "Mood Mixer", icon: Music, path: "/app/mood-mixer", description: "DJ personnalisé émotionnel", color: "bg-pink-500" },
              { title: "Voice Journal", icon: Mic, path: "/app/voice-journal", description: "Journal vocal intelligent", color: "bg-green-500" },
              { title: "Bounce Back", icon: Target, path: "/app/bounce-back", description: "Battle de résilience", color: "bg-red-500" },
              { title: "Boss Grit", icon: Trophy, path: "/app/boss-grit", description: "Niveau de détermination", color: "bg-orange-500" }
            ].map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(module.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${module.color} text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {module.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Découvrir
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Section Gamification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Vos Récompenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">12</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">847</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">7</div>
                  <div className="text-sm text-gray-600">Jours de suite</div>
                </div>
              </div>
              <Button onClick={() => navigate('/app/leaderboard')} variant="outline">
                Voir tout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
