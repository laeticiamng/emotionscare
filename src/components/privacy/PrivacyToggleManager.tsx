// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Heart, MapPin, Users, Coins, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyticsService } from '@/services/analyticsService';
import { logger } from '@/lib/logger';

interface PrivacyPreferences {
  cam: boolean;
  mic: boolean;
  hr: boolean;
  gps: boolean;
  social: boolean;
  nft: boolean;
}

export const PrivacyToggleManager: React.FC = () => {
  const [preferences, setPreferences] = useState<PrivacyPreferences>({
    cam: false,
    mic: false,
    hr: false,
    gps: false,
    social: false,
    nft: false
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Simulation de chargement des préférences
      const savedPrefs = localStorage.getItem('privacy-preferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      logger.error('Error loading preferences', error as Error, 'SYSTEM');
    }
  };

  const updatePreference = async (key: keyof PrivacyPreferences, value: boolean) => {
    setSaving(true);
    
    try {
      const newPrefs = { ...preferences, [key]: value };
      setPreferences(newPrefs);
      
      // Sauvegarder localement (dans la vraie app, appeler API)
      localStorage.setItem('privacy-preferences', JSON.stringify(newPrefs));
      
      // Analytics anonyme
      analyticsService.trackPrivacyToggle(key, value);
      
      toast({
        title: "Préférence mise à jour",
        description: `${getToggleLabel(key)} ${value ? 'activé' : 'désactivé'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la préférence",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getToggleIcon = (key: keyof PrivacyPreferences) => {
    const icons = {
      cam: Camera,
      mic: Mic,
      hr: Heart,
      gps: MapPin,
      social: Users,
      nft: Coins
    };
    return icons[key];
  };

  const getToggleLabel = (key: keyof PrivacyPreferences): string => {
    const labels = {
      cam: 'Caméra',
      mic: 'Microphone',
      hr: 'Capteur cardiaque',
      gps: 'Géolocalisation',
      social: 'Partage social',
      nft: 'NFT & Blockchain'
    };
    return labels[key];
  };

  const getToggleDescription = (key: keyof PrivacyPreferences): string => {
    const descriptions = {
      cam: 'Autoriser l\'accès à votre caméra pour le scan facial et les fonctionnalités AR',
      mic: 'Autoriser l\'accès au microphone pour l\'analyse vocale et les commandes audio',
      hr: 'Autoriser la connexion aux capteurs de fréquence cardiaque (Bluetooth, montres connectées)',
      gps: 'Autoriser l\'accès à votre position pour les recommandations contextuelles',
      social: 'Autoriser le partage de vos achievements et progrès avec d\'autres utilisateurs',
      nft: 'Autoriser les fonctionnalités blockchain et la création de NFT personnalisés'
    };
    return descriptions[key];
  };

  const getToggleFallback = (key: keyof PrivacyPreferences): string => {
    const fallbacks = {
      cam: 'Mode questionnaire disponible',
      mic: 'Saisie textuelle disponible',
      hr: 'Simulation de données disponible',
      gps: 'Recommandations génériques',
      social: 'Mode privé uniquement',
      nft: 'Fonctionnalités désactivées'
    };
    return fallbacks[key];
  };

  const toggles: (keyof PrivacyPreferences)[] = ['cam', 'mic', 'hr', 'gps', 'social', 'nft'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion de la confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Contrôle total</h4>
                <p className="text-sm text-blue-700">
                  Vous gardez le contrôle complet de vos données. Chaque fonctionnalité 
                  dispose d'alternatives respectueuses de votre vie privée.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {toggles.map((key) => {
              const IconComponent = getToggleIcon(key);
              const isEnabled = preferences[key];
              
              return (
                <div key={key} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-3 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`w-5 h-5 ${isEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{getToggleLabel(key)}</h4>
                      <div className="flex items-center gap-3">
                        <Badge variant={isEnabled ? "default" : "secondary"}>
                          {isEnabled ? 'Activé' : 'Désactivé'}
                        </Badge>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(value) => updatePreference(key, value)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {getToggleDescription(key)}
                    </p>
                    
                    {!isEnabled && (
                      <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
                        <strong>Fallback:</strong> {getToggleFallback(key)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé des impacts */}
      <Card>
        <CardHeader>
          <CardTitle>Impact sur l'expérience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3 text-green-800">Fonctionnalités activées</h4>
              <div className="space-y-2">
                {toggles.filter(key => preferences[key]).map((key) => {
                  const IconComponent = getToggleIcon(key);
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <IconComponent className="w-4 h-4 text-green-600" />
                      <span>{getToggleLabel(key)}</span>
                    </div>
                  );
                })}
                {toggles.filter(key => preferences[key]).length === 0 && (
                  <p className="text-sm text-gray-500">Aucune fonctionnalité activée</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-gray-600">Fallbacks disponibles</h4>
              <div className="space-y-2">
                {toggles.filter(key => !preferences[key]).map((key) => (
                  <div key={key} className="text-sm text-gray-600">
                    <strong>{getToggleLabel(key)}:</strong> {getToggleFallback(key)}
                  </div>
                ))}
                {toggles.filter(key => !preferences[key]).length === 0 && (
                  <p className="text-sm text-gray-500">Toutes les fonctionnalités sont activées</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};