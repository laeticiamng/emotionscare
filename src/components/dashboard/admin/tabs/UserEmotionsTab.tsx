
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserEmotionsTabProps {
  userId: string;
}

const UserEmotionsTab: React.FC<UserEmotionsTabProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    // Simuler le chargement des données d'émotions
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [userId]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique émotionnel</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Aucune donnée émotionnelle disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserEmotionsTab;
