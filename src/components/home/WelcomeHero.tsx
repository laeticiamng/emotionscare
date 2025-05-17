
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface WelcomeHeroProps {
  title?: string;
  subtitle?: string;
  ctaButtons?: Array<{
    label: string;
    link: string;
    text?: string; // Add the text property
  }>;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  title = "Bienvenue sur votre application de bien-être",
  subtitle = "Découvrez nos outils pour améliorer votre santé émotionnelle et mentale.",
  ctaButtons = [
    {
      label: "Commencer",
      link: "/explore",
    },
    {
      label: "En savoir plus",
      link: "/about",
    }
  ],
  imageSrc,
  imageAlt = "Illustration bien-être",
  className = "",
}) => {
  return (
    <div className={`py-12 md:py-20 px-6 md:px-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 ${className}`}>
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {ctaButtons.map((button, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              asChild
              size="lg"
              className="px-8"
            >
              <Link to={button.link}>
                {button.text || button.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {/* User avatars could go here */}
            </div>
            <p className="text-sm text-muted-foreground">
              Rejoignez notre communauté d'utilisateurs en croissance
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic">Image illustration</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeHero;
