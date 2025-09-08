/**
 * 📊 TABLEAU DE BORD PREMIUM
 * Hub central pour le suivi du bien-être émotionnel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Zap, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Activity,
  ChevronRight,
  Play,
  BookOpen,
  Music,
  Users
} from 'lucide-react';

const quickActions = [
  {
    id: 'scan',
    title: 'Scan Émotionnel',
    description: 'Analysez votre état émotionnel actuel',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    href: '/app/scan'
  },
  {
    id: 'journal',
    title: 'Journal Intelligent',
    description: 'Notez vos pensées et émotions',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    href: '/app/journal'
  },
  {
    id: 'music',
    title: 'Musicothérapie',
    description: 'Musique adaptée à votre humeur',
    icon: Music,
    color: 'from-green-500 to-emerald-500',
    href: '/app/music'
  },
  {
    id: 'coach',
    title: 'Coach IA',
    description: 'Séance avec votre coach personnel',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    href: '/app/coach'
  }
];

const stats = [
  {
    label: 'Score de Bien-être',
    value: 85,
    change: '+5',
    icon: Heart,
    color: 'text-green-600'
  },
  {
    label: 'Stabilité Émotionnelle',
    value: 78,
    change: '+12',
    icon: Activity,
    color: 'text-blue-600'
  },
  {
    label: 'Objectifs Atteints',
    value: 92,
    change: '+8',
    icon: Target,
    color: 'text-purple-600'
  },
  {
    label: 'Streak Actuel',
    value: 14,
    change: '+1',
    icon: Award,
    color: 'text-orange-600'
  }
];

export const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tableau de Bord Premium - EmotionsCare</title>
        <meta name="description" content="Votre hub central pour le suivi et l'amélioration de votre bien-être émotionnel avec des insights personnalisés." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bonjour, Alex ! 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Voici un aperçu de votre bien-être émotionnel aujourd'hui
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </Badge>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-primary/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${action.color} w-fit`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {action.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="ghost" className="group-hover:bg-primary/10">
                          <Play className="h-4 w-4 mr-2" />
                          Démarrer
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Statistics Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Aperçu de vos Progrès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                          <span className="text-sm font-medium">{stat.label}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {stat.value}{stat.label.includes('Score') || stat.label.includes('Stabilité') || stat.label.includes('Objectifs') ? '%' : ' jours'}
                          </span>
                        </div>
                        <Progress 
                          value={stat.label.includes('Streak') ? (stat.value / 30) * 100 : stat.value} 
                          className="h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recommandations IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <strong>Exercice de respiration</strong> - Votre niveau de stress semble élevé. 
                      Je recommande 5 minutes de respiration guidée.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm">
                      <strong>Session de musicothérapie</strong> - Vos émotions positives sont en hausse. 
                      Parfait moment pour une séance énergisante !
                    </p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Voir toutes les recommandations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Prochaines Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Coach IA - Session hebdomadaire</p>
                      <p className="text-xs text-muted-foreground">Aujourd'hui, 16:30</p>
                    </div>
                    <Badge>Bientôt</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Méditation VR - Forêt Zen</p>
                      <p className="text-xs text-muted-foreground">Demain, 09:00</p>
                    </div>
                    <Badge variant="outline">Programmé</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Gérer mon agenda
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;