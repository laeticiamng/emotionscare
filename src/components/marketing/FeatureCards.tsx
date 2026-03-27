// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Monitor, 
  BookOpen, 
  BarChart3, 
  Brain, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Segment } from '@/store/marketing.store';

interface FeatureCardsProps {
  segment: Segment;
}

const B2C_FEATURES = [
  {
    icon: Zap,
    title: 'Flash Glow',
    description: '60 secondes d\'énergie instantanée pour recharger vos batteries',
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    icon: Monitor,
    title: 'Screen-Silk',
    description: 'Micro-pauses immersives de 90 secondes entre vos tâches',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    icon: BookOpen,
    title: 'Journal Personnel',
    description: 'Suivez votre évolution émotionnelle et vos réflexions',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    icon: Brain,
    title: 'VR Respiration',
    description: 'Sessions de cohérence cardiaque en réalité virtuelle',
    color: 'bg-green-100 text-green-700'
  }
];

const B2B_FEATURES = [
  {
    icon: BarChart3,
    title: 'Heatmap RH',
    description: 'Visualisez le moral d\'équipe de manière anonyme et bienveillante',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    icon: Users,
    title: 'Cocon Social',
    description: 'Espaces collaboratifs sécurisés pour le bien-être collectif',
    color: 'bg-green-100 text-green-700'
  },
  {
    icon: Brain,
    title: 'Modules Collectifs',
    description: 'Sessions de groupe et défis bien-être pour souder les équipes',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    icon: Monitor,
    title: 'Dashboard Managers',
    description: 'Outils d\'accompagnement et insights pour un management humain',
    color: 'bg-orange-100 text-orange-700'
  }
];

/**
 * Cartes de fonctionnalités adaptées au segment
 */
export const FeatureCards: React.FC<FeatureCardsProps> = ({ segment }) => {
  const features = segment === 'b2b' ? B2B_FEATURES : B2C_FEATURES;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {segment === 'b2b' ? 'Outils pour vos équipes' : 'Modules bien-être'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {segment === 'b2b' 
            ? 'Des solutions respectueuses de la vie privée pour améliorer la qualité de vie au travail'
            : 'Des expériences courtes et efficaces pour cultiver votre équilibre au quotidien'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <Card 
              key={feature.title}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="group"
                >
                  Découvrir
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};