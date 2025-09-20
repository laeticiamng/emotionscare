import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../Spinner';
import { Alert } from '../Alert';

const meta: Meta<typeof Spinner> = {
  title: 'Design System/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: 'Indicateur de chargement discret avec libellé masqué mais accessible. Toujours accompagner d’un contexte texte.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Controls: Story = {
  args: {
    label: 'Préparation de la playlist réconfortante'
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Chargement"
      description="Le libellé annonce ce qui se passe. Préférer une phrase apaisante plutôt qu’un pourcentage."
    >
      <ul>
        <li>Ajouter le spinner proche de la zone concernée.</li>
        <li>Limiter l’usage prolongé pour éviter la fatigue visuelle.</li>
        <li>Respecter prefers-reduced-motion en désactivant l’animation.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
