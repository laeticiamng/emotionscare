
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Eye, Edit, Trash2, Download, Shield, AlertCircle, 
  CheckCircle, Clock, FileText, Users, Lock 
} from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';
import { toast } from 'sonner';

const GdprRightsSection: React.FC = () => {
  const { dataRequests, requestDataExport, requestDataDeletion, loading } = useEthics();
  const [expandedRight, setExpandedRight] = useState<string>('');

  const gdprRights = [
    {
      id: 'access',
      title: 'Droit d\'accès',
      description: 'Consulter toutes les données personnelles que nous détenons sur vous',
      icon: Eye,
      color: 'blue',
      explanation: 'Vous avez le droit de connaître si nous traitons vos données personnelles et, le cas échéant, d\'y avoir accès ainsi qu\'aux informations concernant la finalité du traitement, les catégories de données concernées, etc.',
      action: () => requestDataExport(),
      actionLabel: 'Demander l\'accès'
    },
    {
      id: 'rectification',
      title: 'Droit de rectification',
      description: 'Modifier ou corriger vos données personnelles inexactes',
      icon: Edit,
      color: 'green',
      explanation: 'Vous avez le droit d\'obtenir la rectification des données inexactes ou incomplètes. Vous pouvez également demander que des données incomplètes soient complétées.',
      action: () => toast.info('Contactez notre support pour modifier vos données'),
      actionLabel: 'Demander une rectification'
    },
    {
      id: 'erasure',
      title: 'Droit à l\'effacement',
      description: 'Supprimer définitivement toutes vos données personnelles',
      icon: Trash2,
      color: 'red',
      explanation: 'Aussi appelé "droit à l\'oubli", vous pouvez demander l\'effacement de vos données personnelles dans certaines circonstances, notamment lorsque les données ne sont plus nécessaires.',
      action: () => requestDataDeletion(),
      actionLabel: 'Demander la suppression'
    },
    {
      id: 'portability',
      title: 'Droit à la portabilité',
      description: 'Récupérer vos données dans un format structuré et lisible',
      icon: Download,
      color: 'purple',
      explanation: 'Vous avez le droit de recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine, et de les transmettre à un autre responsable de traitement.',
      action: () => requestDataExport(),
      actionLabel: 'Exporter les données'
    },
    {
      id: 'restriction',
      title: 'Droit à la limitation',
      description: 'Limiter l\'utilisation de vos données personnelles',
      icon: Lock,
      color: 'orange',
      explanation: 'Vous pouvez demander la limitation du traitement de vos données personnelles dans certaines circonstances, par exemple en cas de contestation de l\'exactitude des données.',
      action: () => toast.info('Contactez notre support pour limiter le traitement'),
      actionLabel: 'Demander une limitation'
    },
    {
      id: 'objection',
      title: 'Droit d\'opposition',
      description: 'S\'opposer au traitement de vos données personnelles',
      icon: Shield,
      color: 'indigo',
      explanation: 'Vous avez le droit de vous opposer au traitement de vos données personnelles pour des motifs légitimes ou pour des finalités de prospection commerciale.',
      action: () => toast.info('Contactez notre support pour vous opposer au traitement'),
      actionLabel: 'S\'opposer au traitement'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Historique des demandes */}
      {dataRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Historique des Demandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataRequests.slice(0, 3).map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium capitalize">{request.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Droits RGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Vos Droits RGPD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible value={expandedRight} onValueChange={setExpandedRight}>
            {gdprRights.map((right, index) => (
              <AccordionItem key={right.id} value={right.id}>
                <AccordionTrigger className="text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-2 rounded-lg bg-${right.color}-100`}>
                      <right.icon className={`h-4 w-4 text-${right.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{right.title}</h3>
                      <p className="text-sm text-muted-foreground">{right.description}</p>
                    </div>
                  </motion.div>
                </AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Explication détaillée :</h4>
                      <p className="text-sm text-muted-foreground">{right.explanation}</p>
                    </div>
                    <Button
                      onClick={right.action}
                      disabled={loading}
                      className="w-full"
                      variant="outline"
                    >
                      <right.icon className="h-4 w-4 mr-2" />
                      {right.actionLabel}
                    </Button>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Informations légales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900">Informations importantes</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Les demandes sont traitées dans un délai maximum de 30 jours</p>
                  <p>• Certaines demandes peuvent nécessiter une vérification d'identité</p>
                  <p>• Vous recevrez une confirmation par email pour chaque demande</p>
                  <p>• En cas de question, contactez notre DPO : privacy@emotionscare.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GdprRightsSection;
