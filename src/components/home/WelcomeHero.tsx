
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CtaButton {
  label: string;
  link: string;
  text: string;
  variant: 'default' | 'outline';
  icon?: boolean;
}

interface WelcomeHeroProps {
  title: string;
  subtitle: string;
  ctaButtons: CtaButton[];
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ title, subtitle, ctaButtons }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-bold mb-6">{title}</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{subtitle}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {ctaButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            size="lg"
            onClick={() => navigate(button.link)}
            className="flex items-center gap-2"
          >
            {button.text}
            {button.icon && <ArrowRight className="h-4 w-4" />}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeHero;
