// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle2, Shield } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/validation/auth';
import { b2cAuthService } from '@/services/auth';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onOpenChange,
  email,
}) => {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ?? '',
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      form.reset({ email: email ?? '' });
      setServerError(null);
      setSuccessMessage(null);
    }
  }, [open, email, form]);

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setServerError(null);
      setSuccessMessage(null);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: ResetPasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await b2cAuthService.requestPasswordReset(values.email);
      setSuccessMessage(
        'Un email de réinitialisation vient de vous être envoyé. Vérifiez votre boîte de réception.',
      );
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            Réinitialiser votre mot de passe
          </DialogTitle>
          <DialogDescription>
            Indiquez l'adresse email associée à votre compte. Nous vous enverrons un lien sécurisé
            pour choisir un nouveau mot de passe.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="forgot-password-form"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="vous@example.com"
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <Alert
                variant="destructive"
                data-testid="reset-error"
                className="border-destructive/70"
              >
                <AlertTitle>Envoi impossible</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert data-testid="reset-success" className="border-green-500/50 bg-green-50">
                <AlertTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                  Email envoyé
                </AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleClose(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="min-w-[8rem]"
                disabled={isSubmitting}
                data-testid="forgot-password-submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Envoi...
                  </span>
                ) : (
                  'Envoyer le lien'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
