
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvitationFormData } from '@/types/invitation';
import { toast } from 'sonner';

const invitationSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  role: z.string().nonempty({ message: "Le rôle est obligatoire" }),
});

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvitationFormData) => Promise<void>;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (data: InvitationFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
      toast.success("Invitation envoyée avec succès");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Échec de l'envoi de l'invitation");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
          <DialogDescription>
            Envoyez une invitation sécurisée pour permettre à un collaborateur de rejoindre la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employe_classique">Employé Classique</SelectItem>
                      <SelectItem value="analyste">Analyste (Direction - anonymisé)</SelectItem>
                      <SelectItem value="responsable_bien_etre">Responsable Bien-être</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="mr-2"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer l'invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
