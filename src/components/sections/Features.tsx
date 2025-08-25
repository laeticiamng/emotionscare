import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Music, 
  BookOpen, 
  Heart, 
  Users, 
  Gamepad2,
  ArrowRight
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function Features() {
  const navAction = useNavAction();

  const features = [
    {
      icon: Brain,
      title: 'Scan Émotionnel IA',
      description: 'Analysez vos émotions en temps réel grâce à l\'intelligence artificielle',
      action: { type: 'route', to: '/scan' }
    },
    {
      icon: Music,
      title: 'Musicothérapie',
      description: 'Playlists personnalisées selon votre état émotionnel',
      action: { type: 'route', to: '/music' }
    },
    {
      icon: BookOpen,
      title: 'Préparation ECOS/EDN',
      description: 'Entraînez-vous aux examens médicaux avec des cas réels',
      action: { type: 'route', to: '/ecos' }
    },
    {
      icon: Heart,
      title: 'Coach IA Personnel',
      description: 'Accompagnement personnalisé par votre assistant virtuel',
      action: { type: 'route', to: '/coach' }
    },
    {
      icon: Users,
      title: 'Journal Émotionnel',
      description: 'Suivez votre évolution émotionnelle dans le temps',
      action: { type: 'route', to: '/journal' }
    },
    {
      icon: Gamepad2,
      title: 'VR Immersive',
      description: 'Expériences de détente en réalité virtuelle',
      action: { type: 'route', to: '/vr' }
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Tout ce dont vous avez besoin pour votre bien-être
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une suite complète d'outils pour gérer vos émotions et réussir vos études médicales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto group-hover:translate-x-1 transition-transform"
                    onClick={() => navAction(feature.action)}
                  >
                    Découvrir
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}