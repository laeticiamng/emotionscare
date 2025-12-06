// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, FileText, Download, Eye, Trash2, AlertCircle, CheckCircle, Clock, Database, Key, Lock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface DataExport {
  id: string;
  type: string;
  size: string;
  date: string;
  status: 'processing' | 'ready' | 'expired';
  downloadUrl?: string;
}

interface DataRequest {
  id: string;
  type: 'access' | 'portability' | 'deletion' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
  description: string;
  response?: string;
}

const B2CDataPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dataExports, setDataExports] = useState<DataExport[]>([]);
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [privacyScore, setPrivacyScore] = useState(85);
  const [dataStats, setDataStats] = useState({
    totalRecords: 0,
    personalData: 0,
    anonymizedData: 0,
    sharedData: 0
  });

  useEffect(() => {
    loadUserData();
    loadDataRequests();
    calculatePrivacyScore();
  }, []);

  const loadUserData = async () => {
    try {
      // Simuler le chargement des statistiques de données
      const mockStats = {
        totalRecords: 1247,
        personalData: 892,
        anonymizedData: 355,
        sharedData: 12
      };
      setDataStats(mockStats);

      // Charger les exports précédents
      const mockExports: DataExport[] = [
        {
          id: '1',
          type: 'Données personnelles complètes',
          size: '2.4 MB',
          date: '2024-01-15',
          status: 'ready',
          downloadUrl: '/exports/personal-data-2024-01-15.zip'
        },
        {
          id: '2',
          type: 'Historique d\'activité',
          size: '890 KB',
          date: '2024-01-10',
          status: 'expired'
        }
      ];
      setDataExports(mockExports);
    } catch (error) {
      logger.error('Erreur chargement données', error as Error, 'SYSTEM');
    }
  };

  const loadDataRequests = async () => {
    try {
      const mockRequests: DataRequest[] = [
        {
          id: '1',
          type: 'access',
          status: 'completed',
          created_at: '2024-01-20T10:00:00Z',
          description: 'Demande d\'accès aux données personnelles',
          response: 'Données fournies via export sécurisé'
        },
        {
          id: '2',
          type: 'rectification',
          status: 'pending',
          created_at: '2024-01-22T14:30:00Z',
          description: 'Correction des informations de profil'
        }
      ];
      setDataRequests(mockRequests);
    } catch (error) {
      logger.error('Erreur chargement demandes', error as Error, 'SYSTEM');
    }
  };

  const calculatePrivacyScore = () => {
    // Calculer le score de confidentialité basé sur différents facteurs
    let score = 70; // Score de base
    
    // Bonus pour les paramètres activés
    score += 10; // RLS activée
    score += 5;  // Chiffrement activé
    
    setPrivacyScore(Math.min(score, 100));
  };

  const requestDataExport = async (exportType: 'all' | 'personal' | 'activity' | 'analytics') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Animation de progression
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Simuler le processus d'export
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setExportProgress(100);

      const newExport: DataExport = {
        id: Date.now().toString(),
        type: {
          all: 'Export complet',
          personal: 'Données personnelles',
          activity: 'Historique d\'activité',
          analytics: 'Données analytiques'
        }[exportType],
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
        status: 'processing'
      };

      setDataExports(prev => [newExport, ...prev]);

      // Simuler le traitement
      setTimeout(() => {
        setDataExports(prev => prev.map(exp => 
          exp.id === newExport.id 
            ? { ...exp, status: 'ready' as const, downloadUrl: `/exports/${exp.type.toLowerCase().replace(/\s+/g, '-')}-${exp.date}.zip` }
            : exp
        ));
        
        toast({
          title: "Export prêt!",
          description: "Vos données sont prêtes à être téléchargées",
        });
      }, 5000);

      toast({
        title: "Export démarré",
        description: "Votre demande d'export est en cours de traitement",
      });

    } catch (error) {
      logger.error('Erreur export', error as Error, 'SYSTEM');
      toast({
        title: "Erreur d'export",
        description: "Impossible de créer l'export. Réessayez plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  const submitDataRequest = async (type: DataRequest['type'], description: string) => {
    try {
      const newRequest: DataRequest = {
        id: Date.now().toString(),
        type,
        status: 'pending',
        created_at: new Date().toISOString(),
        description
      };

      setDataRequests(prev => [newRequest, ...prev]);

      toast({
        title: "Demande soumise",
        description: "Votre demande sera traitée dans les 30 jours",
      });
    } catch (error) {
      logger.error('Erreur demande', error as Error, 'SYSTEM');
      toast({
        title: "Erreur de soumission",
        description: "Impossible de soumettre la demande",
        variant: "destructive"
      });
    }
  };

  const downloadExport = (exportItem: DataExport) => {
    if (exportItem.status !== 'ready' || !exportItem.downloadUrl) return;
    
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = exportItem.downloadUrl;
    link.download = exportItem.downloadUrl.split('/').pop() || 'export.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Téléchargement démarré",
      description: `Export "${exportItem.type}" en cours de téléchargement`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing': case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'expired': case 'rejected': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': case 'completed': return 'border-success text-success';
      case 'processing': case 'pending': return 'border-warning text-warning';
      case 'expired': case 'rejected': return 'border-destructive text-destructive';
      default: return 'border-muted text-muted-foreground';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')} className="text-primary-foreground hover:bg-background/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Gestion des Données
              </h1>
              <p className="text-gray-300">Contrôlez et gérez vos données personnelles</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Score RGPD</div>
              <div className="text-3xl font-bold text-success">
                {privacyScore}%
              </div>
            </div>
            <Shield className="w-8 h-8 text-success" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-info/30 to-info/20 backdrop-blur-sm border-info/30">
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold text-foreground">{dataStats.totalRecords}</div>
              <div className="text-sm text-muted-foreground">Enregistrements totaux</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent/30 to-accent/20 backdrop-blur-sm border-accent/30">
            <CardContent className="p-4 text-center">
              <Key className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">{dataStats.personalData}</div>
              <div className="text-sm text-muted-foreground">Données personnelles</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-success/30 to-success/20 backdrop-blur-sm border-success/30">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">{dataStats.anonymizedData}</div>
              <div className="text-sm text-muted-foreground">Données anonymisées</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-warning/30 to-destructive/20 backdrop-blur-sm border-warning/30">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">{dataStats.sharedData}</div>
              <div className="text-sm text-muted-foreground">Données partagées</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="exports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-info/30">
            <TabsTrigger value="exports" className="data-[state=active]:bg-info/20 data-[state=active]:text-info">
              Exports de données
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
              Mes demandes
            </TabsTrigger>
            <TabsTrigger value="rights" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
              Droits RGPD
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exports" className="space-y-6">
            {/* Export Actions */}
            <Card className="bg-card/50 backdrop-blur-sm border-info/30">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exporter mes données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isExporting && (
                  <div className="mb-4">
                    <Progress value={exportProgress} className="w-full" />
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Préparation de l'export... {Math.round(exportProgress)}%
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => requestDataExport('all')}
                    disabled={isExporting}
                    variant="outline" 
                    className="p-6 h-auto flex-col bg-transparent border-info text-info hover:bg-info/10"
                  >
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="font-medium">Export complet</span>
                    <span className="text-xs opacity-70">Toutes vos données</span>
                  </Button>
                  
                  <Button 
                    onClick={() => requestDataExport('personal')}
                    disabled={isExporting}
                    variant="outline" 
                    className="p-6 h-auto flex-col bg-transparent border-accent text-accent hover:bg-accent/10"
                  >
                    <Key className="w-8 h-8 mb-2" />
                    <span className="font-medium">Données personnelles</span>
                    <span className="text-xs opacity-70">Profil et préférences</span>
                  </Button>
                  
                  <Button 
                    onClick={() => requestDataExport('activity')}
                    disabled={isExporting}
                    variant="outline" 
                    className="p-6 h-auto flex-col bg-transparent border-success text-success hover:bg-success/10"
                  >
                    <Database className="w-8 h-8 mb-2" />
                    <span className="font-medium">Historique d'activité</span>
                    <span className="text-xs opacity-70">Sessions et interactions</span>
                  </Button>
                  
                  <Button 
                    onClick={() => requestDataExport('analytics')}
                    disabled={isExporting}
                    variant="outline" 
                    className="p-6 h-auto flex-col bg-transparent border-warning text-warning hover:bg-warning/10"
                  >
                    <Globe className="w-8 h-8 mb-2" />
                    <span className="font-medium">Données analytiques</span>
                    <span className="text-xs opacity-70">Métriques anonymisées</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Exports */}
            <Card className="bg-card/50 backdrop-blur-sm border-info/30">
              <CardHeader>
                <CardTitle className="text-foreground">Exports précédents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataExports.map(exportItem => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-info" />
                        <div>
                          <div className="font-medium text-foreground">{exportItem.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {exportItem.size} • {new Date(exportItem.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`${getStatusColor(exportItem.status)} bg-transparent`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(exportItem.status)}
                            {exportItem.status}
                          </div>
                        </Badge>
                        {exportItem.status === 'ready' && (
                          <Button 
                            onClick={() => downloadExport(exportItem)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {dataExports.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Aucun export disponible</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {/* New Request */}
            <Card className="bg-card/50 backdrop-blur-sm border-accent/30">
              <CardHeader>
                <CardTitle className="text-foreground">Nouvelle demande RGPD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => submitDataRequest('access', 'Demande d\'accès à mes données personnelles')}
                    variant="outline" 
                    className="p-4 h-auto flex-col bg-transparent border-info text-info hover:bg-info/10"
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Droit d'accès</span>
                  </Button>
                  
                  <Button 
                    onClick={() => submitDataRequest('rectification', 'Demande de rectification de données')}
                    variant="outline" 
                    className="p-4 h-auto flex-col bg-transparent border-warning text-warning hover:bg-warning/10"
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    <span>Droit de rectification</span>
                  </Button>
                  
                  <Button 
                    onClick={() => submitDataRequest('portability', 'Demande de portabilité des données')}
                    variant="outline" 
                    className="p-4 h-auto flex-col bg-transparent border-success text-success hover:bg-success/10"
                  >
                    <Download className="w-6 h-6 mb-2" />
                    <span>Droit de portabilité</span>
                  </Button>
                  
                  <Button 
                    onClick={() => submitDataRequest('deletion', 'Demande de suppression de données')}
                    variant="outline" 
                    className="p-4 h-auto flex-col bg-transparent border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-6 h-6 mb-2" />
                    <span>Droit à l'effacement</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requests History */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Historique des demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataRequests.map(request => (
                    <div key={request.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white capitalize">
                            Droit {request.type === 'access' ? 'd\'accès' : 
                                   request.type === 'portability' ? 'de portabilité' :
                                   request.type === 'deletion' ? 'à l\'effacement' : 
                                   'de rectification'}
                          </span>
                          <Badge variant="outline" className={`${getStatusColor(request.status)} bg-transparent`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{request.description}</p>
                      {request.response && (
                        <div className="text-sm text-green-300 bg-green-900/20 p-2 rounded">
                          Réponse: {request.response}
                        </div>
                      )}
                    </div>
                  ))}
                  {dataRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Aucune demande soumise</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rights" className="space-y-6">
            <Card className="bg-black/50 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Vos droits selon le RGPD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Droit d'accès */}
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-white">Droit d'accès</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Vous avez le droit de savoir quelles données personnelles nous détenons sur vous 
                      et comment elles sont utilisées.
                    </p>
                    <div className="flex items-center text-xs text-green-300">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Disponible immédiatement
                    </div>
                  </div>

                  {/* Droit de rectification */}
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-semibold text-white">Droit de rectification</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Vous pouvez demander la correction de données inexactes ou incomplètes 
                      vous concernant.
                    </p>
                    <div className="flex items-center text-xs text-green-300">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Traitement sous 30 jours
                    </div>
                  </div>

                  {/* Droit à l'effacement */}
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Trash2 className="w-5 h-5 text-red-400" />
                      <h3 className="font-semibold text-white">Droit à l'effacement</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Vous pouvez demander la suppression de vos données personnelles 
                      dans certaines conditions.
                    </p>
                    <div className="flex items-center text-xs text-yellow-300">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Sous réserve d'obligations légales
                    </div>
                  </div>

                  {/* Droit de portabilité */}
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold text-white">Droit de portabilité</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Vous pouvez récupérer vos données dans un format structuré 
                      pour les transférer ailleurs.
                    </p>
                    <div className="flex items-center text-xs text-green-300">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Export automatisé disponible
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Délégué à la Protection des Données</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Pour toute question relative à vos données personnelles ou à l'exercice de vos droits :
                  </p>
                  <div className="text-sm text-blue-300">
                    📧 dpo@emotionscare.com<br />
                    📞 +33 1 23 45 67 89<br />
                    📍 123 Avenue de la Protection des Données, 75001 Paris
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CDataPrivacyPage;