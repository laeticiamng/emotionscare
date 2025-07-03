import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ModuleTestResult {
  name: string;
  status: 'testing' | 'success' | 'error' | 'pending';
  message: string;
  function_name: string;
}

const OpenAIModulesTest: React.FC = () => {
  const [testResults, setTestResults] = useState<ModuleTestResult[]>([
    { name: 'Intégration Test', status: 'pending', message: '', function_name: 'openai-integration-test' },
    { name: 'Coach IA Chat', status: 'pending', message: '', function_name: 'ai-coach-chat' },
    { name: 'Analyse Émotions', status: 'pending', message: '', function_name: 'analyze-emotion-text' },
    { name: 'Coach IA', status: 'pending', message: '', function_name: 'ai-coach' },
    { name: 'Journal IA', status: 'pending', message: '', function_name: 'analyze-journal' },
    { name: 'Coach Chat', status: 'pending', message: '', function_name: 'chat-coach' },
    { name: 'Chat IA', status: 'pending', message: '', function_name: 'chat-with-ai' },
    { name: 'Assistant IA', status: 'pending', message: '', function_name: 'coach-ai' },
    { name: 'Notifications IA', status: 'pending', message: '', function_name: 'notifications-ai' },
    { name: 'Centre d\'aide IA', status: 'pending', message: '', function_name: 'help-center-ai' },
    { name: 'GDPR Assistant', status: 'pending', message: '', function_name: 'gdpr-assistant' },
    { name: 'GDPR Explainer', status: 'pending', message: '', function_name: 'explain-gdpr' },
  ]);
  
  const [isTestingAll, setIsTestingAll] = useState(false);

  const updateTestResult = (functionName: string, status: ModuleTestResult['status'], message: string) => {
    setTestResults(prev => prev.map(result => 
      result.function_name === functionName 
        ? { ...result, status, message }
        : result
    ));
  };

  const testModule = async (functionName: string, testPayload: any) => {
    updateTestResult(functionName, 'testing', 'Test en cours...');
    
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: testPayload
      });

      if (error) {
        updateTestResult(functionName, 'error', `Erreur: ${error.message}`);
        return false;
      }

      if (data?.error) {
        updateTestResult(functionName, 'error', `Erreur API: ${data.error}`);
        return false;
      }

      updateTestResult(functionName, 'success', 'Test réussi ✅');
      return true;
    } catch (error) {
      updateTestResult(functionName, 'error', `Erreur système: ${(error as Error).message}`);
      return false;
    }
  };

  const testAllModules = async () => {
    setIsTestingAll(true);
    
    // Test d'intégration global
    await testModule('openai-integration-test', {});
    
    // Tests spécifiques pour chaque module
    const testCases = [
      { 
        function_name: 'ai-coach-chat', 
        payload: { messages: [{ role: 'user', content: 'Test de connexion' }] }
      },
      { 
        function_name: 'analyze-emotion-text', 
        payload: { text: 'Je me sens bien aujourd\'hui' }
      },
      { 
        function_name: 'ai-coach', 
        payload: { prompt: 'Test de coaching' }
      },
      { 
        function_name: 'analyze-journal', 
        payload: { entry: 'Journée productive et positive' }
      },
      { 
        function_name: 'chat-coach', 
        payload: { messages: [{ role: 'user', content: 'Conseil pour gérer le stress' }] }
      },
      { 
        function_name: 'chat-with-ai', 
        payload: { messages: [{ role: 'user', content: 'Test de chat' }] }
      },
      { 
        function_name: 'coach-ai', 
        payload: { question: 'Comment améliorer mon bien-être ?' }
      },
      { 
        function_name: 'notifications-ai', 
        payload: { context: 'test', user_activity: 'connexion' }
      },
      { 
        function_name: 'help-center-ai', 
        payload: { question: 'Comment utiliser la plateforme ?' }
      },
      { 
        function_name: 'gdpr-assistant', 
        payload: { question: 'Qu\'est-ce que le RGPD ?' }
      },
      { 
        function_name: 'explain-gdpr', 
        payload: { article: 'Article 15 - Droit d\'accès' }
      }
    ];

    // Exécuter les tests avec un délai entre chaque
    for (const testCase of testCases) {
      await testModule(testCase.function_name, testCase.payload);
      // Petit délai pour éviter la surcharge
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsTestingAll(false);
  };

  const getStatusIcon = (status: ModuleTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ModuleTestResult['status']) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      testing: 'secondary' as const,
      pending: 'outline' as const
    };
    
    const labels = {
      success: 'Succès',
      error: 'Erreur',
      testing: 'Test...',
      pending: 'En attente'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalTests = testResults.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test des Modules OpenAI</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {successCount}/{totalTests} réussis
            </span>
            <Button 
              onClick={testAllModules}
              disabled={isTestingAll}
              className="bg-primary hover:bg-primary/90"
            >
              {isTestingAll ? 'Test en cours...' : 'Tester tous les modules'}
            </Button>
          </div>
        </CardTitle>
        {(successCount > 0 || errorCount > 0) && (
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">✅ {successCount} succès</span>
            {errorCount > 0 && <span className="text-red-600">❌ {errorCount} erreurs</span>}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {testResults.map((result) => (
            <div 
              key={result.function_name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.function_name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {result.message && (
                  <span className="text-sm text-muted-foreground max-w-xs truncate">
                    {result.message}
                  </span>
                )}
                {getStatusBadge(result.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIModulesTest;