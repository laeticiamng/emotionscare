
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserMode } from '@/contexts/UserModeContext';

const DashboardContent: React.FC = () => {
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = React.useState(true);
  const [content, setContent] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Générer du contenu différent selon le mode utilisateur
        const contentItems = Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          title: `Contenu ${i + 1} pour ${userMode === 'b2c' ? 'particulier' : userMode === 'b2b_user' ? 'collaborateur' : 'administrateur'}`,
          description: `Description du contenu adapté au mode ${userMode}.`,
        }));
        
        setContent(contentItems);
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userMode]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        // Afficher des skeletons pendant le chargement
        <>
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-40 bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : content.length > 0 ? (
        // Afficher le contenu
        content.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary">
                Contenu {item.id}
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        // Afficher un message si aucun contenu
        <div className="col-span-full text-center p-8">
          <p className="text-muted-foreground">Aucun contenu disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
