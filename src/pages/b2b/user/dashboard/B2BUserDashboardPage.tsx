
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Heart,
  TrendingUp, 
  MessageCircle, 
  BookOpen,
  Calendar,
  Star,
  Play,
  BarChart3,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teamWellbeing, setTeamWellbeing] = useState(72);
  const [personalScore, setPersonalScore] = useState(78);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const teamStats = [
    { label: 'Équipe', value: teamWellbeing, color: 'text-blue-600' },
    { label: 'Département', value: 68, color: 'text-green-600' },
    { label: 'Entreprise', value: 71, color: 'text-purple-600' }
  ];

  const recentActivities = [
    { id: 1, type: 'team_session', title: 'Session d\'équipe', time: 'Il y a 1h', participants: 8 },
    { id: 2, type: 'wellness_check', title: 'Check-in bien-être', time: 'Ce matin', score: 85 },
    { id: 3, type: 'peer_support', title: 'Support entre pairs', time: 'Hier', status: 'completed' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Méditation en équipe', time: '14:00', type: 'wellness' },
    { id: 2, title: 'Atelier gestion du stress', time: '16:30', type: 'workshop' },
    { id: 3, title: 'Check-in hebdomadaire', time: 'Demain 9:00', type: 'checkin' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre espace collaborateur..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-light">
              Espace Collaborateur
            </h1>
            <p className="text-muted-foreground">
              Bienvenue {user?.name} • {user?.company || 'Votre entreprise'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center">
              <Building2 className="mr-1 h-3 w-3" />
              Collaborateur
            </Badge>
          </div>
        </motion.div>

        {/* Personal vs Team Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Mon Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">{personalScore}%</div>
                <Progress value={personalScore} className="h-3" />
                <Button 
                  onClick={() => navigate('/b2b/user/emotion-check')}
                  className="w-full"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Nouvelle analyse
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Bien-être Collectif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={stat.value} className="w-20 h-2" />
                      <span className={`text-sm font-bold ${stat.color}`}>{stat.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activities & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/b2b/user/emotion-check')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <Heart className="h-6 w-6 text-red-500" />
                      <span>Check-in émotionnel</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/b2b/user/team-activities')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <Users className="h-6 w-6 text-blue-500" />
                      <span>Activités d'équipe</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/b2b/user/peer-support')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <MessageCircle className="h-6 w-6 text-green-500" />
                      <span>Support entre pairs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
                      Activités Récentes
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/b2b/user/history')}>
                      Voir tout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground">{activity.time}</div>
                          </div>
                        </div>
                        {activity.participants && (
                          <Badge variant="secondary">{activity.participants} participants</Badge>
                        )}
                        {activity.score && (
                          <Badge variant="secondary">{activity.score}%</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                    Insights Équipe
                  </CardTitle>
                  <CardDescription>
                    Tendances et observations anonymisées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Tendance positive</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        L'équipe montre une amélioration de 15% cette semaine
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Cohésion d'équipe</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        85% de participation aux activités collectives
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Calendar & Events */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-orange-500" />
                    Événements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.time}
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Participer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-500" />
                    Objectifs Personnels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Check-ins hebdomadaires</span>
                        <span>5/7</span>
                      </div>
                      <Progress value={71} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Activités bien-être</span>
                        <span>3/5</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sessions d'équipe</span>
                        <span>2/3</span>
                      </div>
                      <Progress value={67} />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Award className="mr-2 h-4 w-4" />
                    Voir mes récompenses
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                    Ressources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2b/user/resources')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Exercices guidés
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2b/user/wellness-library')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Bibliothèque bien-être
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2b/user/support')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Support & aide
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
