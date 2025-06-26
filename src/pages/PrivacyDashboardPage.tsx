
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Lock, 
  Globe, 
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'data' | 'sharing' | 'communications' | 'analytics';
  impact: 'low' | 'medium' | 'high';
  required?: boolean;
}

interface DataCategory {
  name: string;
  description: string;
  size: string;
  lastUpdated: Date;
  canExport: boolean;
  canDelete: boolean;
  icon: React.ReactElement;
}

const PrivacyDashboardPage: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'data-collection',
      title: 'Collecte de données d\'usage',
      description: 'Collecte d\'informations sur votre utilisation pour améliorer l\'expérience',
      enabled: true,
      category: 'data',
      impact: 'medium'
    },
    {
      id: 'personalization',
      title: 'Personnalisation',
      description: 'Utilisation de vos données pour personnaliser votre expérience',
      enabled: true,
      category: 'data',
      impact: 'high',
      required: true
    },
    {
      id: 'analytics',
      title: 'Analytics anonymisées',
      description: 'Partage de données anonymisées pour l\'analyse statistique',
      enabled: false,
      category: 'analytics',
      impact: 'low'
    },
    {
      id: 'marketing',
      title: 'Communications marketing',
      description: 'Réception d\'emails et notifications promotionnelles',
      enabled: false,
      category: 'communications',
      impact: 'low'
    },
    {
      id: 'third-party',
      title: 'Partage avec des tiers',
      description: 'Partage de données avec des partenaires de confiance',
      enabled: false,
      category: 'sharing',
      impact: 'high'
    },
    {
      id: 'research',
      title: 'Recherche scientifique',
      description: 'Participation à des études de recherche anonymisées',
      enabled: true,
      category: 'sharing',
      impact: 'medium'
    }
  ]);

  const dataCategories: DataCategory[] = [
    {
      name: 'Profil utilisateur',
      description: 'Informations personnelles et préférences',
      size: '2.5 MB',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      canExport: true,
      canDelete: false,
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Données émotionnelles',
      description: 'Historique des états émotionnels et analyses',
      size: '15.8 MB',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      canExport: true,
      canDelete: true,
      icon: <Eye className="h-5 w-5" />
    },
    {
      name: 'Sessions d\'activités',
      description: 'Historique des méditations, VR, et autres activités',
      size: '8.3 MB',
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
      canExport: true,
      canDelete: true,
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'Données de biofeedback',
      description: 'Mesures physiologiques et capteurs',
      size: '45.2 MB',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      canExport: true,
      canDelete: true,
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: 'Préférences et paramètres',
      description: 'Configuration de l\'application',
      size: '156 KB',
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      canExport: true,
      canDelete: false,
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const privacyScore = 85;
  const dataRetentionDays = 365;
  const encryptionLevel = 'AES-256';

  const categoryIcons = {
    data: <Database className="h-4 w-4" />,
    sharing: <Users className="h-4 w-4" />,
    communications: <Globe className="h-4 w-4" />,
    analytics: <FileText className="h-4 w-4" />
  };

  const impactColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const toggleSetting = (settingId: string) => {
    setPrivacySettings(prev => prev.map(setting => {
      if (setting.id === settingId) {
        if (setting.required) {
          toast.error('Ce paramètre est requis pour le fonctionnement de l\'application');
          return setting;
        }
        const newEnabled = !setting.enabled;
        toast.success(`${setting.title} ${newEnabled ? 'activé' : 'désactivé'}`);
        return { ...setting, enabled: newEnabled };
      }
      return setting;
    }));
  };

  const exportData = (categoryName: string) => {
    toast.success(`Export de "${categoryName}" initié - Vous recevrez un email avec le lien de téléchargement`);
  };

  const deleteData = (categoryName: string) => {
    toast.warning(`Suppression de "${categoryName}" - Cette action est irréversible`);
  };

  const requestFullExport = () => {
    toast.success('Demande d\'export complet envoyée - Traitement sous 48h selon le RGPD');
  };

  const requestAccountDeletion = () => {
    toast.error('Demande de suppression de compte - Veuillez confirmer par email');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tableau de Bord Confidentialité
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Contrôlez vos données personnelles et gérez vos préférences de confidentialité en toute transparence.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Privacy Score Overview */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - privacyScore / 100)}`}
                        className="text-blue-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{privacyScore}</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-800">Score de Confidentialité</h3>
                  <p className="text-sm text-gray-600">Excellent niveau de protection</p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Chiffrement</h3>
                  <p className="text-sm text-gray-600">{encryptionLevel}</p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Rétention</h3>
                  <p className="text-sm text-gray-600">{dataRetentionDays} jours max</p>
                </div>

                <div className="text-center">
                  <div className="p-4 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Conformité</h3>
                  <p className="text-sm text-gray-600">RGPD Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="data">Mes Données</TabsTrigger>
              <TabsTrigger value="rights">Mes Droits</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <div className="space-y-6">
                {['data', 'sharing', 'communications', 'analytics'].map((category) => (
                  <Card key={category} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {category === 'data' ? 'Données' :
                         category === 'sharing' ? 'Partage' :
                         category === 'communications' ? 'Communications' :
                         'Analytics'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {privacySettings
                        .filter(setting => setting.category === category)
                        .map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-gray-800">{setting.title}</h3>
                                <Badge className={impactColors[setting.impact]}>
                                  Impact {setting.impact}
                                </Badge>
                                {setting.required && (
                                  <Badge variant="outline">Requis</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{setting.description}</p>
                            </div>
                            <Switch
                              checked={setting.enabled}
                              onCheckedChange={() => toggleSetting(setting.id)}
                              disabled={setting.required}
                            />
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="data">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Mes Données Stockées
                  </CardTitle>
                  <p className="text-gray-600">
                    Aperçu de toutes les données que nous conservons à votre sujet.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dataCategories.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">{category.size}</div>
                          <div className="text-xs text-gray-500">
                            Mis à jour {category.lastUpdated.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {category.canExport && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportData(category.name)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Exporter
                          </Button>
                        )}
                        {category.canDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteData(category.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Vos Droits RGPD
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800">Droit d'accès</h4>
                          <p className="text-sm text-green-600">Consultez toutes vos données</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-800">Droit à la portabilité</h4>
                          <p className="text-sm text-blue-600">Exportez vos données</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Droit de rectification</h4>
                          <p className="text-sm text-yellow-600">Modifiez vos informations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-800">Droit à l'effacement</h4>
                          <p className="text-sm text-red-600">Supprimez vos données</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={requestFullExport}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Demander un export complet
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.info('Formulaire de rectification ouvert')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Corriger mes informations
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.info('Centre d\'aide ouvert - Section Confidentialité')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Signaler un problème
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={requestAccountDeletion}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Activité de Confidentialité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: 'Paramètres de confidentialité mis à jour',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        type: 'settings'
                      },
                      {
                        action: 'Export de données demandé',
                        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        type: 'export'
                      },
                      {
                        action: 'Consentement marketing retiré',
                        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        type: 'consent'
                      },
                      {
                        action: 'Données de session supprimées',
                        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        type: 'deletion'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'settings' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'export' ? 'bg-green-100 text-green-600' :
                            activity.type === 'consent' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {activity.type === 'settings' ? <Settings className="h-4 w-4" /> :
                             activity.type === 'export' ? <Download className="h-4 w-4" /> :
                             activity.type === 'consent' ? <Shield className="h-4 w-4" /> :
                             <Trash2 className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{activity.action}</h4>
                            <p className="text-sm text-gray-600">
                              {activity.timestamp.toLocaleDateString('fr-FR')} à {activity.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Terminé</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboardPage;
