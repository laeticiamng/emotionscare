/**
 * 🛠️ OUTILS DE DÉVELOPPEMENT
 * Console de debug et monitoring pour l'environnement de développement
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, 
  Activity, 
  Database, 
  Zap, 
  Code, 
  Eye,
  X,
  RefreshCw,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { serviceManager } from '@/services/UnifiedServiceManager';

interface DevToolsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  source: string;
}

const DevTools: React.FC<DevToolsProps> = ({ position = 'top-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [serviceStats, setServiceStats] = useState<any>({});
  const [customScript, setCustomScript] = useState('');

  // Position CSS
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  // Intercept console logs
  useEffect(() => {
    const originalConsole = { ...console };
    
    const interceptLog = (level: 'info' | 'warn' | 'error' | 'debug') => {
      const original = originalConsole[level];
      console[level] = (...args: any[]) => {
        // Appel original
        original.apply(console, args);
        
        // Log dans DevTools
        const logEntry: LogEntry = {
          timestamp: new Date(),
          level,
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '),
          data: args.length === 1 ? args[0] : args,
          source: 'console'
        };
        
        setLogs(prev => [...prev.slice(-99), logEntry]); // Garde les 100 derniers
      };
    };

    // Intercept tous les niveaux
    interceptLog('info');
    interceptLog('warn');
    interceptLog('error');
    interceptLog('debug');

    // Intercept les erreurs globales
    const handleError = (event: ErrorEvent) => {
      const logEntry: LogEntry = {
        timestamp: new Date(),
        level: 'error',
        message: `${event.error?.name || 'Error'}: ${event.message}`,
        data: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        },
        source: 'global'
      };
      setLogs(prev => [...prev.slice(-99), logEntry]);
    };

    window.addEventListener('error', handleError);

    return () => {
      // Restaurer les originaux
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.debug = originalConsole.debug;
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Mise à jour des stats de service
  useEffect(() => {
    const updateStats = () => {
      try {
        const stats = serviceManager.getServiceStats();
        setServiceStats(stats);
      } catch (error) {
        console.debug('Erreur récupération stats:', error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Exporter les logs
  const exportLogs = () => {
    const logsData = {
      exported_at: new Date().toISOString(),
      logs,
      serviceStats,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-debug-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exécuter du code custom
  const executeCustomScript = () => {
    try {
      const result = eval(customScript);
      console.info('Script executé:', result);
    } catch (error) {
      console.error('Erreur script:', error);
    }
  };

  // Vider le cache
  const clearCache = () => {
    serviceManager.clearCache();
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    console.info('Cache vidé');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-50 h-10 w-10 rounded-full p-0`}
        variant="secondary"
        title="Ouvrir DevTools"
      >
        <Bug className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed ${positionClasses[position]} z-50 w-96 max-h-[80vh] overflow-hidden`}
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Bug className="h-4 w-4 mr-2" />
              DevTools EmotionsCare
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="console" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Console
              </TabsTrigger>
              <TabsTrigger value="services" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Services
              </TabsTrigger>
              <TabsTrigger value="storage" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Outils
              </TabsTrigger>
            </TabsList>

            <div className="max-h-80 overflow-y-auto p-4">
              <TabsContent value="console" className="mt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{logs.length} entrées</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogs([])}
                  >
                    Vider
                  </Button>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  {logs.slice(-20).map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border-l-2 ${
                        log.level === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' :
                        log.level === 'warn' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                        log.level === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' :
                        'border-gray-500 bg-gray-50 dark:bg-gray-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.level}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs break-words">
                        {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-0 space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">État des services</span>
                    <Badge variant={serviceStats.isInitialized ? 'default' : 'destructive'}>
                      {serviceStats.isInitialized ? 'Initialisé' : 'Non initialisé'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div>Cache: {serviceStats.cacheSize || 0} entrées</div>
                      <div>Émotion: {serviceStats.services?.emotion ? '✓' : '✗'}</div>
                    </div>
                    <div className="space-y-1">
                      <div>Musique: {serviceStats.services?.music ? '✓' : '✗'}</div>
                      <div>Performance: Normale</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCache}
                    className="w-full"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Vider le cache
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="storage" className="mt-0 space-y-2">
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="font-medium">LocalStorage</div>
                    <div className="text-muted-foreground">
                      {Object.keys(localStorage).length} clés
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">SessionStorage</div>
                    <div className="text-muted-foreground">
                      {Object.keys(sessionStorage).length} clés
                    </div>
                  </div>

                  <div>
                    <div className="font-medium">Cookies</div>
                    <div className="text-muted-foreground">
                      {document.cookie.split(';').filter(Boolean).length} cookies
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0 space-y-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium">Script personnalisé</label>
                    <Textarea
                      value={customScript}
                      onChange={(e) => setCustomScript(e.target.value)}
                      placeholder="console.log('Hello DevTools');"
                      className="mt-1 text-xs font-mono"
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={executeCustomScript}
                      disabled={!customScript.trim()}
                      className="mt-1 w-full"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Exécuter
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportLogs}
                    className="w-full"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Exporter les logs
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DevTools;