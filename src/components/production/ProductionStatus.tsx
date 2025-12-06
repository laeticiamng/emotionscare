// @ts-nocheck
/**
 * Composant d'état de production EmotionsCare
 * Affiche le statut des services et APIs
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CONFIG from '@/lib/config';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'loading';
  endpoint: string;
  responseTime?: number;
  message?: string;
}

export default function ProductionStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkServices = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    const serviceChecks = [
      {
        name: 'Supabase Database',
        endpoint: 'supabase-db',
        check: async () => {
          const { data, error } = await supabase.from('profiles').select('count').limit(1);
          return { success: !error, error: error?.message };
        }
      },
      {
        name: 'Emotion Analysis',
        endpoint: CONFIG.EDGE_FUNCTIONS.EMOTION_ANALYSIS,
        check: async () => {
          const { data, error } = await supabase.functions.invoke(CONFIG.EDGE_FUNCTIONS.EMOTION_ANALYSIS, {
            body: { text: 'test', emotion_context: 'health_check' }
          });
          return { success: !error, error: error?.message };
        }
      },
      {
        name: 'Music Generation',
        endpoint: CONFIG.EDGE_FUNCTIONS.MUSIC_GENERATION,
        check: async () => {
          const { data, error } = await supabase.functions.invoke(CONFIG.EDGE_FUNCTIONS.MUSIC_GENERATION, {
            body: { emotion: 'calm', mood: 'peaceful', intensity: 0.5 }
          });
          return { success: !error, error: error?.message };
        }
      },
      {
        name: 'AI Coach',
        endpoint: CONFIG.EDGE_FUNCTIONS.COACH_AI,
        check: async () => {
          const { data, error } = await supabase.functions.invoke(CONFIG.EDGE_FUNCTIONS.COACH_AI, {
            body: { action: 'health_check', prompt: 'test' }
          });
          return { success: !error, error: error?.message };
        }
      },
      {
        name: 'Music Therapy',
        endpoint: CONFIG.EDGE_FUNCTIONS.MUSIC_THERAPY,
        check: async () => {
          const { data, error } = await supabase.functions.invoke(CONFIG.EDGE_FUNCTIONS.MUSIC_THERAPY, {
            body: { mood: 'calm', duration: 60 }
          });
          return { success: !error, error: error?.message };
        }
      }
    ];

    const results = await Promise.allSettled(
      serviceChecks.map(async (service) => {
        const checkStart = Date.now();
        try {
          const result = await service.check();
          const responseTime = Date.now() - checkStart;
          
          return {
            name: service.name,
            endpoint: service.endpoint,
            status: result.success ? 'healthy' as const : 'error' as const,
            responseTime,
            message: result.error || 'Service healthy'
          };
        } catch (error) {
          return {
            name: service.name,
            endpoint: service.endpoint,
            status: 'error' as const,
            responseTime: Date.now() - checkStart,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const serviceStatuses = results.map((result, index) => 
      result.status === 'fulfilled' ? result.value : {
        name: serviceChecks[index].name,
        endpoint: serviceChecks[index].endpoint,
        status: 'error' as const,
        message: 'Check failed'
      }
    );

    setServices(serviceStatuses);
    setLastCheck(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      loading: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const overallHealth = services.every(s => s.status === 'healthy') ? 'healthy' :
                       services.some(s => s.status === 'error') ? 'error' : 'warning';

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(overallHealth)}
          Production Status
        </CardTitle>
        <div className="flex items-center gap-2">
          {lastCheck && (
            <span className="text-sm text-muted-foreground">
              Last check: {lastCheck.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={checkServices}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.endpoint}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {service.responseTime && (
                  <span className="text-sm text-muted-foreground">
                    {service.responseTime}ms
                  </span>
                )}
                {getStatusBadge(service.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Services Status: {services.filter(s => s.status === 'healthy').length}/{services.length} healthy
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Health:</span>
              {getStatusBadge(overallHealth)}
            </div>
          </div>
        </div>

        {CONFIG.FEATURES.ANALYTICS && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Production Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {Object.entries(CONFIG.FEATURES).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {feature.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}