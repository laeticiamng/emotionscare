import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Lock,
  AlertTriangle,
  FileText,
  Database,
  UserCheck,
  Clock,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const privacySchema = z.object({
  dataProcessing: z.boolean(),
  marketingCommunications: z.boolean(),
  analyticsTracking: z.boolean(),
  thirdPartySharing: z.boolean(),
  locationData: z.boolean(),
  biometricData: z.boolean(),
});

type PrivacyForm = z.infer<typeof privacySchema>;

const PrivacyPage: React.FC = () => {
  const form = useForm<PrivacyForm>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      dataProcessing: true,
      marketingCommunications: false,
      analyticsTracking: true,
      thirdPartySharing: false,
      locationData: false,
      biometricData: true,
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: PrivacyForm) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Privacy settings updated:', data);
      toast.success('Paramètres de confidentialité mis à jour!');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Confidentialité</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <UserCheck className="h-3 w-3 mr-1" />
            RGPD
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Gérez vos données personnelles et paramètres de confidentialité
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Consentements
              </CardTitle>
              <CardDescription>
                Contrôlez l'utilisation de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="biometricData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Données biométriques</FormLabel>
                      <FormDescription>
                        Analyse émotionnelle faciale et vocale
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analyticsTracking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Suivi analytique</FormLabel>
                      <FormDescription>
                        Données d'usage anonymisées
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Shield className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PrivacyPage;