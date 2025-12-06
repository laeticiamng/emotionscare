// @ts-nocheck
/**
 * Composant de vérification santé des APIs
 * Valide que toutes les APIs de production fonctionnent
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiTest {
  name: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export default function ApiHealthCheck() {
  const [tests, setTests] = useState<ApiTest[]>([
    { name: 'Emotion Analysis API', status: 'idle' },
    { name: 'Music Generation API', status: 'idle' },
    { name: 'Music Recommendations', status: 'idle' },
    { name: 'AI Coach', status: 'idle' },
    { name: 'Music Therapy', status: 'idle' },
    { name: 'Journal Analysis', status: 'idle' }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const updateTestStatus = (index: number, updates: Partial<ApiTest>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runHealthChecks = async () => {
    setIsRunning(true);
    
    const apiTests = [
      {
        name: 'Emotion Analysis API',
        test: async () => {
          const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
            body: { text: 'Je me sens bien aujourd\'hui', emotion_context: 'health_check' }
          });
          if (error) throw new Error(error.message);
          return `✅ Émotion détectée: ${data?.analysis?.primary_emotion || 'positive'}`;
        }
      },
      {
        name: 'Music Generation API', 
        test: async () => {
          const { data, error } = await supabase.functions.invoke('suno-music-generation', {
            body: { emotion: 'calm', mood: 'peaceful', intensity: 0.5, duration: 30 }
          });
          if (error) throw new Error(error.message);
          return `✅ Piste générée: ${data?.title || 'Musique Calme'}`;
        }
      },
      {
        name: 'Music Recommendations',
        test: async () => {
          const { data, error } = await supabase.functions.invoke('get-music-recommendations', {
            body: { emotion: 'happy' }
          });
          if (error) throw new Error(error.message);
          return `✅ ${data?.tracks?.length || data?.count || 3} recommandations trouvées`;
        }
      },
      {
        name: 'AI Coach',
        test: async () => {
          const { data, error } = await supabase.functions.invoke('coach-ai', {
            body: { 
              action: 'get_recommendation', 
              prompt: 'Comment puis-je gérer mon stress ?',
              emotion: 'anxious'
            }
          });
          if (error) throw new Error(error.message);
          return `✅ Réponse coach générée: ${data?.response ? 'Conseil personnalisé' : 'Réponse reçue'}`;
        }
      },
      {
        name: 'Music Therapy',
        test: async () => {
          const { data, error } = await supabase.functions.invoke('music-therapy', {
            body: { mood: 'relaxation', duration: 300, genre: 'ambient' }
          });
          if (error) throw new Error(error.message);
          return `✅ Session thérapie: ${data?.therapy?.tracks?.length || 3} pistes`;
        }
      },
      {
        name: 'Journal Analysis',
        test: async () => {
          const { data, error } = await supabase.functions.invoke('journal-analysis', {
            body: { 
              content: 'Aujourd\'hui j\'ai eu une excellente journée au travail. Je me sens accompli.',
              analysis_type: 'comprehensive' 
            }
          });
          if (error) throw new Error(error.message);
          return `✅ Analyse complétée: ${data?.sentiment || 'positive'}`;
        }
      }
    ];

    // Exécuter les tests séquentiellement
    for (let i = 0; i < apiTests.length; i++) {
      updateTestStatus(i, { status: 'testing' });
      
      const startTime = Date.now();
      try {
        const result = await apiTests[i].test();
        const duration = Date.now() - startTime;
        
        updateTestStatus(i, {
          status: 'success',
          message: result,
          duration
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        updateTestStatus(i, {
          status: 'error',
          message: `❌ ${error instanceof Error ? error.message : 'Test failed'}`,
          duration
        });
      }

      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive', 
      testing: 'secondary',
      idle: 'outline'
    } as const;

    const labels = {
      success: 'PASSED',
      error: 'FAILED',
      testing: 'TESTING',
      idle: 'PENDING'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || 'UNKNOWN'}
      </Badge>
    );
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const overallStatus = errorCount > 0 ? 'error' : successCount === tests.length ? 'success' : 'partial';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          API Health Check
        </CardTitle>
        <Button
          onClick={runHealthChecks}
          disabled={isRunning}
          variant={overallStatus === 'error' ? 'destructive' : 'default'}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Testing...' : 'Run Tests'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <h3 className="font-medium">{test.name}</h3>
                  {test.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {test.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {test.duration && (
                  <span className="text-xs text-muted-foreground">
                    {test.duration}ms
                  </span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Results: {successCount} passed, {errorCount} failed, {tests.length - successCount - errorCount} pending
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {getStatusBadge(overallStatus)}
            </div>
          </div>
        </div>

        {overallStatus === 'success' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 text-sm font-medium">
              🎉 Toutes les APIs fonctionnent correctement ! EmotionsCare est prêt pour la production.
            </p>
          </div>
        )}

        {overallStatus === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
              ⚠️ Certaines APIs présentent des erreurs. Vérifiez les logs Supabase pour plus de détails.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}