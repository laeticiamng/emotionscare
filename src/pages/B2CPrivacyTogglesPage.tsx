import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Settings, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CPrivacyTogglesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    dataCollection: true,
    locationTracking: false,
    voiceRecording: true,
    analytics: false,
    notifications: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: value ? "Paramètre activé" : "Paramètre désactivé",
      description: `Configuration mise à jour`
    });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 text-white">
          <Button variant="ghost" onClick={() => navigate('/app/home')} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Paramètres de Confidentialité</h1>
            <p className="text-gray-300">Contrôlez vos données et votre vie privée</p>
          </div>
        </div>

        <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Gestion des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries({
              dataCollection: "Collecte des données d'usage",
              locationTracking: "Partage de localisation", 
              voiceRecording: "Enregistrement vocal",
              analytics: "Données analytiques",
              notifications: "Notifications personnalisées"
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">{label}</span>
                </div>
                <Switch
                  checked={settings[key as keyof typeof settings]}
                  onCheckedChange={(value) => updateSetting(key, value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CPrivacyTogglesPage;