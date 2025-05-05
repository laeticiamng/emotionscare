
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Trash2, Info, Shield } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const MyDataPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');
  
  // Données fictives - seraient normalement chargées depuis l'API
  const [dataStats, setDataStats] = useState({
    scanCount: 37,
    journalCount: 12,
    vrSessionCount: 5,
    lastScanDate: '2025-04-30',
    lastJournalDate: '2025-05-01',
    lastVRDate: '2025-04-29'
  });
  
  const [scanItems, setScanItems] = useState<Array<{id: string, date: string, score: number}>>([
    { id: 'scan1', date: '2025-05-01', score: 78 },
    { id: 'scan2', date: '2025-04-30', score: 65 },
    { id: 'scan3', date: '2025-04-29', score: 72 },
    // Etc.
  ]);
  
  const [journalItems, setJournalItems] = useState<Array<{id: string, date: string, title: string}>>([
    { id: 'journal1', date: '2025-05-01', title: 'Ma journée productive' },
    { id: 'journal2', date: '2025-04-29', title: 'Réflexions sur le projet X' },
    // Etc.
  ]);
  
  const [vrItems, setVrItems] = useState<Array<{id: string, date: string, theme: string, duration: number}>>([
    { id: 'vr1', date: '2025-04-29', theme: 'Forêt tropicale', duration: 5 },
    { id: 'vr2', date: '2025-04-25', theme: 'Plage au coucher du soleil', duration: 10 },
    // Etc.
  ]);
  
  const deleteItem = (type: 'scan' | 'journal' | 'vr', id: string) => {
    // Simulation - normalement appel API pour suppression en DB
    toast({
      title: "Donnée supprimée",
      description: `La donnée a été supprimée de votre compte`,
      variant: "default"
    });
    
    // Mise à jour de l'état local
    if (type === 'scan') {
      setScanItems(items => items.filter(item => item.id !== id));
      setDataStats(prev => ({ ...prev, scanCount: prev.scanCount - 1 }));
    } else if (type === 'journal') {
      setJournalItems(items => items.filter(item => item.id !== id));
      setDataStats(prev => ({ ...prev, journalCount: prev.journalCount - 1 }));
    } else if (type === 'vr') {
      setVrItems(items => items.filter(item => item.id !== id));
      setDataStats(prev => ({ ...prev, vrSessionCount: prev.vrSessionCount - 1 }));
    }
  };
  
  const requestFullDataExport = () => {
    toast({
      title: "Demande envoyée",
      description: "Votre export de données sera disponible sous 48h et vous sera envoyé par email",
      duration: 5000
    });
  };
  
  const requestFullDeletion = () => {
    toast({
      title: "Demande reçue",
      description: "Votre demande de suppression de compte a été enregistrée et sera traitée sous 30 jours",
      variant: "destructive",
      duration: 8000
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Données Personnelles</h1>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Protection de la vie privée</AlertTitle>
        <AlertDescription>
          Vous avez le contrôle total sur vos données. Conformément au RGPD, vous pouvez à tout moment 
          exporter ou supprimer vos données.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="scans">Scans Émotionnels</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="vr">Sessions VR</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Vue d'ensemble de vos données
              </CardTitle>
              <CardDescription>
                Résumé de toutes les données personnelles stockées dans votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border p-4 text-center shadow-sm">
                  <h3 className="text-xl font-semibold">{dataStats.scanCount}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Scans émotionnels</p>
                  <p className="text-xs text-muted-foreground">
                    Dernier scan: {dataStats.lastScanDate}
                  </p>
                </div>
                
                <div className="rounded-lg border p-4 text-center shadow-sm">
                  <h3 className="text-xl font-semibold">{dataStats.journalCount}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Entrées journal</p>
                  <p className="text-xs text-muted-foreground">
                    Dernière entrée: {dataStats.lastJournalDate}
                  </p>
                </div>
                
                <div className="rounded-lg border p-4 text-center shadow-sm">
                  <h3 className="text-xl font-semibold">{dataStats.vrSessionCount}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Sessions VR</p>
                  <p className="text-xs text-muted-foreground">
                    Dernière session: {dataStats.lastVRDate}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-around">
                <Button 
                  variant="outline" 
                  className="flex gap-2" 
                  onClick={requestFullDataExport}
                >
                  <Download size={16} />
                  Exporter toutes mes données
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="flex gap-2"
                    >
                      <Trash2 size={16} />
                      Demander la suppression de mon compte
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la suppression</DialogTitle>
                      <DialogDescription>
                        Cette action va initier le processus de suppression de votre compte et de toutes 
                        vos données. Ce processus prendra effet dans les 30 jours, conformément au RGPD.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground mt-2">
                      Pendant cette période de 30 jours, vous pouvez annuler cette demande en contactant notre support.
                      Après cette période, vos données seront définitivement supprimées.
                    </p>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={requestFullDeletion}>
                        Confirmer la suppression
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Politique de conservation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                <span className="font-medium">Scans émotionnels :</span> Conservés pendant 12 mois pour permettre l'analyse des tendances.
              </p>
              <p>
                <span className="font-medium">Entrées de journal :</span> Conservées pendant la durée de votre abonnement.
              </p>
              <p>
                <span className="font-medium">Sessions VR :</span> Les métadonnées (date, durée) sont conservées pendant 6 mois.
              </p>
              <p className="text-muted-foreground text-xs mt-4">
                Toutes vos données sont anonymisées pour les analyses globales. Aucune donnée identifiable n'est partagée avec des tiers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scans">
          <Card>
            <CardHeader>
              <CardTitle>Historique des scans émotionnels</CardTitle>
              <CardDescription>Liste de tous vos scans émotionnels enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                {scanItems.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Score</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{item.date}</td>
                          <td className="p-2">{item.score}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteItem('scan', item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    Aucun scan émotionnel enregistré
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Entrées de journal</CardTitle>
              <CardDescription>Liste de toutes vos entrées de journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                {journalItems.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Titre</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{item.date}</td>
                          <td className="p-2">{item.title}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteItem('journal', item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    Aucune entrée de journal enregistrée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vr">
          <Card>
            <CardHeader>
              <CardTitle>Sessions VR</CardTitle>
              <CardDescription>Historique de vos sessions VR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                {vrItems.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Thème</th>
                        <th className="p-2 text-left">Durée (min)</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vrItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{item.date}</td>
                          <td className="p-2">{item.theme}</td>
                          <td className="p-2">{item.duration}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteItem('vr', item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    Aucune session VR enregistrée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyDataPage;
