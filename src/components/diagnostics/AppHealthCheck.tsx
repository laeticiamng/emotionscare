import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface HealthCheck {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: string;
}

const AppHealthCheck: React.FC = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    const healthChecks: HealthCheck[] = [];

    // Check React rendering
    try {
      healthChecks.push({
        name: 'React Rendering',
        status: 'ok',
        message: 'React components mounting correctly'
      });
    } catch (error) {
      healthChecks.push({
        name: 'React Rendering',
        status: 'error',
        message: 'React rendering error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Supabase connection
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        healthChecks.push({
          name: 'Supabase Connection',
          status: 'warning',
          message: 'Supabase connection issues',
          details: error.message
        });
      } else {
        healthChecks.push({
          name: 'Supabase Connection',
          status: 'ok',
          message: 'Supabase connected successfully'
        });
      }
    } catch (error) {
      healthChecks.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Failed to connect to Supabase',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Router
    try {
      const currentPath = window.location.pathname;
      healthChecks.push({
        name: 'Router',
        status: 'ok',
        message: `Router working - Current path: ${currentPath}`
      });
    } catch (error) {
      healthChecks.push({
        name: 'Router',
        status: 'error',
        message: 'Router error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check console errors
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const errorMessage = args.map(a => String(a)).join(' ');
      consoleErrors.push(errorMessage);
      logger.error(errorMessage, undefined, 'SYSTEM');
    };

    setTimeout(() => {
      if (consoleErrors.length > 0) {
        healthChecks.push({
          name: 'Console Errors',
          status: 'warning',
          message: `${consoleErrors.length} console errors detected`,
          details: consoleErrors.slice(0, 3).join('\n')
        });
      } else {
        healthChecks.push({
          name: 'Console Errors',
          status: 'ok',
          message: 'No console errors detected'
        });
      }
      
      setChecks(healthChecks);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic de l'application...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vérification en cours...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnostic de l'application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border rounded">
            {getStatusIcon(check.status)}
            <div className="flex-1">
              <h4 className="font-medium">{check.name}</h4>
              <p className="text-sm text-muted-foreground">{check.message}</p>
              {check.details && (
                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                  {check.details}
                </pre>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AppHealthCheck;
