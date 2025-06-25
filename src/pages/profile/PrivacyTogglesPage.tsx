
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Eye, Database, Download, Trash2, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: string;
  impact: 'low' | 'medium' | 'high';
  required: boolean;
}

const PrivacyTogglesPage: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'analytics',
      title: 'Analyses d\'utilisation',
      description: 'Autoriser la collecte de données anonymes pour améliorer l\'expérience',
      enabled: true,
      category: 'analytics',
      impact: 'low',
      required: false
    },
    {
      id: 'emotion-tracking',
      title: 'Suivi émotionnel',
      description: 'Enregistrer tes données émotionnelles pour le coaching personnalisé',
      enabled: true,
      category: 'core',
      impact: 'high',
      required: true
    },
    {
      id: 'location',
      title: 'Localisation',
      description: 'Accéder à ta position pour des recommandations contextuelles',
      enabled: false,
      category: 'features',
      impact: 'medium',
      required: false
    },
    {
      id: 'voice-recording',
      title: 'Enregistrements vocaux',
      description: 'Sauvegarder tes analyses vocales pour améliorer la précision',
      enabled: true,
      category: 'core',
      impact: 'high',
      required: false
    },
    {
      id: 'marketing',
      title: 'Communications marketing',
      description: 'Recevoir des offres et nouveautés personnalisées',
      enabled: false,
      category: 'communication',
      impact: 'low',
      required: false
    },
    {
      id: 'third-party',
      title: 'Partenaires tiers',
      description: 'Partager des données anonymisées avec nos partenaires de recherche',
      enabled: false,
      category: 'analytics',
      impact: 'medium',
      required: false
    },
    {
      id: 'crash-reports',
      title: 'Rapports de bug',
      description: 'Envoyer automatiquement les rapports d\'erreur pour corriger les bugs',
      enabled: true,
      category: 'technical',
      impact: 'low',
      required: false
    },
    {
      id: 'ai-training',
      title: 'Amélioration IA',
      description: 'Utiliser tes données pour entraîner nos modèles d\'intelligence artificielle',
      enabled: true,
      category: 'ai',
      impact: 'medium',
      required: false
    }
  ]);

  const [showDataRequest, setShowDataRequest] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const categories = {
    core: { name: 'Fonctionnalités essentielles', icon: Shield, color: 'text-green-500' },
    analytics: { name: 'Analyses et mesures', icon: Database, color: 'text-blue-500' },
    features: { name: 'Fonctionnalités avancées', icon: Eye, color: 'text-purple-500' },
    communication: { name: 'Communications', icon: Lock, color: 'text-orange-500' },
    technical: { name: 'Technique', icon: Database, color: 'text-gray-500' },
    ai: { name: 'Intelligence artificielle', icon: Database, color: 'text-pink-500' }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return 'Inconnu';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🔐 Contrôles de Confidentialité
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Gérez facilement vos préférences de confidentialité et vos données personnelles
          </p>
        </motion.div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="privacy">🔒 Confidentialité</TabsTrigger>
            <TabsTrigger value="data">📊 Mes données</TabsTrigger>
            <TabsTrigger value="account">⚙️ Compte</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <div className="space-y-6">
              {/* Résumé de la confidentialité */}
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Résumé de vos paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {settings.filter(s => s.enabled).length}
                      </div>
                      <div className="text-sm text-blue-200">Activés</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">
                        {settings.filter(s => !s.enabled).length}
                      </div>
                      <div className="text-sm text-blue-200">Désactivés</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {settings.filter(s => s.required).length}
                      </div>
                      <div className="text-sm text-blue-200">Obligatoires</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {settings.filter(s => s.impact === 'high').length}
                      </div>
                      <div className="text-sm text-blue-200">Impact élevé</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres par catégorie */}
              {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
                const categorySettings = settings.filter(s => s.category === categoryKey);
                if (categorySettings.length === 0) return null;

                const IconComponent = categoryInfo.icon;
                
                return (
                  <Card key={categoryKey} className="bg-black/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className={`${categoryInfo.color} flex items-center gap-2`}>
                        <IconComponent className="w-5 h-5" />
                        {categoryInfo.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categorySettings.map((setting) => (
                          <div 
                            key={setting.id} 
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                            data-testid={`privacy-setting-${setting.id}`}
                          >
                            <div className="flex-1 mr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">{setting.title}</h3>
                                {setting.required && (
                                  <Badge variant="secondary" className="text-xs">
                                    Obligatoire
                                  </Badge>
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getImpactColor(setting.impact)}`}
                                >
                                  Impact {getImpactLabel(setting.impact)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-300">{setting.description}</p>
                            </div>
                            <Switch
                              checked={setting.enabled}
                              onCheckedChange={() => toggleSetting(setting.id)}
                              disabled={setting.required}
                              data-testid={`toggle-${setting.id}`}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Télécharger mes données
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Obtenez une copie de toutes vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-300">
                    <p>Vous pouvez demander une copie de :</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Données émotionnelles et analyses</li>
                      <li>Enregistrements vocaux</li>
                      <li>Journal personnel</li>
                      <li>Paramètres de compte</li>
                      <li>Historique d'activité</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => setShowDataRequest(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    data-testid="request-data-download"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Demander le téléchargement
                  </Button>
                  {showDataRequest && (
                    <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Demande enregistrée ! Vous recevrez un email dans 48h.</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-400 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Utilisation des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sessions enregistrées:</span>
                      <Badge variant="outline">247</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Analyses vocales:</span>
                      <Badge variant="outline">89</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Entrées journal:</span>
                      <Badge variant="outline">156</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Données partagées:</span>
                      <Badge variant="outline">0</Badge>
                    </div>
                    <div className="border-t border-gray-600 pt-4">
                      <div className="text-sm text-gray-400">
                        Dernière mise à jour: Il y a 2 minutes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="bg-black/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Zone de danger
                  </CardTitle>
                  <CardDescription className="text-yellow-200">
                    Actions irréversibles sur votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-500/30 rounded-lg bg-red-900/20">
                    <h3 className="font-semibold text-red-400 mb-2">Suppression du compte</h3>
                    <p className="text-sm text-red-200 mb-4">
                      Cette action supprimera définitivement votre compte et toutes vos données. 
                      Cette action est irréversible.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowDeleteAccount(true)}
                      data-testid="delete-account-button"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                    {showDeleteAccount && (
                      <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <p className="text-sm text-red-200 mb-3">
                          Êtes-vous absolument sûr ? Cette action ne peut pas être annulée.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive">
                            Oui, supprimer définitivement
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowDeleteAccount(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-gray-500/30 rounded-lg bg-gray-900/20">
                    <h3 className="font-semibold text-gray-400 mb-2">Désactiver temporairement</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Suspendre votre compte temporairement sans perdre vos données.
                    </p>
                    <Button variant="outline">
                      Désactiver temporairement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Informations de contact DPO */}
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">📧 Contact confidentialité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Délégué à la protection des données :</span>
                      <div className="text-white">dpo@emotionscare.com</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Support confidentialité :</span>
                      <div className="text-white">privacy@emotionscare.com</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Temps de réponse :</span>
                      <div className="text-white">48h maximum</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrivacyTogglesPage;
