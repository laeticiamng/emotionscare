
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Download, Trash2, Bell, Settings, History } from 'lucide-react';
import { motion } from 'framer-motion';
import DataPrivacySettings from '@/components/preferences/DataPrivacySettings';
import PrivacyAccessLogs from '@/components/privacy/PrivacyAccessLogs';
import DataExportSection from '@/components/privacy/DataExportSection';
import GdprRightsSection from '@/components/privacy/GdprRightsSection';
import SecurityAlerts from '@/components/privacy/SecurityAlerts';
import GdprActionsSection from '@/components/privacy/GdprActionsSection';
import AuditLogViewer from '@/components/privacy/AuditLogViewer';

const PrivacyDashboard: React.FC = () => {
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
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Confidentialité et Protection des Données
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos paramètres de confidentialité et exercez vos droits en matière de protection des données
        </p>
      </motion.div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Paramètres</span>
          </TabsTrigger>
          <TabsTrigger value="rights" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Mes droits</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Actions RGPD</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden md:inline">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Alertes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <motion.div variants={itemVariants}>
            <DataPrivacySettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="rights">
          <motion.div variants={itemVariants}>
            <GdprRightsSection />
          </motion.div>
        </TabsContent>

        <TabsContent value="actions">
          <motion.div variants={itemVariants}>
            <GdprActionsSection />
          </motion.div>
        </TabsContent>

        <TabsContent value="audit">
          <motion.div variants={itemVariants}>
            <AuditLogViewer />
          </motion.div>
        </TabsContent>

        <TabsContent value="logs">
          <motion.div variants={itemVariants}>
            <PrivacyAccessLogs />
          </motion.div>
        </TabsContent>

        <TabsContent value="alerts">
          <motion.div variants={itemVariants}>
            <SecurityAlerts />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PrivacyDashboard;
