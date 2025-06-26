
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  Monitor,
  Trophy,
  Heart,
  Clock,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Sessions complétées', value: '24', change: '+12%', icon: Target },
    { title: 'Temps d\'activité', value: '2h 30m', change: '+18%', icon: Clock },
    { title: 'Score bien-être', value: '85%', change: '+5%', icon: Heart },
    { title: 'Badges obtenus', value: '8', change: '+2', icon: Trophy }
  ];

  const quickActions = [
    { title: 'Scan Émotionnel', description: 'Analyser votre état', icon: Heart, path: '/scan', color: 'bg-red-500' },
    { title: 'Musicothérapie', description: 'Écouter des playlists', icon: Monitor, path: '/music', color: 'bg-purple-500' },
    { title: 'Coach IA', description: 'Parler à votre coach', icon: MessageSquare, path: '/coach', color: 'bg-blue-500' },
    { title: 'Journal', description: 'Noter vos pensées', icon: BookOpen, path: '/journal', color: 'bg-green-500' }
  ];

  const teamActivities = [
    { user: 'Marie D.', action: 'a complété une session de méditation', time: '2h', avatar: '👩‍💼' },
    { user: 'Thomas L.', action: 'a atteint un nouveau badge', time: '4h', avatar: '👨‍💼' },
    { user: 'Sophie M.', action: 'a partagé une réflexion', time: '6h', avatar: '👩‍💻' },
    { user: 'Alex R.', action: 'a complété son scan émotionnel', time: '1j', avatar: '👨‍🔬' }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard Collaborateur
          </h1>
          <p className="text-xl text-gray-600">
            Bienvenue dans votre espace de bien-être professionnel
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Accès Rapide
                </CardTitle>
                <CardDescription>
                  Vos outils de bien-être à portée de clic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                      onClick={() => navigate(action.path)}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                          <div className={`inline-flex p-3 rounded-full ${action.color} text-white mb-3`}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Activity */}
          <div>
            <Card data-testid="team-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Activité Équipe
                </CardTitle>
                <CardDescription>
                  Restez connecté avec vos collègues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl">{activity.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        il y a {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Progression Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Objectif bien-être</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sessions complétées</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Engagement social</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="social-cocon">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Cocon Social
              </CardTitle>
              <CardDescription>
                Votre réseau de soutien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Groupe de soutien</span>
                  </div>
                  <Badge variant="secondary">12 membres</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Équipe projet</span>
                  </div>
                  <Badge variant="secondary">8 membres</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Rejoindre un groupe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
