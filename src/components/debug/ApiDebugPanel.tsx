
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import BackendStatus from '@/components/status/BackendStatus';

const ApiDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (name: string, fn: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await fn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: 'Backend Health',
      fn: () => ApiService.testConnection(),
    },
    {
      name: 'Journal Feed',
      fn: () => user?.id ? ApiService.getJournalFeed(user.id) : Promise.reject('No user'),
    },
    {
      name: 'Breath Metrics',
      fn: () => user?.id ? ApiService.getBreathWeekly(user.id) : Promise.reject('No user'),
    },
    {
      name: 'Privacy Prefs',
      fn: () => user?.id ? ApiService.getPrivacyPrefs(user.id) : Promise.reject('No user'),
    },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          API Debug Panel
          <BackendStatus />
        </CardTitle>
        <CardDescription>
          Test des endpoints backend après la correction du ticket
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {tests.map((test) => (
            <Button
              key={test.name}
              variant="outline"
              size="sm"
              onClick={() => testEndpoint(test.name, test.fn)}
              disabled={loading === test.name}
            >
              {loading === test.name ? 'Testing...' : test.name}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="flex items-center justify-between p-2 border rounded">
              <span className="font-medium">{name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? 'Success' : 'Failed'}
                </Badge>
                {result.error && (
                  <span className="text-xs text-muted-foreground max-w-xs truncate">
                    {result.error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDebugPanel;
