
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvitationFormData, UserRole } from '@/types';
import { sendInvitations } from '@/services/invitationService';
import { useToast } from '@/hooks/use-toast';

const invitationSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),
  role: z.string()
});

interface InvitationFormProps {
  onInvitationSent?: () => void;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onInvitationSent }) => {
  const { toast } = useToast();
  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: 'employee' // Use string value
    }
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  const onSubmit = async (data: InvitationFormData) => {
    try {
      await sendInvitations([data]);
      toast({
        title: 'Invitation envoyée',
        description: `Une invitation a été envoyée à ${data.email}`,
      });
      form.reset();
      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'envoi de l'invitation",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email du collaborateur</FormLabel>
              <FormControl>
                <Input
                  placeholder="collaborateur@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Un email d'invitation sera envoyé à cette adresse.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employee">Employé Classique</SelectItem>
                  <SelectItem value="analyst">Analyste (Direction - anonymisé)</SelectItem>
                  <SelectItem value="wellbeing_manager">Responsable Bien-être</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Détermine les permissions et l'accès de l'utilisateur sur la plateforme.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
        </Button>
      </form>
    </Form>
  );
};

export default InvitationForm;
