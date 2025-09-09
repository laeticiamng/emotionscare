import React from 'react';
import { z } from 'zod';
import { EnhancedForm } from '@/components/ui/enhanced-form';
import PageLayout from '@/components/layout/PageLayout';
import { useNotifications } from '@/components/ui/notification-system';

// Schéma de validation
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  phone: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Exemple d'usage du formulaire avancé
 * Démontre toutes les bonnes pratiques UX/Accessibilité
 */
const FormExample: React.FC = () => {
  const { success, error } = useNotifications();

  const handleSubmit = async (data: ContactFormData) => {
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulation d'erreur parfois pour tester
    if (Math.random() < 0.3) {
      throw new Error('Erreur de réseau lors de l\'envoi');
    }

    success('Message envoyé', 'Votre message a été envoyé avec succès !');
    console.log('Form data:', data);
  };

  const formFields = [
    {
      name: 'name' as const,
      label: 'Nom complet',
      type: 'text' as const,
      placeholder: 'Votre nom et prénom',
      required: true,
      description: 'Utilisé pour personnaliser notre réponse'
    },
    {
      name: 'email' as const,
      label: 'Adresse email',
      type: 'email' as const,
      placeholder: 'votre@email.com',
      required: true,
      description: 'Nous vous répondrons à cette adresse'
    },
    {
      name: 'phone' as const,
      label: 'Téléphone',
      type: 'text' as const,
      placeholder: '+33 6 12 34 56 78',
      description: 'Optionnel - pour un contact plus rapide'
    },
    {
      name: 'subject' as const,
      label: 'Sujet',
      type: 'text' as const,
      placeholder: 'De quoi souhaitez-vous parler ?',
      required: true
    },
    {
      name: 'message' as const,
      label: 'Message',
      type: 'textarea' as const,
      placeholder: 'Décrivez votre demande en détail...',
      required: true,
      description: 'Plus votre message est précis, mieux nous pourrons vous aider'
    }
  ];

  return (
    <PageLayout
      title="Exemple de formulaire"
      description="Démonstration d'un formulaire accessible et robuste"
      backUrl="/examples"
      helpUrl="/help/forms"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Contactez-nous
            </h2>
            <p className="text-muted-foreground">
              Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>

          <EnhancedForm
            schema={contactSchema}
            onSubmit={handleSubmit}
            fields={formFields}
            submitLabel="Envoyer le message"
            loadingLabel="Envoi en cours..."
            defaultValues={{
              name: '',
              email: '',
              subject: '',
              message: '',
              phone: ''
            }}
          />
        </div>

        {/* Informations complémentaires */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Temps de réponse</h3>
            <p className="text-sm text-muted-foreground">
              Nous répondons généralement sous 24h en jours ouvrés.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Urgences</h3>
            <p className="text-sm text-muted-foreground">
              Pour les demandes urgentes, appelez-nous au +33 1 23 45 67 89.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FormExample;