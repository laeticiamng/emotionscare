import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestAccountsPage() {
  const { toast } = useToast();

  const testAccounts = [
    {
      role: 'Consumer',
      email: 'consumer@test.fr',
      password: 'test123456',
      description: 'Accès aux fonctionnalités B2C',
    },
    {
      role: 'Employee',
      email: 'employee@test.fr',
      password: 'test123456',
      description: 'Accès collaborateur B2B',
    },
    {
      role: 'Manager',
      email: 'manager@test.fr',
      password: 'test123456',
      description: 'Accès gestionnaire RH B2B',
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copié',
      description: 'Identifiant copié dans le presse-papier',
    });
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
