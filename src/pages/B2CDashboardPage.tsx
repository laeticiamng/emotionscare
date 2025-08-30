import React, { useState } from 'react';
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
import PremiumBackground from '@/components/premium/PremiumBackground';
import ImmersiveExperience from '@/components/premium/ImmersiveExperience';
import GamificationSystem from '@/components/premium/GamificationSystem';
import SmartRecommendations from '@/components/premium/SmartRecommendations';
import AnimatedButton from '@/components/premium/AnimatedButton';
import QuickActions from '@/components/premium/QuickActions';
import { useNavigate } from 'react-router-dom';

export default function B2CDashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const [wellbeingScore, setWellbeingScore] = useState(85);
  const [todaysGoals] = useState([
    { id: 1, title: "Méditation matinale", completed: true },
    { id: 2, title: "Scan émotionnel", completed: true },
    { id: 3, title: "15 min d'exercice", completed: false },
  ]);

  const completedGoals = todaysGoals.filter(goal => goal.completed).length;
  const progressPercentage = (completedGoals / todaysGoals.length) * 100;

  return (
    <>
      <PremiumBackground variant="particles" intensity="medium">
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Premium avec gradient */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/10 p-8"
            >
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                  >
                    Bonjour ! ✨
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/80 text-lg mt-2"
                  >
                    Votre bien-être émotionnel vous attend
                  </motion.p>
                </div>
                <div className="flex gap-3">
                  <AnimatedButton
                    variant="premium"
                    animation="glow"
                    onClick={() => navigate('/settings/general')}
                    leftIcon={<Target className="w-4 h-4" />}
                  >
                    Préférences
                  </AnimatedButton>
                  <AnimatedButton
                    variant="magical"
                    animation="shimmer"
                    particles={true}
                    onClick={() => navigate('/app/scan')}
                    leftIcon={<Heart className="w-4 h-4" />}
                  >
                    Scan Express
                  </AnimatedButton>
                </div>
              </div>
              
              {/* Particules décoratives */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Score de bien-être premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-background/95 to-teal-500/10 border-emerald-500/20 shadow-emerald-500/10 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-emerald-500/20">
                          <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-400">Score de Bien-être</h3>
                          <p className="text-sm text-muted-foreground">Votre évolution aujourd'hui</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-bold text-emerald-400">{wellbeingScore}%</span>
                        <div className="space-y-1">
                          <div className="flex items-center text-emerald-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">+8% cette semaine</span>
                          </div>
                          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                            ⭐ Performance exceptionnelle
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-4">
                      <div className="w-32">
                        <Progress value={wellbeingScore} className="h-3" />
                      </div>
                      <AnimatedButton
                        variant="success"
                        size="sm"
                        leftIcon={<Activity className="w-4 h-4" />}
                        onClick={() => navigate('/app/activity')}
                      >
                        Voir Détails
                      </AnimatedButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Objectifs du jour premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-background/95 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Objectifs du jour
                    </div>
                    <Badge variant="outline" className="bg-primary/10">
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
                      {todaysGoals.map((goal, index) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 transition-all"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <input 
                              type="checkbox" 
                              checked={goal.completed}
                              className="w-5 h-5 text-primary rounded focus:ring-primary"
                              readOnly
                            />
                          </motion.div>
                          <span className={`flex-1 font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {goal.title}
                          </span>
                          {goal.completed && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                              ✓ Terminé
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions rapides premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <QuickActions context="dashboard" />
            </motion.div>

            {/* Système de gamification compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GamificationSystem compact currentXP={2150} currentLevel={4} />
            </motion.div>

            {/* Recommandations IA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <SmartRecommendations 
                maxRecommendations={3} 
                currentEmotion="energetic"
                timeOfDay="afternoon"
              />
            </motion.div>

            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Sessions", value: "47", icon: PlayCircle, color: "text-blue-400" },
                { label: "Streak", value: "12j", icon: Flame, color: "text-orange-400" },
                { label: "Niveau", value: "4", icon: Star, color: "text-amber-400" },
                { label: "Badges", value: "18", icon: Award, color: "text-purple-400" }
              ].map((stat, index) => (
                <Card key={index} className="bg-gradient-to-br from-background/95 to-accent/5 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex p-3 rounded-full bg-accent/10 ${stat.color} mb-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </PremiumBackground>

      {/* Expérience immersive de bienvenue */}
      {showWelcome && (
        <ImmersiveExperience
          variant="welcome"
          title="Bienvenue dans EmotionsCare Premium"
          subtitle="Votre plateforme de bien-être émotionnel nouvelle génération"
          onComplete={() => setShowWelcome(false)}
        >
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Découvrez une expérience personnalisée avec l'IA, des recommandations intelligentes 
              et un système de gamification pour booster votre bien-être.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="bg-white/10 border-white/20">
                🧠 IA Personnalisée
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20">
                🎵 Musicothérapie
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20">
                🏆 Gamification
              </Badge>
            </div>
          </div>
        </ImmersiveExperience>
      )}
    </>
  );
}