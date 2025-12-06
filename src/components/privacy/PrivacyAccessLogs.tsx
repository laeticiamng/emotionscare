// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Filter, Calendar as CalendarIcon, 
  Eye, Edit, Trash2, Download, Shield, AlertTriangle,
  CheckCircle, Clock, User, Database, Settings
} from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PrivacyAccessLogs: React.FC = () => {
  const { auditLogs } = useEthics();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState<Date>();
  const [showFilters, setShowFilters] = useState(false);

  const actionIcons = {
    login: User,
    logout: User,
    data_access: Eye,
    data_export: Download,
    data_delete: Trash2,
    preference_change: Settings,
    consent_given: Shield,
    consent_revoked: AlertTriangle
  };

  const actionColors = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    data_access: 'bg-blue-100 text-blue-800',
    data_export: 'bg-purple-100 text-purple-800',
    data_delete: 'bg-red-100 text-red-800',
    preference_change: 'bg-orange-100 text-orange-800',
    consent_given: 'bg-emerald-100 text-emerald-800',
    consent_revoked: 'bg-yellow-100 text-yellow-800'
  };

  const getActionLabel = (action: string) => {
    const labels = {
      login: 'Connexion',
      logout: 'Déconnexion',
      data_access: 'Accès aux données',
      data_export: 'Export de données',
      data_delete: 'Suppression de données',
      preference_change: 'Modification des préférences',
      consent_given: 'Consentement accordé',
      consent_revoked: 'Consentement retiré'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getActionLabel(log.action).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    
    const matchesDate = !filterDate || 
                       new Date(log.timestamp).toDateString() === filterDate.toDateString();
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const exportLogs = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalLogs: filteredLogs.length,
      logs: filteredLogs
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-logs-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Journaux d'Accès aux Données
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres étendus */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg bg-muted/50"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'action</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    <SelectItem value="login">Connexions</SelectItem>
                    <SelectItem value="data_access">Accès aux données</SelectItem>
                    <SelectItem value="data_export">Exports</SelectItem>
                    <SelectItem value="preference_change">Modifications</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? (
                        format(filterDate, "dd MMMM yyyy", { locale: fr })
                      ) : (
                        "Sélectionner une date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={setFilterDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{auditLogs.length}</div>
                <div className="text-sm text-blue-600">Total des événements</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {auditLogs.filter(log => log.success).length}
                </div>
                <div className="text-sm text-green-600">Succès</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {auditLogs.filter(log => log.action === 'data_export').length}
                </div>
                <div className="text-sm text-purple-600">Exports</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">
                  {new Set(auditLogs.map(log => new Date(log.timestamp).toDateString())).size}
                </div>
                <div className="text-sm text-orange-600">Jours d'activité</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Liste des logs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Événements récents ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun événement trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.slice(0, 20).map((log, index) => {
                const ActionIcon = actionIcons[log.action as keyof typeof actionIcons] || Database;
                const actionColor = actionColors[log.action as keyof typeof actionColors] || 'bg-gray-100 text-gray-800';
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted">
                        <ActionIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{getActionLabel(log.action)}</span>
                          <Badge className={actionColor}>
                            {log.resource}
                          </Badge>
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.details && <span>{log.details} • </span>}
                          {format(new Date(log.timestamp), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredLogs.length > 20 && (
                <div className="text-center py-4">
                  <Button variant="outline" onClick={exportLogs}>
                    Voir tous les logs ({filteredLogs.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyAccessLogs;
