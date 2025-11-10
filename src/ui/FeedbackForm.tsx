import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { logger } from '@/lib/logger';
import { sanitizeInput } from "@/lib/validation/validator";
import { useToast } from "@/hooks/use-toast";

const feedbackFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" }),
  email: z.string()
    .email({ message: "Adresse email invalide" })
    .min(1, { message: "L'email est requis" }),
  message: z.string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" })
    .max(2000, { message: "Le message ne peut pas dépasser 2000 caractères" })
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  function handleSubmit(values: FeedbackFormValues) {
    // Sanitize inputs before logging/processing
    const sanitizedData = {
      name: sanitizeInput(values.name),
      email: sanitizeInput(values.email),
      message: sanitizeInput(values.message)
    };
    
    logger.info('Feedback submitted', sanitizedData, 'UI');
    
    toast({
      title: "Feedback envoyé",
      description: "Merci pour votre retour !",
    });
    
    form.reset();
  }

  return (
    <Card className="p-4 space-y-4 max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feedback-name">
                  Nom <span className="text-destructive" aria-label="requis">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="feedback-name"
                    placeholder="Votre nom"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.name}
                    aria-describedby={form.formState.errors.name ? "feedback-name-error" : undefined}
                  />
                </FormControl>
                <FormMessage id="feedback-name-error" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feedback-email">
                  Email <span className="text-destructive" aria-label="requis">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="feedback-email"
                    type="email"
                    placeholder="votre@email.com"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby={form.formState.errors.email ? "feedback-email-error" : undefined}
                  />
                </FormControl>
                <FormMessage id="feedback-email-error" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="feedback-message">
                  Message <span className="text-destructive" aria-label="requis">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="feedback-message"
                    placeholder="Votre message"
                    rows={4}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.message}
                    aria-describedby={form.formState.errors.message ? "feedback-message-error" : undefined}
                  />
                </FormControl>
                <FormMessage id="feedback-message-error" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={form.formState.isSubmitting}
            aria-busy={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Envoi..." : "Envoyer"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
