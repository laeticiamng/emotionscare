
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, Zap, Shield, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const HealthCheckBadgePage: React.FC = () => {
  const [overallScore, setOverallScore] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const healthMetrics = [
    {
      name: 'Équilibre Émotionnel',
      score: 85,
      icon: Heart,
      color: 'text-red-500',
      status: 'Excellent',
      details: 'Gestion du stress optimale, émotions bien régulées'
    },
    {
      name: 'Activité Mentale',
      score: 78,
      icon: Brain,
      color: 'text-purple-500',
      status: 'Bon',
      details: 'Concentration stable, créativité active'
    },
    {
      name: 'Énergie Vitale',
      score: 92,
      icon: Zap,
      color: 'text-yellow-500',
      status: 'Excellent',
      details: 'Niveau d\'énergie très élevé, motivation forte'
    },
    {
      name: 'Activité Physique',
      score: 67,
      icon: Activity,
      color: 'text-green-500',
      status: 'Modéré',
      details: 'Exercices réguliers recommandés'
    },
    {
      name: 'Résilience',
      score: 89,
      icon: Shield,
      color: 'text-blue-500',
      status: 'Excellent',
      details: 'Capacité d\'adaptation remarquable'
    }
  ];

  const badges = [
    { name: 'Maître du Zen', icon: '🧘', earned: true, date: '2024-06-15' },
    { name: 'Cœur d\'Or', icon: '💛', earned: true, date: '2024-06-10' },
    { name: 'Esprit Vif', icon: '🧠', earned: true, date: '2024-06-05' },
    { name: 'Énergie Pure', icon: '⚡', earned: false, date: null },
    { name: 'Guerrier Sage', icon: '🛡️', earned: true, date: '2024-06-01' }
  ];

  useEffect(() => {
    const avgScore = healthMetrics.reduce((sum, metric) => sum + metric.score, 0) / healthMetrics.length;
    setOverallScore(Math.round(avgScore));
  }, []);

  const startHealthScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bilan de Santé Holistique</h1>
        <p className="text-xl text-muted-foreground">
          Votre tableau de bord bien-être complet
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Global */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Score Global
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (351.86 * overallScore) / 100}
                    className={getScoreColor(overallScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
              {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Bon" : "À améliorer"}
            </Badge>
            
            <Button 
              onClick={startHealthScan}
              disabled={isScanning}
              className="w-full mt-4"
            >
              {isScanning ? "Analyse en cours..." : "Nouveau Scan"}
            </Button>
          </CardContent>
        </Card>

        {/* Métriques Détaillées */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Métriques de Santé</CardTitle>
            <CardDescription>
              Analyse détaillée de votre bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center space-x-4">
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.score)}
                        <span className={`font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}%
                        </span>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{metric.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Gagnés */}
        <Card className="md:col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges de Réalisation
            </CardTitle>
            <CardDescription>
              Vos accomplissements en matière de bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {badges.map((badge) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{badge.name}</3>
                  {badge.earned ? (
                    <p className="text-xs text-green-600">
                      Obtenu le {new Date(badge.date!).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Pas encore obtenu
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheckBadgePage;
