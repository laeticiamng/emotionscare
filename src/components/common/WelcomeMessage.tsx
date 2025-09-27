import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles } from 'lucide-react';

interface WelcomeMessageProps {
  userName?: string;
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  userName = 'Utilisateur',
  className = '' 
}) => {
  return (
    <Card className={`bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-primary" />
          Bienvenue sur EmotionsCare
          <Badge variant="outline" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Bonjour {userName} ! Nous sommes ravis de vous accompagner dans votre parcours de bien-être émotionnel.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;