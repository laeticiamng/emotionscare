
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Brain, 
  Target, 
  Calendar,
  Award,
  MessageCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const wellnessScore = 78;
  const teamMood = "Positif";
  const weeklyGoal = 5;
  const completedSessions = 3;

  const quickActions = [
    { title: "Scanner mon émotion", icon: Brain, href: "/scan", color: "from-blue-500 to-indigo-600" },
    { title: "Session VR", icon: Zap, href: "/vr", color: "from-purple-500 to-pink-600" },
    { title: "Musique thérapie", icon: Heart, href: "/music", color: "from-green-500 to-emerald-600" },
    { title: "Exercices respiration", icon: Target, href: "/breathwork", color: "from-orange-500 to-red-600" }
  ];

  const recentActivities = [
    { activity: "Session de méditation", time: "Il y a 2h", impact: "+5 pts bien-être" },
    { activity: "Scan émotionnel", time: "Hier", impact: "Stress détecté - suggestions envoyées" },
    { activity: "Musique relaxation", time: "Hier", impact: "+3 pts sérénité" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bonjour, Sarah ! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Prêt(e) pour une nouvelle journée de bien-être ?
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Users className="w-4 h-4 mr-1" />
              Équipe Marketing
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Scores principaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Score bien-être</p>
                  <p className="text-3xl font-bold">{wellnessScore}/100</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Humeur équipe</p>
                  <p className="text-2xl font-bold">{teamMood}</p>
                </div>
                <Heart className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Sessions semaine</p>
                  <p className="text-3xl font-bold">{completedSessions}/{weeklyGoal}</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Badges gagnés</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Award className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link to={action.href}>
                        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Disponible maintenant
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activités récentes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.activity}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                        <p className="text-xs text-green-600 mt-1">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section recommandations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    💙 Session de détente
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
                    Votre niveau de stress semble élevé. Une session VR de 10 minutes pourrait vous aider.
                  </p>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100">
                    Commencer
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🌱 Exercice respiratoire
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mb-3">
                    Un exercice de respiration de 5 minutes avant votre prochain meeting.
                  </p>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-100">
                    Essayer
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    🎵 Musique focus
                  </h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-3">
                    Playlist concentration basée sur votre profil émotionnel actuel.
                  </p>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-100">
                    Écouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
