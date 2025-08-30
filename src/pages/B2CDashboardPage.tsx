import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Brain, Music, MessageCircle, Users, Activity,
  TrendingUp, Star, Zap, Sparkles, Target, Award,
  PlayCircle, Headphones, BookOpen, Calendar, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function B2CDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Simple */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tableau de Bord EmotionsCare ✨
          </h1>
          <p className="text-xl text-gray-600">
            Votre bien-être émotionnel vous attend
          </p>
        </div>

        {/* Score de bien-être */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Score de Bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <span className="text-5xl font-bold text-emerald-500">85%</span>
                  <div className="space-y-1">
                    <div className="flex items-center text-emerald-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+8% cette semaine</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      ⭐ Performance exceptionnelle
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-4">
                <div className="w-32">
                  <Progress value={85} className="h-3" />
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/app/activity')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Voir Détails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectifs du jour */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Objectifs du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression du jour</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 1, title: "Méditation matinale", completed: true },
                  { id: 2, title: "Scan émotionnel", completed: true },
                  { id: 3, title: "15 min d'exercice", completed: false },
                ].map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <input 
                      type="checkbox" 
                      checked={goal.completed}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                      readOnly
                    />
                    <span className={`flex-1 font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {goal.title}
                    </span>
                    {goal.completed && (
                      <Badge className="bg-green-100 text-green-700">
                        ✓ Terminé
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Scan", path: "/app/scan", icon: Heart, color: "bg-red-500" },
            { label: "Music", path: "/app/music", icon: Music, color: "bg-purple-500" },
            { label: "Coach", path: "/app/coach", icon: Brain, color: "bg-blue-500" },
            { label: "Journal", path: "/app/journal", icon: BookOpen, color: "bg-green-500" },
          ].map((action, index) => (
            <Button
              key={action.label}
              variant="outline"
              onClick={() => navigate(action.path)}
              className="h-auto p-4 flex flex-col gap-2 hover:shadow-lg transition-all"
            >
              <div className={`p-2 rounded-full text-white ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Sessions", value: "47", icon: PlayCircle, color: "text-blue-500" },
            { label: "Streak", value: "12j", icon: Flame, color: "text-orange-500" },
            { label: "Niveau", value: "4", icon: Star, color: "text-yellow-500" },
            { label: "Badges", value: "18", icon: Award, color: "text-purple-500" }
          ].map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-all">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-full bg-gray-100 ${stat.color} mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message de test */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Page Dashboard B2C Chargée Avec Succès !
            </h3>
            <p className="text-blue-600">
              Si vous voyez ce message, la page se charge correctement. 
              Tous les composants sont fonctionnels.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}