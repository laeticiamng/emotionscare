import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'Carte structurante pour présenter une information qualitative. Les contenus privilégient des actions et ressentis plutôt que des statistiques.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Controls: Story = {
  args: {
    title: 'Rituel de pause consciente',
    subtitle: 'Un espace pour inviter une respiration guidée et apaiser la journée.',
    actions: <Button variant="ghost">Ouvrir le guide</Button>,
    children: (
      <p>
        Proposez une courte pause sensorielle. Décrivez ce que la personne peut ressentir et comment elle peut s’installer confortablement.
      </p>
    )
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="success"
      title="Structuration accessible"
      description="Le titre est annoncé comme point d’entrée. Les sections internes conservent un ordre logique (H2 puis paragraphe)."
    >
      <ul>
        <li>Utiliser &lt;section&gt; avec role="region" et un titre explicite.</li>
        <li>Décrire les actions sans référence à des scores ou graphiques.</li>
        <li>Garder des paragraphes courts, faciles à vocaliser.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
