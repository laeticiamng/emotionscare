import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Bouton haute lisibilité, décliné en variantes émotionnelles. Les états de focus sont toujours visibles et les libellés évitent toute donnée chiffrée.'
      }
    },
    controls: { expanded: true }
  },
  argTypes: {
    onClick: { action: 'cliqué' }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Controls: Story = {
  args: {
    children: 'Lancer une respiration guidée',
    variant: 'primary',
    size: 'md'
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Bonnes pratiques accessibilité"
      description="Le texte du bouton décrit clairement l’action. Utiliser aria-pressed pour les boutons à état (ex. activer un retour sonore)."
    >
      <ul>
        <li>Ne masquer jamais le focus visuel.</li>
        <li>Privilégier des verbes d’action descriptifs, sans métriques.</li>
        <li>Assurer un contraste minimum de 4.5:1 entre le texte et le fond.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
