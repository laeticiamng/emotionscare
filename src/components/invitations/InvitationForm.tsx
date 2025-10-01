// @ts-nocheck

// @ts-nocheck
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/types';

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  role: z.string({ required_error: "Veuillez sélectionner un rôle" }),
  message: z.string().optional(),
  expires_in_days: z.number().int().min(1).max(30).default(7)
});

interface InvitationFormProps {
  onInvitationSent?: () => void; // Make this optional for backward compatibility
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onInvitationSent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'user',
      message: '',
      expires_in_days: 7
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call - would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${values.email}`,
      });
      
      form.reset();
      
      // Call the callback if provided
      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
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
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message personnalisé (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Entrez un message personnalisé pour l'invité..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expires_in_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expire dans (jours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={30} 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer l'invitation"}
        </Button>
      </form>
    </Form>
  );
};

export default InvitationForm;
