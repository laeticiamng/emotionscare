
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Brain, Calendar, TrendingUp, Sparkles, Clock, Target, Users } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const coachFeatures = [
    {
      title: 'Chat avec le Coach',
      description: 'Discutez avec votre coach IA pour obtenir des conseils personnalisés',
      icon: <MessageCircle className="h-6 w-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/coach/chat')
    },
    {
      title: 'Exercices Guidés',
      description: 'Accédez à des exercices de respiration et de méditation',
      icon: <Brain className="h-6 w-6" />,
      gradient: 'from-purple-500 to-violet-500',
      action: () => navigate('/breathwork')
    },
    {
      title: 'Plans Personnalisés',
      description: 'Programmes adaptés à vos objectifs et votre rythme',
      icon: <Target className="h-6 w-6" />,
      gradient: 'from-green-500 to-emerald-500',
      action: () => navigate('/coach/plan')
    },
    {
      title: 'Suivi Progrès',
      description: 'Analysez votre évolution avec des métriques détaillées',
      icon: <TrendingUp className="h-6 w-6" />,
      gradient: 'from-orange-500 to-red-500',
      action: () => navigate('/coach/progress')
    }
  ];

  const todaySchedule = [
    { time: '9:00', activity: 'Méditation matinale', type: 'mindfulness', color: 'blue' },
    { time: '14:00', activity: 'Pause respiration', type: 'breathing', color: 'green' },
    { time: '20:00', activity: 'Réflexion du soir', type: 'reflection', color: 'purple' }
  ];

  const progressStats = [
    { label: 'Séances cette semaine', value: '5/7', color: 'blue' },
    { label: 'Temps total', value: '2h 30min', color: 'green' },
    { label: 'Objectif mensuel', value: '75%', color: 'purple' },
    { label: 'Série actuelle', value: '12 jours', color: 'orange' }
  ];

  return (
    <PageLayout
      header={{
        title: 'Coach IA Personnel',
        subtitle: 'Votre accompagnateur intelligent',
        description: 'Bénéficiez d\'un coaching personnalisé 24h/24 pour optimiser votre bien-être mental et atteindre vos objectifs.',
        icon: Sparkles,
        gradient: 'from-blue-500/20 to-purple-500/5',
        badge: 'Intelligence Artificielle',
        stats: [
          {
            label: 'Sessions',
            value: '47',
            icon: Brain,
            color: 'text-blue-500'
          },
          {
            label: 'Conseils',
            value: '234',
            icon: MessageCircle,
            color: 'text-green-500'
          },
          {
            label: 'Progrès',
            value: '+18%',
            icon: TrendingUp,
            color: 'text-purple-500'
          },
          {
            label: 'Satisfaction',
            value: '94%',
            icon: Target,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: 'Nouvelle Session',
            onClick: () => navigate('/coach/chat'),
            variant: 'default',
            icon: MessageCircle
          },
          {
            label: 'Mon Plan',
            onClick: () => navigate('/coach/plan'),
            variant: 'outline',
            icon: Calendar
          }
        ]
      }}
      tips={{
        title: 'Maximisez votre coaching',
        items: [
          {
            title: 'Régularité',
            content: 'Interagissez quotidiennement avec votre coach pour de meilleurs résultats',
            icon: Calendar
          },
          {
            title: 'Honnêteté',
            content: 'Partagez vos ressentis authentiques pour des conseils plus précis',
            icon: MessageCircle
          },
          {
            title: 'Patience',
            content: 'Les changements durables prennent du temps, soyez persévérant',
            icon: Target
          }
        ],
        cta: {
          label: 'Guide du coaching IA',
          onClick: () => navigate('/coach/chat')
        }
      }}
    >
      <div className="space-y-8">
        {/* Fonctionnalités principales */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Fonctionnalités Coach IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coachFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                gradient={feature.gradient}
                action={{
                  label: 'Commencer',
                  onClick: () => navigate('/coach/chat')
                }}
              />
            ))}
          </div>
        </div>

        {/* Planning et Progrès */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Planning du jour */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                Planning Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`}></div>
                    <span className="font-medium">{item.activity}</span>
                  </div>
                  <span className={`text-sm text-${item.color}-600 dark:text-${item.color}-400 font-medium`}>
                    {item.time}
                  </span>
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/coach/schedule')}>
                <Calendar className="h-4 w-4 mr-2" />
                Voir le planning complet
              </Button>
            </CardContent>
          </Card>

          {/* Progrès */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                Vos Progrès
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className={`font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.value}
                  </span>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif de la semaine</span>
                    <span>5/7 séances</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '71%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action principale */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="text-center p-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Prêt pour une nouvelle session ?</h3>
            <p className="text-muted-foreground mb-6">
              Votre coach IA vous attend pour une conversation personnalisée selon votre humeur du moment.
            </p>
            <Button size="lg" className="px-8" onClick={() => navigate('/coach/chat')}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Démarrer une conversation
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CoachPage;
