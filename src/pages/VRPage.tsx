
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  Settings, 
  Clock, 
  Users,
  Star,
  ArrowRight,
  Eye3D,
  Zap,
  Timer
} from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

const VRPage: React.FC = () => {
  const experiences = [
    {
      title: 'Plage Zen',
      description: 'Détendez-vous sur une plage paradisiaque avec des sons apaisants',
      category: 'Relaxation',
      duration: '15 min',
      rating: 4.9,
      gradient: 'from-blue-400 to-teal-500',
      icon: <Headphones className="h-16 w-16 text-white" />,
      action: () => console.log('Start VR session')
    },
    {
      title: 'Forêt Mystique',
      description: 'Méditez dans une forêt enchantée avec des sons de la nature',
      category: 'Méditation',
      duration: '20 min',
      rating: 4.7,
      gradient: 'from-green-400 to-emerald-500',
      icon: <Headphones className="h-16 w-16 text-white" />,
      action: () => console.log('Start VR session')
    },
    {
      title: 'Bureau Spatial',
      description: 'Travaillez dans un environnement futuriste pour améliorer votre focus',
      category: 'Concentration',
      duration: '30 min',
      rating: 4.6,
      gradient: 'from-purple-400 to-violet-500',
      icon: <Headphones className="h-16 w-16 text-white" />,
      action: () => console.log('Start VR session')
    }
  ];

  const quickActions = [
    {
      title: 'Mes Sessions',
      description: 'Accédez à vos expériences VR précédentes',
      icon: <ArrowRight className="h-5 w-5" />,
      action: () => console.log('View history')
    },
    {
      title: 'Paramètres VR',
      description: 'Configurez votre expérience de réalité virtuelle',
      icon: <Settings className="h-5 w-5" />,
      action: () => console.log('Open settings')
    }
  ];

  return (
    <PageLayout
      header={{
        title: 'Réalité Virtuelle',
        subtitle: 'Expériences immersives pour votre bien-être',
        description: 'Plongez dans des environnements virtuels thérapeutiques et détendez-vous dans des mondes créés spécialement pour votre équilibre émotionnel.',
        icon: Eye3D,
        gradient: 'from-purple-500/20 to-blue-500/5',
        badge: 'Technologie Premium',
        stats: [
          {
            label: 'Sessions terminées',
            value: '47',
            icon: Clock,
            color: 'text-purple-500'
          },
          {
            label: 'Environnements',
            value: '12',
            icon: Users,
            color: 'text-blue-500'
          },
          {
            label: 'Satisfaction',
            value: '4.8★',
            icon: Star,
            color: 'text-yellow-500'
          },
          {
            label: 'Temps total',
            value: '8h24m',
            icon: Timer,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: 'Nouvelle Session',
            onClick: () => console.log('New VR session'),
            variant: 'default',
            icon: Play
          },
          {
            label: 'Paramètres VR',
            onClick: () => console.log('VR settings'),
            variant: 'outline',
            icon: Settings
          }
        ]
      }}
      tips={{
        title: 'Conseils pour une expérience VR optimale',
        items: [
          {
            title: 'Préparation',
            content: 'Assurez-vous d\'être dans un environnement calme et sécurisé',
            icon: Settings
          },
          {
            title: 'Confort',
            content: 'Prenez des pauses régulières toutes les 20-30 minutes',
            icon: Timer
          },
          {
            title: 'Immersion',
            content: 'Utilisez un casque audio de qualité pour une expérience complète',
            icon: Headphones
          }
        ],
        cta: {
          label: 'Guide d\'utilisation VR',
          onClick: () => console.log('VR guide')
        }
      }}
    >
      <div className="space-y-12">
        {/* Expériences VR */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Expériences Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience, index) => (
              <FeatureCard
                key={index}
                title={experience.title}
                description={experience.description}
                icon={experience.icon}
                category={experience.category}
                gradient={experience.gradient}
                metadata={[
                  { label: 'Durée', value: experience.duration },
                  { label: 'Note', value: `${experience.rating}★` }
                ]}
                action={{
                  label: 'Démarrer',
                  onClick: experience.action,
                  icon: <Play className="h-4 w-4" />
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {action.icon}
                    {action.title}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Accéder
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VRPage;
