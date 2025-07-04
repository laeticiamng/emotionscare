import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BUserRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'une demande d'accès
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Demande envoyée !",
      description: "Votre demande d'accès a été transmise à votre service RH.",
    });
    
    setIsLoading(false);
  };

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            Demande d'accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyCode">Code entreprise</Label>
              <Input
                id="companyCode"
                type="text"
                placeholder="CODE-ENTREPRISE"
                value={formData.companyCode}
                onChange={(e) => setFormData(prev => ({ ...prev, companyCode: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@entreprise.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              Demander l'accès
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/b2b/user/login" className="text-blue-600 hover:underline">
              Déjà un accès ? Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserRegisterPage;