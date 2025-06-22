
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Shield, Search, Route, Database } from 'lucide-react';
import PageAuditTool from '@/components/audit/PageAuditTool';
import ComplianceWidget from '@/components/security/ComplianceWidget';
import RouteDebugger from '@/components/routing/RouteDebugger';

const SystemAuditPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
            Audit Système
          </h1>
          <p className="text-muted-foreground">
            Vérification complète de l'accès et de l'affichage des pages
          </p>
        </motion.div>

        {/* Onglets d'audit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="pages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <Route className="h-4 w-4" />
                Routes
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages">
              <PageAuditTool />
            </TabsContent>

            <TabsContent value="routes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-primary" />
                    Debugger de Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RouteDebugger />
                  <div className="mt-6 text-sm text-muted-foreground">
                    <p>Le debugger de routes s'affiche automatiquement en mode développement.</p>
                    <p>Il montre en temps réel les informations de navigation et d'authentification.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <ComplianceWidget />
            </TabsContent>

            <TabsContent value="system">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>État du Système</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Environnement</h4>
                        <p className="text-sm text-muted-foreground">
                          Mode: {process.env.NODE_ENV || 'development'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Version</h4>
                        <p className="text-sm text-muted-foreground">
                          React: {React.version}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-green-700">Sécurité</h4>
                          <p className="text-sm text-muted-foreground">
                            Toutes les routes sont protégées par authentification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-blue-700">Performance</h4>
                          <p className="text-sm text-muted-foreground">
                            Chargement lazy et optimisations actives
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium text-purple-700">Accessibilité</h4>
                          <p className="text-sm text-muted-foreground">
                            Interface adaptée aux différents rôles utilisateurs
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemAuditPage;
