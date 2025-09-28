import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Settings, 
  Activity, 
  Users,
  LogOut,
  BarChart3,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const quickActions = [
    {
      icon: Heart,
      title: 'Session Bien-être',
      description: 'Démarrer votre session quotidienne',
      href: '/wellness',
      color: 'text-red-500'
    },
    {
      icon: Brain,
      title: 'Coach IA',
      description: 'Discuter avec votre coach personnel',
      href: '/coach',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Métriques',
      description: 'Voir vos statistiques de progression',
      href: '/metrics',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoindre les discussions',
      href: '/community',
      color: 'text-green-500'
    }
  ];

  const recentActivity = [
    {
      type: 'session',
      title: 'Session de méditation complétée',
      time: 'Il y a 2 heures',
      points: '+10 points'
    },
    {
      type: 'achievement',
      title: 'Badge "7 jours consécutifs" débloqué',
      time: 'Hier',
      points: '+50 points'
    },
    {
      type: 'message',
      title: 'Nouveau message du coach IA',
      time: 'Il y a 3 heures',
      points: ''
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </Link>
              <Badge variant="outline">Dashboard</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Bonjour, {user?.user_metadata?.first_name || user?.email?.split('@')[0]} !
              </span>
              <Button asChild variant="outline" size="sm">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre espace personnel pour suivre votre parcours de bien-être
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Totales</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-xs text-muted-foreground">Record personnel !</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Bien-être</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">+60 cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau</CardTitle>
              <Badge className="text-xs">Niveau 3</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Explorateur</div>
              <p className="text-xs text-muted-foreground">250 points vers niveau 4</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Accédez rapidement à vos outils favoris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className="group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>
                  Vos dernières actions et réalisations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-1 bg-white rounded-full">
                        {activity.type === 'session' && <Activity className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'achievement' && <Heart className="h-4 w-4 text-red-500" />}
                        {activity.type === 'message' && <MessageCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          {activity.points && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.points}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Votre Progression Cette Semaine</CardTitle>
              <CardDescription>
                Continuez sur cette lancée pour maintenir votre bien-être !
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5/7</div>
                  <p className="text-sm text-muted-foreground">Sessions complétées</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">42</div>
                  <p className="text-sm text-muted-foreground">Minutes de méditation</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                  <p className="text-sm text-muted-foreground">Objectifs atteints</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}