// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Clock, 
  Users, 
  MousePointer,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import { useUXAnalytics } from '@/hooks/useUXAnalytics';

const LiveUXMonitor: React.FC = () => {
  const { session, metrics, getConversionFunnel, getUserPersona } = useUXAnalytics();
  const [isMinimized, setIsMinimized] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);
  
  const funnel = getConversionFunnel();
  const persona = getUserPersona();
  
  // Surveillance des métriques critiques
  useEffect(() => {
    const newAlerts: string[] = [];
    
    // Détection de problèmes UX en temps réel
    if (metrics.scrollDepth < 25 && metrics.timeOnPage > 30000) {
      newAlerts.push('⚠️ Utilisateur bloqué - Scroll faible après 30s');
    }
    
    if (metrics.errorsEncountered.length > 2) {
      newAlerts.push('🚨 Erreurs multiples détectées - Expérience dégradée');
    }
    
    if (metrics.engagementScore < 10 && metrics.timeOnPage > 60000) {
      newAlerts.push('😴 Engagement faible - Utilisateur probablement perdu');
    }
    
    const currentFunnel = getConversionFunnel();
    if (currentFunnel.stepCount > 5) {
      newAlerts.push('🔄 Parcours complexe - Risque d\'abandon élevé');
    }
    
    setAlerts(newAlerts);
  }, [metrics.scrollDepth, metrics.timeOnPage, metrics.errorsEncountered.length, metrics.engagementScore]); // Use specific metrics instead of full objects
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };
  
  const getEngagementColor = (score: number) => {
    if (score > 50) return 'text-green-600';
    if (score > 20) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getPersonaIcon = (style: string) => {
    switch (style) {
      case 'explorer': return '🔍';
      case 'focused': return '🎯';
      default: return '👤';
    }
  };
  
  if (isMinimized) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          size="sm"
          className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90"
        >
          <Activity className="w-5 h-5" />
        </Button>
        
        {alerts.length > 0 && (
          <motion.div
            className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {alerts.length}
          </motion.div>
        )}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="fixed bottom-4 right-4 w-96 max-h-96 z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Card className="shadow-2xl border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <CardTitle className="text-sm">Monitoring UX Live</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-80 overflow-y-auto">
          
          {/* Alertes critiques */}
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800"
              >
                {alert}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Métriques principales */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-muted rounded">
              <Clock className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold">{formatTime(metrics.timeOnPage)}</div>
              <div className="text-muted-foreground">Temps sur page</div>
            </div>
            
            <div className="text-center p-2 bg-muted rounded">
              <Target className={`w-4 h-4 mx-auto mb-1 ${getEngagementColor(metrics.engagementScore)}`} />
              <div className="font-semibold">{metrics.engagementScore}</div>
              <div className="text-muted-foreground">Engagement</div>
            </div>
            
            <div className="text-center p-2 bg-muted rounded">
              <MousePointer className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold">{Object.keys(metrics.clickHeatmap).length}</div>
              <div className="text-muted-foreground">Éléments cliqués</div>
            </div>
            
            <div className="text-center p-2 bg-muted rounded">
              <TrendingUp className="w-4 h-4 mx-auto mb-1" />
              <div className="font-semibold">{metrics.scrollDepth}%</div>
              <div className="text-muted-foreground">Scroll max</div>
            </div>
          </div>
          
          {/* Persona utilisateur */}
          <div className="p-3 bg-blue-50 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getPersonaIcon(persona.navigationStyle)}</span>
              <span className="font-medium text-sm">Profil utilisateur</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Appareil:</span>
                <Badge variant="outline" className="text-xs">{persona.device}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Style:</span>
                <Badge variant="outline" className="text-xs">{persona.navigationStyle}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Engagement:</span>
                <Badge 
                  variant={persona.engagementLevel === 'high' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {persona.engagementLevel}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Parcours de conversion */}
          <div className="p-3 bg-green-50 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">Funnel de conversion</span>
            </div>
            <div className="text-xs space-y-1">
              <div>Étapes parcourues: <strong>{funnel.stepCount}</strong></div>
              <div>Page d'entrée: <code className="text-xs bg-white px-1 rounded">{funnel.landingPage}</code></div>
              {funnel.dropOffStep && (
                <div className="text-red-600">
                  ⚠️ Abandon potentiel: {funnel.dropOffStep}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => window.open('/ux-dashboard', '_blank')}
            >
              📊 Dashboard complet
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => {
                const data = JSON.stringify({ session, metrics, funnel, persona }, null, 2);
                navigator.clipboard.writeText(data);
              }}
            >
              📋 Exporter données
            </Button>
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveUXMonitor;