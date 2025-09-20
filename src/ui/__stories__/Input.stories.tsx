import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input';
import { Alert } from '../Alert';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Champ de saisie accessible avec label explicite et message d’accompagnement optionnel. Les erreurs sont reliées via aria-describedby.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Controls: Story = {
  args: {
    label: 'Intention du moment',
    placeholder: 'Décrire une sensation ou un besoin',
    hint: 'Préciser le ressenti plutôt que de chiffrer l’intensité.'
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Erreurs et indices"
      description="Associer les messages aux champs via aria-describedby. Utiliser un texte clair, sans codes couleur uniquement."
    >
      <ul>
        <li>Préserver un contraste suffisant sur le contour du champ.</li>
        <li>Les placeholders ne remplacent pas un label.</li>
        <li>Éviter les validations en direct agressives, préférer un ton encourageant.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
