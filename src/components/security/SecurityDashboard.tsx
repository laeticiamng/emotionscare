
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Download, Trash2, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'access' | 'data_export' | 'data_deletion' | 'permission_change';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  deviceInfo?: string;
}

interface PrivacyPreference {
  id: string;
  category: string;
  name: string;
  description: string;
  enabled: boolean;
  required: boolean;
}

const SecurityDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      timestamp: '2024-01-20T10:30:00Z',
      description: 'Connexion réussie depuis Paris, France',
      severity: 'low',
      location: 'Paris, France',
      deviceInfo: 'Chrome sur Windows'
    },
    {
      id: '2',
      type: 'access',
      timestamp: '2024-01-20T10:35:00Z',
      description: 'Accès aux données de santé mentale',
      severity: 'medium',
      location: 'Paris, France'
    },
    {
      id: '3',
      type: 'data_export',
      timestamp: '2024-01-19T14:20:00Z',
      description: 'Export des données personnelles demandé',
      severity: 'high',
      location: 'Paris, France'
    }
  ]);

  const [privacyPreferences, setPrivacyPreferences] = useState<PrivacyPreference[]>([
    {
      id: '1',
      category: 'Données essentielles',
      name: 'Authentification',
      description: 'Stockage sécurisé des identifiants de connexion',
      enabled: true,
      required: true
    },
    {
      id: '2',
      category: 'Données de santé',
      name: 'Analyses émotionnelles',
      description: 'Traitement des données du scanner d\'émotions',
      enabled: true,
      required: false
    },
    {
      id: '3',
      category: 'Personnalisation',
      name: 'Préférences musicales',
      description: 'Recommandations musicales personnalisées',
      enabled: true,
      required: false
    },
    {
      id: '4',
      category: 'Analytics',
      name: 'Données d\'usage',
      description: 'Amélioration de l\'expérience utilisateur',
      enabled: false,
      required: false
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return <Eye className="h-4 w-4" />;
      case 'data_export': return <Download className="h-4 w-4" />;
      case 'data_deletion': return <Trash2 className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const togglePreference = (id: string) => {
    setPrivacyPreferences(prev => 
      prev.map(pref => 
        pref.id === id && !pref.required 
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
  };

  const exportData = () => {
    // Simuler l'export des données
    console.log('Export des données personnelles initié');
  };

  const requestDeletion = () => {
    // Simuler la demande de suppression
    console.log('Demande de suppression des données initiée');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Sécurité & Confidentialité
        </h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Conforme RGPD
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="events">Journaux d'audit</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="rights">Mes droits RGPD</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Score de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">95/100</div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dernière connexion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Aujourd'hui à 10:30</div>
                <div className="text-xs text-muted-foreground">Paris, France</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Événements récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityEvents.length}</div>
                <div className="text-xs text-muted-foreground">Cette semaine</div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Votre compte est sécurisé et conforme aux standards RGPD. 
              Toutes vos données sont chiffrées et protégées.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'audit</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <AnimatePresence>
                  {securityEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-start gap-3 p-3 border-b last:border-b-0"
                    >
                      <div className={`p-2 rounded-full ${getSeverityColor(event.severity)} text-white`}>
                        {getTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString('fr-FR')}
                        </div>
                        {event.deviceInfo && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {event.deviceInfo}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className={`${getSeverityColor(event.severity)} text-white border-0`}>
                        {event.severity}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(
                privacyPreferences.reduce((acc, pref) => {
                  if (!acc[pref.category]) acc[pref.category] = [];
                  acc[pref.category].push(pref);
                  return acc;
                }, {} as Record<string, PrivacyPreference[]>)
              ).map(([category, prefs]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h3>
                  {prefs.map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{pref.name}</div>
                        <div className="text-sm text-muted-foreground">{pref.description}</div>
                        {pref.required && (
                          <Badge variant="outline" className="mt-1 text-xs">Obligatoire</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={pref.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePreference(pref.id)}
                          disabled={pref.required}
                        >
                          {pref.enabled ? 'Activé' : 'Désactivé'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exporter mes données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Téléchargez toutes vos données personnelles dans un format lisible et portable.
                </p>
                <Button onClick={exportData} className="w-full">
                  Demander l'export
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Supprimer mes données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Demandez la suppression définitive de toutes vos données personnelles.
                </p>
                <Button variant="destructive" onClick={requestDeletion} className="w-full">
                  Demander la suppression
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Vos droits RGPD :</strong> Vous disposez d'un droit d'accès, de rectification, 
              d'effacement, de portabilité et d'opposition concernant vos données personnelles. 
              Ces demandes sont traitées sous 30 jours.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
