
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  FileText, 
  Bell, 
  Clock, 
  Download, 
  Search, 
  Filter 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PrivacyAccessLogs } from '@/components/privacy';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const GdprCompliancePage: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const [gdprRequests, setGdprRequests] = useState([
    {
      id: '1',
      userId: 'user123',
      userName: 'Marie Dubois',
      requestType: 'access',
      status: 'pending',
      submittedAt: '2025-05-15T10:30:00Z',
      dueDate: '2025-05-30T10:30:00Z'
    },
    {
      id: '2',
      userId: 'user456',
      userName: 'Pierre Martin',
      requestType: 'deletion',
      status: 'completed',
      submittedAt: '2025-05-01T14:45:00Z',
      dueDate: '2025-05-15T14:45:00Z',
      completedAt: '2025-05-10T09:15:00Z'
    },
    {
      id: '3',
      userId: 'user789',
      userName: 'Sophie Bertrand',
      requestType: 'rectification',
      status: 'in_progress',
      submittedAt: '2025-05-10T16:20:00Z',
      dueDate: '2025-05-25T16:20:00Z'
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const handleRequestAction = (requestId: string, action: string) => {
    toast({
      title: "Action en cours",
      description: `Action "${action}" sur la demande #${requestId}`,
      variant: "default",
    });

    // Update request status based on action
    if (action === 'approve' || action === 'process') {
      setGdprRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'in_progress' } 
            : req
        )
      );
    } else if (action === 'complete') {
      setGdprRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'completed', completedAt: new Date().toISOString() } 
            : req
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'access':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Accès</Badge>;
      case 'deletion':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Suppression</Badge>;
      case 'rectification':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Rectification</Badge>;
      case 'portability':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">Portabilité</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">En attente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Complété</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const filteredRequests = gdprRequests
    .filter(req => 
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(req => filterStatus === 'all' || req.status === filterStatus);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto py-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              RGPD & Conformité
            </h1>
            <p className="text-muted-foreground">
              Gérez les demandes liées au RGPD et assurez la conformité de la plateforme
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Demandes utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Journaux d'accès</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Rapports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conformité RGPD</CardTitle>
                <CardDescription>État actuel de la conformité de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Consentement explicite</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                      Conforme
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Droit d'accès</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                      Conforme
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Droit à l'effacement</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                      Conforme
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Portabilité des données</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                      Conforme
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minimisation des données</span>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400">
                      En cours
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demandes RGPD à traiter</CardTitle>
                <CardDescription>Demandes en attente de traitement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests
                    .filter(req => req.status === 'pending')
                    .slice(0, 3)
                    .map(request => (
                      <div key={request.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            {getRequestTypeBadge(request.requestType)}
                            <span className="ml-2">{formatDate(request.submittedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleRequestAction(request.id, 'process')}
                        >
                          Traiter
                        </Button>
                      </div>
                    ))}
                  
                  {filteredRequests.filter(req => req.status === 'pending').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune demande en attente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="requests">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Demandes RGPD des utilisateurs</span>
                  <Badge className="ml-2">
                    {gdprRequests.length} demande{gdprRequests.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Gérez les demandes d'accès, de suppression et de rectification des utilisateurs
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un utilisateur ou un type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Complétés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="flex flex-col items-center">
                      <Clock className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Chargement des demandes...</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Soumis le</TableHead>
                          <TableHead>Échéance</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Aucune demande ne correspond à votre recherche
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.userName}</TableCell>
                              <TableCell>{getRequestTypeBadge(request.requestType)}</TableCell>
                              <TableCell>{formatDate(request.submittedAt)}</TableCell>
                              <TableCell>{formatDate(request.dueDate)}</TableCell>
                              <TableCell>{getStatusBadge(request.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {request.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => handleRequestAction(request.id, 'approve')}
                                    >
                                      Traiter
                                    </Button>
                                  )}
                                  {request.status === 'in_progress' && (
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => handleRequestAction(request.id, 'complete')}
                                    >
                                      Terminer
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                  >
                                    Détails
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="logs">
          <motion.div variants={itemVariants}>
            <PrivacyAccessLogs />
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Rapports de conformité</CardTitle>
                <CardDescription>
                  Générez et consultez les rapports de conformité RGPD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-1">Rapport d'activité mensuel</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Résumé des demandes RGPD et de leur traitement
                    </p>
                    <Button size="sm" className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger (PDF)
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-1">Audit de conformité</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Vérification complète de la conformité RGPD
                    </p>
                    <Button size="sm" className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger (PDF)
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-1">Journaux d'accès aux données</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enregistrement détaillé des accès aux données personnelles
                    </p>
                    <Button size="sm" className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger (CSV)
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-1">Statut des consentements</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      État des consentements utilisateurs par catégorie
                    </p>
                    <Button size="sm" className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger (CSV)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GdprCompliancePage;
