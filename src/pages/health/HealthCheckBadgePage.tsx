
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Heart, Brain, Zap } from 'lucide-react';

const HealthCheckBadgePage: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);

  const healthMetrics = [
    { 
      id: 1, 
      name: 'Bien-être Émotionnel', 
      score: 85, 
      status: 'good', 
      icon: Heart,
      description: 'Votre équilibre émotionnel est excellent'
    },
    { 
      id: 2, 
      name: 'Santé Mentale', 
      score: 78, 
      status: 'good', 
      icon: Brain,
      description: 'Bonne gestion du stress et de l\'anxiété'
    },
    { 
      id: 3, 
      name: 'Niveau d\'Énergie', 
      score: 92, 
      status: 'excellent', 
      icon: Zap,
      description: 'Excellent niveau de vitalité'
    },
    { 
      id: 4, 
      name: 'Qualité du Sommeil', 
      score: 67, 
      status: 'warning', 
      icon: Shield,
      description: 'À améliorer - suivez nos recommandations'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'danger':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const startHealthCheck = () => {
    setIsChecking(true);
    setCheckProgress(0);
    
    const interval = setInterval(() => {
      setCheckProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const overallScore = Math.round(healthMetrics.reduce((acc, metric) => acc + metric.score, 0) / healthMetrics.length);
  const getBadgeLevel = (score: number) => {
    if (score >= 90) return { level: 'Platine', color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
    if (score >= 80) return { level: 'Or', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' };
    if (score >= 70) return { level: 'Argent', color: 'bg-gradient-to-r from-gray-300 to-gray-500' };
    if (score >= 60) return { level: 'Bronze', color: 'bg-gradient-to-r from-orange-400 to-orange-600' };
    return { level: 'Débutant', color: 'bg-gradient-to-r from-blue-400 to-blue-600' };
  };

  const badge = getBadgeLevel(overallScore);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Badge de Santé</h1>
          <p className="text-muted-foreground">Votre certification de bien-être globale</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6" />
                Votre Badge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className={`h-32 w-32 mx-auto rounded-full ${badge.color} flex items-center justify-center text-white`}>
                <div className="text-center">
                  <div className="text-2xl font-bold">{overallScore}</div>
                  <div className="text-sm">{badge.level}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold">Badge {badge.level}</h3>
                <p className="text-sm text-muted-foreground">Niveau de bien-être certifié</p>
              </div>
              
              <Button 
                onClick={startHealthCheck}
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? 'Vérification...' : 'Nouveau Check-up'}
              </Button>
              
              {isChecking && (
                <div className="space-y-2">
                  <Progress value={checkProgress} />
                  <p className="text-xs text-muted-foreground">Analyse en cours...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {healthMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <Card key={metric.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{metric.name}</h4>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="text-2xl font-bold">{metric.score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <Badge className={getStatusColor(metric.status)}>
                          {getStatusIcon(metric.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations Personnalisées</CardTitle>
            <CardDescription>Actions pour améliorer votre badge de santé</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium">💤 Améliorer le sommeil</p>
              <p className="text-xs text-muted-foreground">
                Essayez la méditation VR avant le coucher pour améliorer votre score de sommeil
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-sm font-medium">🧘 Maintenir l'équilibre</p>
              <p className="text-xs text-muted-foreground">
                Excellent travail ! Continuez vos sessions de respiration quotidiennes
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <p className="text-sm font-medium">📈 Progresser vers l'Or</p>
              <p className="text-xs text-muted-foreground">
                Il vous faut 5 points de plus pour atteindre le badge Or. Focus sur le sommeil !
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheckBadgePage;
