
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, ArrowRight } from 'lucide-react';

interface CallToActionProps {
  type: 'personal' | 'business';
}

const CallToAction: React.FC<CallToActionProps> = ({ type }) => {
  const navigate = useNavigate();

  const config = {
    personal: {
      title: 'Espace Personnel',
      description: 'Accédez à votre tableau de bord personnel pour analyser vos émotions et améliorer votre bien-être.',
      icon: Heart,
      path: '/b2c/login',
      gradient: 'from-pink-500 to-purple-600',
      features: ['Analyse émotionnelle', 'Musique thérapeutique', 'Coach IA personnel']
    },
    business: {
      title: 'Espace Entreprise',
      description: 'Solutions complètes pour le bien-être émotionnel de vos équipes et collaborateurs.',
      icon: Building2,
      path: '/b2b/selection',
      gradient: 'from-blue-500 to-cyan-600',
      features: ['Analytics équipe', 'Gestion RH', 'Rapports détaillés']
    }
  }[type];

  const IconComponent = config.icon;

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer"
          onClick={() => navigate(config.path)}>
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <CardHeader className="space-y-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <CardDescription className="text-base">
          {config.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {config.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full bg-gradient-to-br ${config.gradient} hover:opacity-90 text-white`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(config.path);
          }}
        >
          Accéder à {config.title}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CallToAction;
