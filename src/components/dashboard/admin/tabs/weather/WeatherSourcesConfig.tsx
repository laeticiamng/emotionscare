// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const weatherProviders = [
  { id: 'openweathermap', name: 'OpenWeatherMap' },
  { id: 'weatherapi', name: 'WeatherAPI.com' },
  { id: 'meteo-france', name: 'Météo France' },
  { id: 'accuweather', name: 'AccuWeather' },
];

const refreshIntervals = [
  { value: '15', label: 'Toutes les 15 minutes' },
  { value: '30', label: 'Toutes les 30 minutes' },
  { value: '60', label: 'Toutes les heures' },
  { value: '180', label: 'Toutes les 3 heures' },
  { value: '360', label: 'Toutes les 6 heures' },
];

const WeatherSourcesConfig: React.FC = () => {
  const [config, setConfig] = useState({
    provider: 'openweathermap',
    apiKey: '',
    location: 'Paris, France',
    refreshInterval: '60',
    isEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En production, ce serait un appel API pour sauvegarder la configuration
      localStorage.setItem('weather-config', JSON.stringify(config));
      
      toast.success('Configuration météo enregistrée', {
        description: 'Les paramètres ont été mis à jour avec succès.'
      });
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement', {
        description: 'Veuillez réessayer ou contacter le support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    
    try {
      // Simuler un test de connexion à l'API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulation d'une réponse réussie
      setTestStatus('success');
      toast.success('Connexion établie avec succès', {
        description: 'L\'API météo est correctement configurée.'
      });
    } catch (error) {
      setTestStatus('error');
      toast.error('Échec de la connexion', {
        description: 'Veuillez vérifier votre clé API et réessayer.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de la source météo</CardTitle>
        <CardDescription>
          Configurez la source de données météorologiques pour les suggestions d'activités
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form id="weather-config-form" onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Fournisseur de données météo</Label>
              <Select
                value={config.provider}
                onValueChange={(value) => setConfig({ ...config, provider: value })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Sélectionner un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {weatherProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Le fournisseur détermine le format et la disponibilité des données météorologiques.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Clé API</Label>
              <div className="flex space-x-2">
                <Input
                  id="api-key"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Entrez votre clé API"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={!config.apiKey || testStatus === 'testing'}
                >
                  {testStatus === 'testing' ? 'Test en cours...' : 'Tester'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Obtenez une clé API en vous inscrivant sur le site du fournisseur sélectionné.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localisation par défaut</Label>
              <Input
                id="location"
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                placeholder="Paris, France"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cette localisation sera utilisée par défaut si l'utilisateur n'a pas défini sa propre localisation.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">Fréquence de rafraîchissement</Label>
              <Select
                value={config.refreshInterval}
                onValueChange={(value) => setConfig({ ...config, refreshInterval: value })}
              >
                <SelectTrigger id="refresh-interval">
                  <SelectValue placeholder="Sélectionner une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  {refreshIntervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Définit à quelle fréquence les données météorologiques sont mises à jour.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            {testStatus === 'success' && (
              <span className="text-green-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-600"></span>
                Connexion API vérifiée
              </span>
            )}
            {testStatus === 'error' && (
              <span className="text-red-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                Échec de connexion
              </span>
            )}
          </div>
        </div>
        <Button type="submit" form="weather-config-form" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer la configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeatherSourcesConfig;
