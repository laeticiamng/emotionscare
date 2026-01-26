/**
 * TEST ACCOUNTS PAGE - DEVELOPMENT ONLY
 * Page pour créer et gérer les comptes de test
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Shield, 
  Building2, 
  Heart, 
  Copy, 
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface TestAccount {
  email: string;
  password: string;
  type: 'b2c' | 'b2b' | 'admin';
  role: string;
  description: string;
  created?: boolean;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'test.user@emotionscare.dev',
    password: 'Test123!EmotionsCare',
    type: 'b2c',
    role: 'user',
    description: 'Utilisateur B2C standard - Accès à tous les modules particuliers'
  },
  {
    email: 'test.premium@emotionscare.dev',
    password: 'Premium123!EmotionsCare',
    type: 'b2c',
    role: 'premium_user',
    description: 'Utilisateur B2C Premium - Accès VR, coach IA, modules avancés'
  },
  {
    email: 'test.collab@emotionscare.dev',
    password: 'Collab123!EmotionsCare',
    type: 'b2b',
    role: 'collaborator',
    description: 'Collaborateur B2B - Accès modules entreprise, dashboard collab'
  },
  {
    email: 'test.rh@emotionscare.dev',
    password: 'RH123!EmotionsCare',
    type: 'b2b',
    role: 'hr_manager',
    description: 'Manager RH - Accès dashboard RH, analytics équipe, rapports'
  },
  {
    email: 'test.admin@emotionscare.dev',
    password: 'Admin123!EmotionsCare',
    type: 'admin',
    role: 'admin',
    description: 'Administrateur - Accès complet à tous les modules et dashboards'
  }
];

const TestAccountsPage: React.FC = () => {
  useAuth();
  const [createdAccounts, setCreatedAccounts] = useState<Set<string>>(new Set());
  const [creatingAccount, setCreatingAccount] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);

  if (import.meta.env.PROD) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Production Mode
            </CardTitle>
            <CardDescription>
              Cette page est uniquement disponible en mode développement.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const createTestAccount = async (account: TestAccount) => {
    setCreatingAccount(account.email);
    
    try {
      // Créer le compte via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            account_type: account.type,
            role: account.role,
            is_test_account: true
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      logger.info('Test account created', { email: account.email }, 'AUTH');
      
      setCreatedAccounts(prev => new Set([...prev, account.email]));
      
      toast({
        title: "Compte créé avec succès",
        description: `${account.email} a été créé et est prêt à l'emploi.`,
      });

      return data;
    } catch (error) {
      logger.error('Failed to create test account', error as Error, 'AUTH');

      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      // Si le compte existe déjà, on le marque comme créé
      if (errorMessage.includes('already registered')) {
        setCreatedAccounts(prev => new Set([...prev, account.email]));
        toast({
          title: "Compte déjà existant",
          description: `${account.email} existe déjà dans le système.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: errorMessage || "Impossible de créer le compte",
          variant: "destructive",
        });
      }
    } finally {
      setCreatingAccount(null);
    }
  };

  const createAllAccounts = async () => {
    for (const account of TEST_ACCOUNTS) {
      if (!createdAccounts.has(account.email)) {
        await createTestAccount(account);
        // Pause entre chaque création
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(field);
    setTimeout(() => setCopiedPassword(null), 2000);
    
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papier.",
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'b2c': return <Heart className="w-4 h-4" />;
      case 'b2b': return <Building2 className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'b2c': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'b2b': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Mode Développement
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">Comptes de Test EmotionsCare</h1>
          <p className="text-muted-foreground">
            Créez et gérez les comptes de test pour l'audit de la plateforme
          </p>
        </div>

        {/* Actions rapides */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Créez tous les comptes en un clic ou individuellement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button 
              onClick={createAllAccounts}
              disabled={creatingAccount !== null}
              className="flex-1"
            >
              {creatingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Créer tous les comptes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Liste des comptes */}
        <div className="grid gap-4">
          {TEST_ACCOUNTS.map((account) => {
            const isCreated = createdAccounts.has(account.email);
            const isCreating = creatingAccount === account.email;

            return (
              <Card 
                key={account.email} 
                className={`border-2 transition-all ${
                  isCreated 
                    ? 'border-success/20 bg-success/5' 
                    : 'border-muted hover:border-primary/20'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg border ${getAccountColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{account.email}</CardTitle>
                          {isCreated && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Créé
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {account.description}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {account.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {account.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {!isCreated && (
                      <Button
                        onClick={() => createTestAccount(account)}
                        disabled={isCreating}
                        size="sm"
                      >
                        {isCreating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Créer'
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={account.email} 
                          readOnly 
                          className="text-sm h-9"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(account.email, `email-${account.email}`)}
                        >
                          {copiedPassword === `email-${account.email}` ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium">
                        Mot de passe
                      </label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={account.password} 
                          type="password"
                          readOnly 
                          className="text-sm h-9"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(account.password, `pass-${account.email}`)}
                        >
                          {copiedPassword === `pass-${account.email}` ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Notice de sécurité */}
        <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Important - Sécurité</p>
                <p className="text-xs text-muted-foreground">
                  Ces comptes sont uniquement pour le développement et les tests.
                  Ils ne doivent JAMAIS être utilisés en production et doivent être supprimés
                  avant le déploiement final.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAccountsPage;
