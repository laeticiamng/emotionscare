
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Calendar, Clock, Activity } from 'lucide-react';

const B2CDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const renderSkeletons = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Utilisateur'}</h1>
      </div>
      
      {isLoading ? renderSkeletons() : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Bilan émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">75/100</div>
                  <span className="ml-2 text-green-500 text-sm">+5%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Votre bien-être émotionnel est en hausse</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Prochaine session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">Méditation guidée</p>
                <p className="text-sm text-muted-foreground">Demain à 18:00</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-indigo-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sessions terminées</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Minutes de méditation</span>
                    <span className="font-medium">84</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
            <QuickAccessMenu />
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">Votre suivi</h2>
            <Tabs defaultValue="emotions">
              <TabsList className="mb-4">
                <TabsTrigger value="emotions">Émotions</TabsTrigger>
                <TabsTrigger value="activities">Activités</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emotions">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des émotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <div className="text-center">
                        <p>Graphique d'évolution émotionnelle</p>
                        <Button className="mt-4" variant="outline">Voir les détails</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des activités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-3 border rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Méditation guidée {i}</p>
                            <p className="text-sm text-muted-foreground">Il y a {i} jour{i > 1 ? 's' : ''}</p>
                          </div>
                          <div className="ml-auto text-sm font-medium">
                            {i * 5} min
                          </div>
                        </div>
                      ))}
                      <Button className="w-full" variant="outline">Voir toutes les activités</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="journal">
                <Card>
                  <CardHeader>
                    <CardTitle>Journal émotionnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Dernières entrées de journal</p>
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Entrée {i}</span>
                            <span className="text-sm text-muted-foreground">Il y a {i * 2} jour{i * 2 > 1 ? 's' : ''}</span>
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div>
                      ))}
                      <Button className="w-full" variant="outline">Voir tout le journal</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </>
      )}
    </div>
  );
};

export default B2CDashboard;
