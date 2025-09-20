import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '../Form';
import { Input } from '../Input';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Form> = {
  title: 'Design System/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component: 'Formulaire structuré avec zone live polite pour messages doux. Chaque champ garde son label et ses descriptions associées.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Controls: Story = {
  render: () => (
    <Form
      title="Préparer un instant de soin"
      description="Collectez uniquement les informations nécessaires pour guider la séance."
      actions={
        <>
          <Button variant="ghost" type="reset">
            Réinitialiser
          </Button>
          <Button type="submit">Enregistrer la préparation</Button>
        </>
      }
    >
      <Input
        label="Thématique choisie"
        placeholder="Exemple : Apaiser avant le sommeil"
        hint="Décrivez l’intention ressentie."
      />
      <Input
        label="Support souhaité"
        placeholder="Exemple : Playlist douce, guidance vocale"
      />
    </Form>
  )
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="success"
      title="Processus rassurant"
      description="Informer l’utilisatrice de l’état du formulaire sans générer d’anxiété. Les messages sont transmis via aria-live." 
    >
      <ul>
        <li>Éviter les validations bloquantes au fil de la frappe.</li>
        <li>Restituer les erreurs en langage empathique.</li>
        <li>Informer les succès via une région `role="status"`.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
