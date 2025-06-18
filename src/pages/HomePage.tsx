import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Music, 
  Users, 
  Scan, 
  BookOpen, 
  MessageCircle,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Scanner Émotionnel',
      description: 'Analysez votre état émotionnel actuel',
      icon: <Scan className="h-6 w-6" />,
      path: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Journal Personnel',
      description: 'Rédigez vos pensées et émotions',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/journal',
      color: 'bg-green-500'
    },
    {
      title: 'Coach IA',
      description: 'Obtenez des conseils personnalisés',
      icon: <MessageCircle className="h-6 w-6" />,
      path: '/coach',
      color: 'bg-purple-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Musique adaptée à votre humeur',
      icon: <Music className="h-6 w-6" />,
      path: '/music',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Sessions aujourd\'hui', value: '3', icon: <Clock className="h-4 w-4" /> },
    { label: 'Score bien-être', value: '8.2', icon: <TrendingUp className="h-4 w-4" /> },
    { label: 'Streak actuel', value: '12 jours', icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Bienvenue sur EmotionsCare
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Votre plateforme de bien-être émotionnel et de développement personnel. 
          Prenez soin de votre santé mentale avec nos outils innovants.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {stat.icon}
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span>Actions Rapides</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(action.path)}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-3`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section communauté */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Rejoignez la Communauté</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connectez-vous avec d'autres personnes partageant les mêmes préoccupations de bien-être.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Groupes de soutien</Badge>
            <Badge variant="secondary">Challenges collectifs</Badge>
            <Badge variant="secondary">Partage d'expériences</Badge>
          </div>
          <Button onClick={() => navigate('/community')} className="w-full md:w-auto">
            Explorer la Communauté
          </Button>
        </CardContent>
      </Card>

      {/* Section de motivation */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Brain className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Votre bien-être, notre priorité</h3>
            <p className="text-muted-foreground">
              Chaque jour est une nouvelle opportunité de prendre soin de votre santé mentale. 
              Commencez par une petite action dès maintenant.
            </p>
            <Button onClick={() => navigate('/scan')} size="lg">
              Commencer un scan émotionnel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { HomePage };
export default HomePage;