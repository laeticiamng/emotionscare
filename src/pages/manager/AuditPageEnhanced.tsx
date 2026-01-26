// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  FileText,
  User,
  Shield,
  Database,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
  details: string;
}

interface AuditStats {
  totalEvents: number;
  successfulActions: number;
  failedActions: number;
  uniqueUsers: number;
  criticalEvents: number;
}

const AuditPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isLoading, setIsLoading] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      user: 'admin@emotionscare.com',
      action: 'LOGIN',
      resource: 'Authentication System',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      result: 'success',
      details: 'Successful administrative login'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      user: 'manager@emotionscare.com',
      action: 'USER_CREATE',
      resource: 'User Management',
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Mac OS X)',
      result: 'success',
      details: 'New user account created: john.doe@company.com'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 10800000),
      user: 'unknown',
      action: 'LOGIN_ATTEMPT',
      resource: 'Authentication System',
      ip: '203.0.113.50',
      userAgent: 'curl/7.68.0',
      result: 'failure',
      details: 'Failed login attempt with invalid credentials'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 14400000),
      user: 'system',
      action: 'BACKUP_COMPLETE',
      resource: 'Database System',
      ip: '127.0.0.1',
      userAgent: 'Internal System',
      result: 'success',
      details: 'Daily database backup completed successfully'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 18000000),
      user: 'security@emotionscare.com',
      action: 'POLICY_UPDATE',
      resource: 'Security Policies',
      ip: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Linux; Android)',
      result: 'warning',
      details: 'Password policy updated - complexity requirements increased'
    }
  ]);

  const [stats, setStats] = useState<AuditStats>({
    totalEvents: 1247,
    successfulActions: 1156,
    failedActions: 67,
    uniqueUsers: 89,
    criticalEvents: 24
  });

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || log.result === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleExportLogs = () => {
    // Simulate export functionality
    const csvContent = filteredLogs.map(log => 
      `${log.timestamp.toISOString()},${log.user},${log.action},${log.resource},${log.result},${log.details}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'audit_logs.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getResultBadgeVariant = (result: AuditLog['result']) => {
    switch (result) {
      case 'success': return 'default';
      case 'failure': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <User className="h-4 w-4" />;
    if (action.includes('POLICY') || action.includes('SECURITY')) return <Shield className="h-4 w-4" />;
    if (action.includes('DATABASE') || action.includes('BACKUP')) return <Database className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Audit & Conformité
          </h1>
          <p className="text-muted-foreground mt-2">
            Traçabilité complète des actions système et utilisateurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Réussies</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successfulActions}</div>
            <p className="text-xs text-muted-foreground">92.7% de réussite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échecs</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedActions}</div>
            <p className="text-xs text-muted-foreground">-15% vs semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Uniques</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Dernières 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements Critiques</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.criticalEvents}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 items-center"
      >
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par utilisateur, action ou ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Résultat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="success">Succès</SelectItem>
            <SelectItem value="failure">Échec</SelectItem>
            <SelectItem value="warning">Avertissement</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Période
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      {/* Audit Logs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="logs">Journaux d'Audit</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journaux d'Activité</CardTitle>
              <CardDescription>
                {filteredLogs.length} événement(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-shrink-0">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{log.action}</h4>
                        <Badge variant={getResultBadgeVariant(log.result)}>
                          {log.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.details}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {log.user}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                        </span>
                        <span>IP: {log.ip}</span>
                        <span>Ressource: {log.resource}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conformité RGPD</CardTitle>
                <CardDescription>
                  Respect du Règlement Général sur la Protection des Données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Consentements tracés</span>
                    <Badge>✓ Conforme</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Droit à l'oubli</span>
                    <Badge>✓ Implémenté</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Portabilité des données</span>
                    <Badge>✓ Disponible</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Notifications de violation</span>
                    <Badge variant="secondary">En cours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ISO 27001</CardTitle>
                <CardDescription>
                  Système de Management de la Sécurité de l'Information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Politiques de sécurité</span>
                    <Badge>✓ À jour</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gestion des incidents</span>
                    <Badge>✓ Documentée</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Formation du personnel</span>
                    <Badge>✓ Complétée</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Audit interne</span>
                    <Badge variant="secondary">Planifié</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports Disponibles</CardTitle>
              <CardDescription>
                Générer des rapports d'audit personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Rapport Mensuel', description: 'Synthèse complète du mois', format: 'PDF' },
                  { name: 'Activité Utilisateurs', description: 'Actions par utilisateur', format: 'Excel' },
                  { name: 'Incidents Sécurité', description: 'Événements critiques', format: 'PDF' },
                  { name: 'Conformité RGPD', description: 'État de conformité', format: 'PDF' },
                  { name: 'Analyse Tendances', description: 'Évolution des métriques', format: 'Excel' },
                  { name: 'Journal Complet', description: 'Tous les événements', format: 'CSV' }
                ].map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button size="sm">Générer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditPageEnhanced;