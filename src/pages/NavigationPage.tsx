import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation,
  Home,
  Scan,
  Music,
  MessageSquare,
  Settings,
  Brain,
  Heart,
  Activity,
  Zap,
  Star,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NavigationPage = () => {
  const quickActions = [
    {
      title: 'Nouveau Scan',
      description: 'Analysez vos émotions maintenant',
      icon: Scan,
      href: '/app/scan',
      color: 'bg-blue-500',
      badge: 'Popular'
    },
    {
      title: 'Musique Thérapeutique',
      description: 'Écoutez des playlists adaptées',
      icon: Music,
      href: '/app/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Coach IA',
      description: 'Obtenez des conseils personnalisés',
      icon: Brain,
      href: '/app/coach',
      color: 'bg-green-500',
      badge: 'Nouveau'
    },
    {
      title: 'Journal Personnel',
      description: 'Réfléchissez sur votre journée',
      icon: MessageSquare,
      href: '/app/journal',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Navigation
          </h1>
          <p className="text-muted-foreground mt-2">
            Explorez tous les modules et fonctionnalités d'EmotionsCare
          </p>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Accédez rapidement à vos fonctionnalités favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        {action.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                      <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Paramètres rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Accès Rapide
            </CardTitle>
            <CardDescription>
              Liens directs vers les fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/app/home">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/app/scan">
                <Button variant="outline" className="w-full justify-start">
                  <Scan className="mr-2 h-4 w-4" />
                  Scan Émotions
                </Button>
              </Link>
              <Link to="/app/music">
                <Button variant="outline" className="w-full justify-start">
                  <Music className="mr-2 h-4 w-4" />
                  Musique
                </Button>
              </Link>
              <Link to="/app/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavigationPage;