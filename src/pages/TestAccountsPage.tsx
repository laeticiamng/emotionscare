import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

interface TestAccount {
  role: string;
  email: string;
  password: string;
  description: string;
}

// SECURITY: Block this page entirely in production builds
const IS_DEV = import.meta.env.DEV;

function getTestAccounts(): TestAccount[] {
  // Only read from env vars — no hardcoded fallbacks
  const consumerEmail = import.meta.env.VITE_TEST_CONSUMER_EMAIL;
  const consumerPassword = import.meta.env.VITE_TEST_CONSUMER_PASSWORD;
  const employeeEmail = import.meta.env.VITE_TEST_EMPLOYEE_EMAIL;
  const employeePassword = import.meta.env.VITE_TEST_EMPLOYEE_PASSWORD;
  const managerEmail = import.meta.env.VITE_TEST_MANAGER_EMAIL;
  const managerPassword = import.meta.env.VITE_TEST_MANAGER_PASSWORD;

  const accounts: TestAccount[] = [];

  if (consumerEmail && consumerPassword) {
    accounts.push({
      role: 'Consumer',
      email: consumerEmail,
      password: consumerPassword,
      description: 'Accès aux fonctionnalités B2C',
    });
  }

  if (employeeEmail && employeePassword) {
    accounts.push({
      role: 'Employee',
      email: employeeEmail,
      password: employeePassword,
      description: 'Accès collaborateur B2B',
    });
  }

  if (managerEmail && managerPassword) {
    accounts.push({
      role: 'Manager',
      email: managerEmail,
      password: managerPassword,
      description: 'Accès gestionnaire RH B2B',
    });
  }

  return accounts;
}

export default function TestAccountsPage() {
  const { toast } = useToast();

  // Hard redirect in production — this page must NEVER render
  if (!IS_DEV) {
    return <Navigate to="/" replace />;
  }

  const testAccounts = getTestAccounts();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copié',
        description: 'Identifiant copié dans le presse-papier',
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier dans le presse-papier',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Comptes de test</h1>
          <p className="text-muted-foreground">
            Utilisez ces comptes pour tester les différents rôles
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Environnement de développement uniquement</AlertTitle>
          <AlertDescription>
            Cette page est uniquement accessible en mode développement.
            Elle est automatiquement bloquée en production.
          </AlertDescription>
        </Alert>

        {testAccounts.length === 0 ? (
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Aucun compte de test configuré</AlertTitle>
            <AlertDescription>
              Configurez les variables d'environnement VITE_TEST_*_EMAIL et VITE_TEST_*_PASSWORD
              pour afficher les comptes de test.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testAccounts.map((account) => (
              <Card key={account.role}>
                <CardHeader>
                  <CardTitle>{account.role}</CardTitle>
                  <CardDescription>{account.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Email</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary p-2 rounded flex-1">
                        {account.email}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(account.email)}
                        aria-label="Copier l'email"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Mot de passe</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary p-2 rounded flex-1">
                        {account.password}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(account.password)}
                        aria-label="Copier le mot de passe"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
