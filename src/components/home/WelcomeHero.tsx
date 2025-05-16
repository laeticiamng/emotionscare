
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Story } from '@/types/types';

interface WelcomeHeroProps {
  userName?: string;
  onboardingCompleted?: boolean;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ 
  userName = 'There', 
  onboardingCompleted = false 
}) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/dashboard');
  };
  
  const handleContinueOnboarding = () => {
    navigate('/onboarding');
  };

  const welcomeStories: Story[] = [
    {
      id: '1',
      title: 'Bienvenue sur EmotionsCare',
      content: 'Découvrez comment votre bien-être émotionnel peut être transformé par notre technologie.',
      date: new Date(),
      seen: false
    },
    {
      id: '2',
      title: 'Explorez vos émotions',
      content: 'Notre plateforme vous aide à identifier, comprendre et gérer vos émotions au quotidien.',
      date: new Date(),
      seen: false
    }
  ];
  
  const onboardingStory: Story = {
    id: 'onboarding-1',
    title: 'Complétez votre profil',
    content: 'Finalisez votre profil pour obtenir des recommandations personnalisées adaptées à vos besoins.',
    date: new Date(),
    type: "onboarding",
    seen: false,
    cta: {
      label: 'Continuer',
      route: '/onboarding'
    }
  };

  return (
    <div className="py-6 md:py-10">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Hello, <span className="text-primary">{userName}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {onboardingCompleted 
              ? "Bienvenue sur votre espace personnel EmotionsCare. Que souhaitez-vous explorer aujourd'hui ?" 
              : "Nous sommes ravis de vous accueillir. Commençons par explorer vos émotions ensemble."}
          </p>
          
          {!onboardingCompleted && (
            <Card className="mb-8 border-l-4 border-primary">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">{onboardingStory.title}</h3>
                <p className="text-muted-foreground mb-4">{onboardingStory.content}</p>
                <Button onClick={handleContinueOnboarding} className="flex items-center">
                  {onboardingStory.cta?.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={handleGetStarted} className="flex items-center">
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button size="lg" variant="outline" onClick={() => navigate('/music')}>
              Explorer la musicothérapie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
