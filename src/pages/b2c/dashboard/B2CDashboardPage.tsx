import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Music, Camera, BookOpen, Users, TrendingUp, Zap, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data pour les stats utilisateur
  const userStats = useMemo(() => ({
    scansToday: 3,
    musicSessions: 2,
    journalEntries: 1,
    currentMood: 'Positif',
    streak: 7,
    totalXP: 1240
  }), []);

  const quickActions = useMemo(() => [
    {
      title: 'Scan Émotionnel',
      description: 'Analysez vos émotions en temps réel avec notre IA avancée',
      icon: Camera,
      gradient: 'from-blue-500 to-blue-600',
      route: '/scan',
      stats: [
        { label: 'Aujourd\'hui', value: `${userStats.scansToday}` },
        { label: 'Précision', value: '95%' }
      ],
      isPremium: true,
      isPopular: true
    },
    {
      title: 'Musicothérapie',
      description: 'Découvrez la musique parfaite pour votre état émotionnel',
      icon: Music,
      gradient: 'from-purple-500 to-purple-600',
      route: '/music',
      stats: [
        { label: 'Sessions', value: `${userStats.musicSessions}` },
        { label: 'Minutes', value: '45' }
      ]
    },
    {
      title: 'Coach IA Personnel',
      description: 'Votre guide bien-être disponible 24/7',
      icon: Brain,
      gradient: 'from-green-500 to-green-600',
      route: '/coach',
      stats: [
        { label: 'Conseils', value: '12' },
        { label: 'Satisfaction', value: '98%' }
      ],
      isPremium: true
    },
    {
      title: 'Journal Émotionnel',
      description: 'Suivez et analysez votre parcours émotionnel',
      icon: BookOpen,
      gradient: 'from-orange-500 to-orange-600',
      route: '/journal',
      stats: [
        { label: 'Entrées', value: `${userStats.journalEntries}` },
        { label: 'Cette semaine', value: '5' }
      ]
    },
    {
      title: 'Cocon Social',
      description: 'Connectez-vous avec une communauté bienveillante',
      icon: Users,
      gradient: 'from-pink-500 to-pink-600',
      route: '/social-cocon',
      stats: [
        { label: 'Amis', value: '24' },
        { label: 'Messages', value: '8' }
      ]
    },
    {
      title: 'Gamification',
      description: 'Transformez votre bien-être en aventure épique',
      icon: Star,
      gradient: 'from-yellow-500 to-yellow-600',
      route: '/gamification',
      stats: [
        { label: 'Niveau', value: '7' },
        { label: 'XP Total', value: `${userStats.totalXP}` }
      ],
      isPopular: true
    }
  ], [userStats]);

  const recentActivities = useMemo(() => [
    {
      type: 'scan',
      title: 'Scan émotionnel',
      subtitle: 'Il y a 2 heures',
      result: 'Joie',
      icon: Camera,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      type: 'music',
      title: 'Session musicale',
      subtitle: 'Hier soir',
      result: '15 min',
      icon: Music,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      type: 'journal',
      title: 'Entrée de journal',
      subtitle: 'Il y a 3 jours',
      result: 'Réflexion',
      icon: BookOpen,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      badgeColor: 'bg-orange-100 text-orange-700'
    }
  ], []);

  const handleQuickAction = useCallback((route: string, title: string) => {
    toast.info(`Navigation vers ${title}`);
    navigate(route);
  }, [navigate]);

  const handleStartScan = useCallback(() => {
    toast.success('Démarrage du scan émotionnel', {
      description: 'Positionnez-vous face à la caméra'
    });
    navigate('/scan');
  }, [navigate]);

  const header = {
    title: 'Tableau de Bord Personnel',
    subtitle: 'Bienvenue dans votre espace bien-être',
    description: 'Suivez votre progression, accédez à vos outils favoris et continuez votre parcours de développement personnel',
    icon: Heart,
    badge: 'Espace B2C',
    stats: [
      { label: 'Humeur Actuelle', value: userStats.currentMood, icon: Heart, color: 'text-pink-500' },
      { label: 'Série Active', value: `${userStats.streak} jours`, icon: Zap, color: 'text-yellow-500' },
      { label: 'Total XP', value: `${userStats.totalXP}`, icon: Star, color: 'text-purple-500' },
      { label: 'Niveau', value: '7', icon: TrendingUp, color: 'text-green-500' }
    ],
    actions: [
      {
        label: 'Scanner Maintenant',
        onClick: handleStartScan,
        variant: 'default' as const,
        icon: Camera
      },
      {
        label: 'Voir Profil',
        onClick: () => navigate('/profile-settings'),
        variant: 'outline' as const,
        icon: Users
      }
    ]
  };

  const tips = {
    title: 'Optimisez votre parcours bien-être',
    items: [
      {
        title: 'Routine Quotidienne',
        content: 'Effectuez un scan émotionnel chaque matin pour personnaliser votre journée',
        icon: Clock
      },
      {
        title: 'Écoute Active',
        content: 'Utilisez la musicothérapie pendant les transitions entre activités',
        icon: Music
      },
      {
        title: 'Réflexion Continue',
        content: 'Tenez un journal pour identifier vos patterns émotionnels',
        icon: BookOpen
      }
    ],
    cta: {
      label: 'Guide Utilisateur Complet',
      onClick: () => navigate('/help-center')
    }
  };

  return (
    <PageLayout header={header} tips={tips}>
      <div className="space-y-12">
        {/* Actions Rapides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Vos Outils de Bien-être
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <FeatureCard
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                gradient={action.gradient}
                isPremium={action.isPremium}
                isPopular={action.isPopular}
                stats={action.stats}
                action={{
                  label: 'Accéder',
                  onClick: () => handleQuickAction(action.route, action.title)
                }}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Activité Récente */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Activité Récente
          </h2>
          
          <Card className="p-6 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 ${activity.bgColor} rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => navigate(`/${activity.type}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                          <IconComponent className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                        </div>
                      </div>
                      
                      <Badge className={activity.badgeColor}>
                        {activity.result}
                      </Badge>
                    </div>
                  );
                })}
                
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/activity-history')}
                    className="w-full"
                  >
                    Voir tout l'historique
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default memo(B2CDashboardPage);