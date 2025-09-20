import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';
import { Alert } from '../Alert';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: 'Badge textuel servant à signaler une tonalité émotionnelle ou un statut qualitatif. Aucune donnée numérique n’est affichée.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Controls: Story = {
  args: {
    tone: 'brand',
    children: 'Climat apaisé'
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Utilisation"
      description="Les badges doivent renforcer un contexte. Préférer un texte court et éviter les acronymes non explicités."
    >
      <ul>
        <li>Coupler avec un libellé visible (ex. “Ambiance” + badge).</li>
        <li>Éviter les combinaisons uniquement colorées pour différencier.</li>
        <li>Ne pas employer le badge pour transmettre une valeur chiffrée.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
