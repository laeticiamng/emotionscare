// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CoachCardProps {
  className?: string;
}

const CoachCard: React.FC<CoachCardProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleChatWithCoach = () => {
    navigate('/app/coach');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Votre coach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4 flex items-center justify-center">
            <MessageCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Emma est disponible</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Discutez avec votre coach pour des conseils personnalisés
          </p>
          
          <Button
            className="w-full"
            onClick={handleChatWithCoach}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Discuter maintenant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
