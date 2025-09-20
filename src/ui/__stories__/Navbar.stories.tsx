import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../Navbar';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Navbar> = {
  title: 'Design System/Navbar',
  component: Navbar,
  parameters: {
    docs: {
      description: {
        component: 'Barre de navigation sticky avec lien d’évitement. Les libellés sont descriptifs et orientés vers des actions qualitatives.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Controls: Story = {
  args: {
    brand: <span>EmotionsCare</span>,
    items: [
      { label: 'Accueil', href: '#', current: true, description: 'Rituel d’ouverture apaisant' },
      { label: 'Guides', href: '#guides', description: 'Sélections personnalisées' },
      { label: 'Espace calme', href: '#calm', description: 'Ambiance douce à activer' }
    ],
    actions: <Button variant="ghost">Rejoindre</Button>
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Navigation accessible"
      description="La barre contient un lien “Passer au contenu principal” visible au focus."
    >
      <ul>
        <li>Veiller à l’ordre logique des onglets.</li>
        <li>Identifier la page active via aria-current="page".</li>
        <li>Conserver un contraste élevé sur le fond translucide.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
