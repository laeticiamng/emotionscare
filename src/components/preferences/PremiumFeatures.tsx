
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const PremiumFeatures = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check if user has premium features
  const hasPremium = user?.role === 'b2b_user' || user?.role === 'b2b_admin';
  
  // Initialize preferences with default values if they don't exist
  const userPreferences = user?.preferences || {};
  
  const [preferences, setPreferences] = useState({
    emotionalCamouflage: userPreferences.emotionalCamouflage || false,
    aiSuggestions: userPreferences.aiSuggestions || true
  });
  
  const handleUpdateUser = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      toast({
        title: 'Fonctionnalités mises à jour',
        description: 'Vos préférences premium ont été mises à jour',
        variant: 'success'
      });
      setLoading(false);
    }, 1000);
  };
  
  const handleToggleFeature = (feature: 'emotionalCamouflage' | 'aiSuggestions', value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [feature]: value
    }));
  };
  
  if (!hasPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités Premium</CardTitle>
          <CardDescription>
            Accédez à des fonctionnalités avancées en passant à un compte premium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Fonctionnalités Premium</h3>
            <ul className="space-y-2 text-sm list-disc pl-5">
              <li>Camouflage émotionnel (masquez vos émotions à certains moments)</li>
              <li>Suggestions d'IA personnalisées</li>
              <li>Sessions de coaching et conseils avancés</li>
              <li>Rapports approfondis et analyses de tendances</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full">
            Passer à la version Premium
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonctionnalités Premium</CardTitle>
        <CardDescription>
          Gérez vos fonctionnalités premium
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emotionalCamouflage" className="block">Camouflage Émotionnel</Label>
              <p className="text-sm text-muted-foreground">
                Masquez temporairement vos émotions détectées aux autres utilisateurs
              </p>
            </div>
            <Switch 
              id="emotionalCamouflage" 
              checked={preferences.emotionalCamouflage}
              onCheckedChange={(checked) => handleToggleFeature('emotionalCamouflage', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="aiSuggestions" className="block">Suggestions IA Avancées</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des recommandations personnalisées basées sur votre profil émotionnel
              </p>
            </div>
            <Switch 
              id="aiSuggestions" 
              checked={preferences.aiSuggestions}
              onCheckedChange={(checked) => handleToggleFeature('aiSuggestions', checked)}
            />
          </div>
        </div>
        
        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20">
          <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            État de votre abonnement Premium
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Votre abonnement premium est actif et sera renouvelé le {' '}
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateUser} disabled={loading} className="w-full">
          {loading ? 'Mise à jour...' : 'Enregistrer les paramètres'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumFeatures;
