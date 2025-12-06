import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestAccount {
  role: string;
  email: string;
  password: string;
  description: string;
}

// Note: Ces comptes sont pour le développement/test uniquement
// En production, ces données devraient provenir d'une API sécurisée
const TEST_ACCOUNTS: TestAccount[] = [
  {
    role: 'Consumer',
    email: process.env.REACT_APP_TEST_CONSUMER_EMAIL || 'consumer@test.fr',
    password: process.env.REACT_APP_TEST_CONSUMER_PASSWORD || 'test123456',
    description: 'Accès aux fonctionnalités B2C',
  },
  {
    role: 'Employee',
    email: process.env.REACT_APP_TEST_EMPLOYEE_EMAIL || 'employee@test.fr',
    password: process.env.REACT_APP_TEST_EMPLOYEE_PASSWORD || 'test123456',
    description: 'Accès collaborateur B2B',
  },
  {
    role: 'Manager',
    email: process.env.REACT_APP_TEST_MANAGER_EMAIL || 'manager@test.fr',
    password: process.env.REACT_APP_TEST_MANAGER_PASSWORD || 'test123456',
    description: 'Accès gestionnaire RH B2B',
  },
];

export default function TestAccountsPage() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copié',
        description: 'Identifiant copié dans le presse-papier',
      });
    } catch (error) {
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
            Cette page et ces identifiants sont destinés au développement et aux tests uniquement.
            Ne jamais utiliser ces comptes en production.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEST_ACCOUNTS.map((account) => (
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
      </div>
    </div>
  );
}
