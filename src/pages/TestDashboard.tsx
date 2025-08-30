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

const TestDashboard: React.FC = () => {
  const wellbeingScore = 85;
  const todaysGoals = [
    { id: 1, title: "Méditation matinale", completed: true },
    { id: 2, title: "Scan émotionnel", completed: true },
    { id: 3, title: "15 min d'exercice", completed: false },
  ];

  const completedGoals = todaysGoals.filter(goal => goal.completed).length;
  const progressPercentage = (completedGoals / todaysGoals.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Tableau de Bord EmotionsCare
          </h1>
          <p className="text-xl text-slate-600">
            Votre bien-être émotionnel vous attend
          </p>
        </motion.div>

        {/* Score de bien-être */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-emerald-500/10 via-background/95 to-teal-500/10 border-emerald-500/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-emerald-500/20">
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-600">Score de Bien-être</h3>
                      <p className="text-sm text-slate-600">Votre évolution aujourd'hui</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-5xl font-bold text-emerald-600">{wellbeingScore}%</span>
                    <div className="space-y-1">
                      <div className="flex items-center text-emerald-600">
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
                    <Progress value={wellbeingScore} className="h-3" />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Voir Détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Objectifs du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objectifs du jour
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {completedGoals}/{todaysGoals.length} complétés
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression du jour</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {todaysGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
                    >
                      <input 
                        type="checkbox" 
                        checked={goal.completed}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        readOnly
                      />
                      <span className={`flex-1 font-medium ${goal.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
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
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Heart, title: "Scan Émotionnel", color: "bg-red-500" },
                  { icon: Music, title: "Musicothérapie", color: "bg-purple-500" },
                  { icon: MessageCircle, title: "Coach IA", color: "bg-blue-500" },
                  { icon: BookOpen, title: "Journal", color: "bg-green-500" }
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <div className={`p-2 rounded-full ${action.color} text-white`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Sessions", value: "47", icon: PlayCircle, color: "text-blue-500" },
            { label: "Streak", value: "12j", icon: Flame, color: "text-orange-500" },
            { label: "Niveau", value: "4", icon: Star, color: "text-amber-500" },
            { label: "Badges", value: "18", icon: Award, color: "text-purple-500" }
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-full bg-slate-100 ${stat.color} mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestDashboard;