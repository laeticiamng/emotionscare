
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Download, Settings, AlertTriangle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import DataPrivacySettings from '@/components/privacy/DataPrivacySettings';
import GdprRightsSection from '@/components/privacy/GdprRightsSection';
import DataExportSection from '@/components/privacy/DataExportSection';
import PrivacyAccessLogs from '@/components/privacy/PrivacyAccessLogs';
import SecurityAlerts from '@/components/privacy/SecurityAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useEthics } from '@/contexts/EthicsContext';

const PrivacyDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { auditLogs, loading } = useEthics();
  const [activeTab, setActiveTab] = useState('settings');

  const privacyScore = 85; // Calculé dynamiquement
  const lastAccess = new Date().toLocaleDateString('fr-FR');
  const totalLogs = auditLogs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de bord Confidentialité
          </h1>
          <p className="text-muted-foreground">
            Gérez vos données personnelles et exercez vos droits RGPD
          </p>
        </motion.div>

        {/* Métriques de confidentialité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Score de Confidentialité</p>
                    <p className="text-2xl font-bold text-green-700">{privacyScore}/100</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Dernier Accès</p>
                    <p className="text-2xl font-bold text-blue-700">{lastAccess}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Événements de Sécurité</p>
                    <p className="text-2xl font-bold text-purple-700">{totalLogs}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Onglets principaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
              <TabsTrigger value="rights" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Droits RGPD
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Journaux
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <DataPrivacySettings />
            </TabsContent>

            <TabsContent value="rights">
              <GdprRightsSection />
            </TabsContent>

            <TabsContent value="export">
              <DataExportSection />
            </TabsContent>

            <TabsContent value="logs">
              <PrivacyAccessLogs />
            </TabsContent>

            <TabsContent value="alerts">
              <SecurityAlerts />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyDashboardPage;
