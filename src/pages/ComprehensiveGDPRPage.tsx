import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Download, 
  Trash2, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';
import PageSEO from '@/components/seo/PageSEO';
import { useToast } from '@/hooks/use-toast';

/**
 * ComprehensiveGDPRPage - Conformité RGPD complète
 * Gestion des droits utilisateurs selon le règlement européen
 */
const ComprehensiveGDPRPage: React.FC = () => {
  const { toast } = useToast();
  
  const [consents, setConsents] = useState({
    analytics: true,
    marketing: false,
    research: false,
    thirdParty: false
  });

  const [dataRequests, setDataRequests] = useState([
    { id: 1, type: 'export', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'deletion', date: '2024-01-10', status: 'pending' }
  ]);

  const dataCategories = [
    { name: 'Données de profil', description: 'Nom, email, téléphone', size: '12 KB', sensitive: false },
    { name: 'Données émotionnelles', description: 'Analyses et historiques de scan', size: '2.4 MB', sensitive: true },
    { name: 'Données d\'usage', description: 'Sessions, préférences, statistiques', size: '850 KB', sensitive: false },
    { name: 'Données de communication', description: 'Messages, feedback, support', size: '1.2 MB', sensitive: false }
  ];

  const handleConsentChange = (key: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
    toast({ 
      title: 'Consentement mis à jour', 
      description: `Votre choix concernant ${key} a été enregistré` 
    });
  };

  const requestDataExport = () => {
    const newRequest = {
      id: Date.now(),
      type: 'export' as const,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };
    
    setDataRequests(prev => [newRequest, ...prev]);
    
    toast({ 
      title: 'Demande d\'export créée', 
      description: 'Vous recevrez vos données par email sous 30 jours maximum',
      duration: 5000
    });
  };

  const requestDataDeletion = () => {
    const newRequest = {
      id: Date.now(),
      type: 'deletion' as const,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };
    
    setDataRequests(prev => [newRequest, ...prev]);
    
    toast({ 
      title: 'Demande de suppression créée', 
      description: 'Votre demande sera traitée sous 30 jours maximum',
      duration: 5000,
      variant: 'destructive'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En cours';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  return (
    <>
      <PageSEO 
        title="RGPD & Confidentialité - EmotionsCare"
        description="Gérez vos données personnelles et vos droits selon le RGPD"
        keywords="RGPD, confidentialité, données personnelles, export, suppression"
      />
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">RGPD & Confidentialité</h1>
                <p className="text-muted-foreground">
                  Gérez vos données personnelles selon le règlement européen
                </p>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Conformément au RGPD, vous disposez de droits sur vos données personnelles. 
                Cette page vous permet d'exercer ces droits en toute simplicité.
              </AlertDescription>
            </Alert>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="consents">Consentements</TabsTrigger>
              <TabsTrigger value="requests">Mes Demandes</TabsTrigger>
              <TabsTrigger value="rights">Mes Droits</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Données Collectées
                    </CardTitle>
                    <CardDescription>
                      Aperçu de vos données stockées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dataCategories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              {category.sensitive && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Sensible
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          <span className="text-sm font-mono">{category.size}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Actions Rapides
                    </CardTitle>
                    <CardDescription>
                      Exercez vos droits RGPD
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={requestDataExport} className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger mes Données
                    </Button>
                    
                    <Button onClick={requestDataDeletion} className="w-full" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mes Données
                    </Button>
                    
                    <div className="text-xs text-muted-foreground">
                      Délai de traitement maximum : 30 jours calendaires
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="consents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Consentements</CardTitle>
                  <CardDescription>
                    Modifiez vos autorisations à tout moment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="analytics"
                        checked={consents.analytics}
                        onCheckedChange={(checked) => handleConsentChange('analytics', !!checked)}
                      />
                      <div className="space-y-1">
                        <label htmlFor="analytics" className="text-sm font-medium leading-none">
                          Analyses et amélioration du service
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Utilisation anonymisée des données pour améliorer l'application
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="marketing"
                        checked={consents.marketing}
                        onCheckedChange={(checked) => handleConsentChange('marketing', !!checked)}
                      />
                      <div className="space-y-1">
                        <label htmlFor="marketing" className="text-sm font-medium leading-none">
                          Communications marketing
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des offres personnalisées et actualités du service
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="research"
                        checked={consents.research}
                        onCheckedChange={(checked) => handleConsentChange('research', !!checked)}
                      />
                      <div className="space-y-1">
                        <label htmlFor="research" className="text-sm font-medium leading-none">
                          Recherche médicale
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Participation à des études anonymisées sur le bien-être mental
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="thirdParty"
                        checked={consents.thirdParty}
                        onCheckedChange={(checked) => handleConsentChange('thirdParty', !!checked)}
                      />
                      <div className="space-y-1">
                        <label htmlFor="thirdParty" className="text-sm font-medium leading-none">
                          Partenaires tiers
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Partage avec des partenaires sélectionnés pour des services complémentaires
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Vous pouvez retirer votre consentement à tout moment. 
                      Cela n'affectera pas la licéité du traitement fondé sur le consentement avant son retrait.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Demandes</CardTitle>
                  <CardDescription>
                    Suivez le statut de vos demandes RGPD
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <div className="font-medium">
                              {request.type === 'export' ? 'Export de données' : 'Suppression de données'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Demande du {new Date(request.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            request.status === 'completed' ? 'text-green-600' :
                            request.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {getStatusText(request.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dataRequests.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        Aucune demande RGPD en cours
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vos Droits RGPD</CardTitle>
                  <CardDescription>
                    Comprendre vos droits sur vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit d'accès</h4>
                        <p className="text-sm text-muted-foreground">
                          Obtenir une copie de vos données personnelles que nous traitons.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit de rectification</h4>
                        <p className="text-sm text-muted-foreground">
                          Corriger les données inexactes ou incomplètes vous concernant.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit à l'effacement</h4>
                        <p className="text-sm text-muted-foreground">
                          Demander la suppression de vos données dans certains cas.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit à la portabilité</h4>
                        <p className="text-sm text-muted-foreground">
                          Récupérer vos données dans un format structuré et lisible.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit d'opposition</h4>
                        <p className="text-sm text-muted-foreground">
                          Vous opposer au traitement de vos données pour des raisons légitimes.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Droit de limitation</h4>
                        <p className="text-sm text-muted-foreground">
                          Limiter le traitement de vos données dans certaines circonstances.
                        </p>
                      </div>
                    </div>
                    
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        Pour exercer vos droits, contactez-nous à privacy@emotionscare.com ou 
                        utilisez les outils disponibles sur cette page. Nous vous répondrons dans les 30 jours.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ComprehensiveGDPRPage;