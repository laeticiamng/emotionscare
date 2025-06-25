
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Trash2, 
  Shield, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  User,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { performanceMonitor } from '@/utils/pagePerformanceMonitor';

interface DeletionOption {
  id: string;
  title: string;
  description: string;
  immediate: boolean;
  recoverable: boolean;
}

const AccountDeletePage: React.FC = () => {
  const [confirmText, setConfirmText] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [dataExportRequested, setDataExportRequested] = useState(false);
  const [gdprCompliant, setGdprCompliant] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStep, setCurrentStep] = useState('options');

  React.useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const loadTime = Date.now() - startTime;
      performanceMonitor.recordPageLoad('/account/delete', loadTime);
    };
  }, []);

  const deletionReasons = [
    'Je n\'utilise plus l\'application',
    'J\'ai trouvé une alternative',
    'Problèmes de confidentialité',
    'Interface trop complexe',
    'Fonctionnalités insuffisantes',
    'Autre raison'
  ];

  const deletionOptions: DeletionOption[] = [
    {
      id: 'immediate',
      title: 'Suppression Immédiate',
      description: 'Suppression définitive et immédiate de toutes vos données',
      immediate: true,
      recoverable: false
    },
    {
      id: 'delayed',
      title: 'Suppression Différée (30 jours)',
      description: 'Désactivation immédiate avec suppression définitive dans 30 jours',
      immediate: false,
      recoverable: true
    },
    {
      id: 'anonymize',
      title: 'Anonymisation',
      description: 'Conservation des données anonymisées pour les statistiques',
      immediate: true,
      recoverable: false
    }
  ];

  const handleDataExport = async () => {
    setDataExportRequested(true);
    
    // Simuler l'export de données
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Export de données lancé. Vous recevrez un email avec vos données dans quelques minutes.');
  };

  const handleAccountDeletion = async () => {
    if (confirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    if (!selectedReason) {
      toast.error('Veuillez sélectionner une raison');
      return;
    }

    if (!gdprCompliant) {
      toast.error('Veuillez accepter les conditions RGPD');
      return;
    }

    setIsDeleting(true);
    
    // Simuler la suppression
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Demande de suppression enregistrée. Un email de confirmation vous a été envoyé.');
    setCurrentStep('confirmation');
    setIsDeleting(false);
  };

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center" data-testid="page-root">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Demande Enregistrée</h2>
              <p className="text-gray-600 mb-6">
                Votre demande de suppression a été prise en compte. 
                Vous recevrez un email de confirmation avec les détails du processus.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trash2 className="h-12 w-12 text-red-600 mr-3" />
              <h1 className="text-4xl font-bold">Suppression de Compte</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Gestion sécurisée et conforme RGPD de la suppression de vos données
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium">
                  Cette action est irréversible selon l'option choisie
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="options" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="data">Données</TabsTrigger>
              <TabsTrigger value="reasons">Raisons</TabsTrigger>
              <TabsTrigger value="confirm">Confirmation</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Options de Suppression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deletionOptions.map((option) => (
                    <div key={option.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id={option.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="text-lg font-medium cursor-pointer">
                            {option.title}
                          </Label>
                          <p className="text-gray-600 mt-1">{option.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {option.immediate ? 'Immédiat' : '30 jours'}
                            </div>
                            <div className="flex items-center text-sm">
                              <Lock className="h-4 w-4 mr-1" />
                              {option.recoverable ? 'Récupérable' : 'Définitif'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-6 w-6 mr-2" />
                    Export de Données (RGPD)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Avant de supprimer votre compte, vous pouvez télécharger toutes vos données 
                    conformément au RGPD.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Données incluses :</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Profil utilisateur et préférences</li>
                      <li>• Historique des sessions</li>
                      <li>• Journaux émotionnels</li>
                      <li>• Données de scan émotionnel</li>
                      <li>• Préférences musicales</li>
                      <li>• Données de gamification</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleDataExport}
                    disabled={dataExportRequested}
                    className="w-full"
                  >
                    {dataExportRequested ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Export Demandé
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Demander l'Export de Données
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reasons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    Raison de la Suppression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Aidez-nous à améliorer notre service en nous indiquant pourquoi vous souhaitez 
                    supprimer votre compte.
                  </p>
                  
                  <div className="space-y-2">
                    {deletionReasons.map((reason, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`reason-${index}`}
                          checked={selectedReason === reason}
                          onCheckedChange={() => setSelectedReason(reason)}
                        />
                        <Label htmlFor={`reason-${index}`} className="cursor-pointer">
                          {reason}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {selectedReason === 'Autre raison' && (
                    <div className="mt-4">
                      <Label htmlFor="custom-reason">Précisez :</Label>
                      <Input 
                        id="custom-reason"
                        placeholder="Décrivez votre raison..."
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="confirm" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Confirmation Finale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">⚠️ Attention</h4>
                    <p className="text-red-700 text-sm">
                      Cette action supprimera définitivement votre compte et toutes les données associées. 
                      Cette action ne peut pas être annulée.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="confirm-text">
                        Tapez "SUPPRIMER" pour confirmer :
                      </Label>
                      <Input 
                        id="confirm-text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="SUPPRIMER"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gdpr-consent"
                        checked={gdprCompliant}
                        onCheckedChange={setGdprCompliant}
                      />
                      <Label htmlFor="gdpr-consent" className="text-sm cursor-pointer">
                        Je comprends mes droits RGPD et confirme ma demande de suppression
                      </Label>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        disabled={confirmText !== 'SUPPRIMER' || !selectedReason || !gdprCompliant}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer Définitivement mon Compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement 
                          votre compte et supprimera vos données de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button variant="outline">Annuler</Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleAccountDeletion}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Suppression...' : 'Oui, supprimer'}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDeletePage;
