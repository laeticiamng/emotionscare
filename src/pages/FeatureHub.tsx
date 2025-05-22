
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Clock, Search } from 'lucide-react';

const FeatureHub: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub des fonctionnalités</h1>
          <p className="text-muted-foreground">
            Découvrez toutes les fonctionnalités disponibles et à venir
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-9 rounded-md border py-2 px-3 w-[200px]"
            />
          </div>
          <Button>Suggérer une fonctionnalité</Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
          <TabsTrigger value="new">Nouvelles</TabsTrigger>
          <TabsTrigger value="coming">À venir</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.slice(0, 3)}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.slice(3, 6)}
          </div>
        </TabsContent>
        
        <TabsContent value="coming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonFeatures}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Feature cards data
const featureCards = [
  <Card key="music">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Musicothérapie</CardTitle>
        <Badge>Populaire</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Accédez à des playlists personnalisées en fonction de votre humeur et de vos besoins émotionnels.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <span className="text-sm">4.9 (128 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>,
  
  <Card key="vr">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Sessions de réalité virtuelle</CardTitle>
        <Badge>Populaire</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Immergez-vous dans des environnements apaisants pour réduire le stress et l'anxiété.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <span className="text-sm">4.8 (93 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>,
  
  <Card key="journal">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Journal émotionnel</CardTitle>
        <Badge>Populaire</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Suivez votre bien-être émotionnel au fil du temps et identifiez les tendances.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
          <Star className="h-4 w-4 text-yellow-500" />
        </div>
        <span className="text-sm">4.5 (76 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>,
  
  <Card key="coach">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Coach personnel IA</CardTitle>
        <Badge variant="outline">Nouveau</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Obtenez des conseils personnalisés et des recommandations adaptées à votre situation.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
          <Star className="h-4 w-4 text-yellow-500" />
        </div>
        <span className="text-sm">4.3 (42 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>,
  
  <Card key="social">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Social Cocoon</CardTitle>
        <Badge variant="outline">Nouveau</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Connectez-vous avec d'autres utilisateurs et partagez votre parcours de bien-être.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
          <Star className="h-4 w-4 text-yellow-500" />
        </div>
        <span className="text-sm">4.2 (38 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>,
  
  <Card key="analytics">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Analyse émotionnelle avancée</CardTitle>
        <Badge variant="outline">Nouveau</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Visualisez vos données émotionnelles avec des graphiques et des analyses détaillées.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4].map((star) => (
            <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
          <Star className="h-4 w-4 text-yellow-500" />
        </div>
        <span className="text-sm">4.0 (25 avis)</span>
      </div>
      <Button className="w-full">Explorer</Button>
    </CardContent>
  </Card>
];

// Coming soon features
const comingSoonFeatures = [
  <Card key="ai-scan">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Scan émotionnel IA</CardTitle>
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" /> Bientôt
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Analysez votre voix et vos expressions faciales pour obtenir un aperçu instantané de votre état émotionnel.
      </p>
      <Button variant="outline" className="w-full">Être notifié</Button>
    </CardContent>
  </Card>,
  
  <Card key="team">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Analyse d'équipe</CardTitle>
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" /> Bientôt
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Pour les entreprises : suivez et améliorez le bien-être émotionnel de vos équipes.
      </p>
      <Button variant="outline" className="w-full">Être notifié</Button>
    </CardContent>
  </Card>,
  
  <Card key="wellness">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle>Programme de bien-être</CardTitle>
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" /> En développement
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">
        Programmes personnalisés sur 30 jours pour améliorer votre bien-être émotionnel progressivement.
      </p>
      <Button variant="outline" className="w-full">Être notifié</Button>
    </CardContent>
  </Card>
];

export default FeatureHub;
