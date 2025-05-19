
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const DataExportSection: React.FC = () => {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const handleExportData = async () => {
    setExportLoading(true);
    // Simulate export process
    setTimeout(() => {
      setExportLoading(false);
      toast({
        title: "Exportation réussie",
        description: "Vos données ont été exportées avec succès. Téléchargement en cours...",
        variant: "success",
      });
    }, 2000);
  };

  const handleDeleteRequest = async () => {
    setDeleteLoading(true);
    // Simulate deletion request
    setTimeout(() => {
      setDeleteLoading(false);
      toast({
        title: "Demande enregistrée",
        description: "Votre demande d'effacement des données a été enregistrée. Vous recevrez un email de confirmation.",
        variant: "success",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Exporter mes données
            </CardTitle>
            <CardDescription>
              Téléchargez une copie complète de toutes vos données personnelles stockées sur notre plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleExportData} 
                  className="w-full flex items-center gap-2" 
                  size="lg"
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Préparation...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Exporter au format ZIP
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  className="w-full flex items-center gap-2" 
                  size="lg"
                >
                  <Download className="h-4 w-4" />
                  Exporter au format JSON
                </Button>
              </motion.div>
            </div>
            
            <Alert className="bg-muted/50">
              <Clock className="h-4 w-4" />
              <AlertTitle>Délai de traitement</AlertTitle>
              <AlertDescription>
                L'exportation de vos données peut prendre jusqu'à 15 minutes selon le volume de données à traiter.
                Un lien de téléchargement vous sera envoyé par email.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Suppression de mes données
            </CardTitle>
            <CardDescription>
              Demandez l'effacement complet de vos données personnelles de notre plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette action entraînera la suppression définitive de toutes vos données personnelles, y compris votre historique,
              vos préférences et vos interactions sur la plateforme. Cette action est irréversible.
            </p>
            
            <Separator />
            
            <div className="flex justify-end">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteRequest}
                  disabled={deleteLoading}
                  className="flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Demander la suppression
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataExportSection;
