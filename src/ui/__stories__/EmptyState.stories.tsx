import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../EmptyState';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof EmptyState> = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: 'État vide pour inviter à une action douce. L’illustration reste décorative et les textes privilégient un ton rassurant.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Controls: Story = {
  args: {
    title: 'Aucune ambiance enregistrée',
    description: 'Créez un premier rituel sonore pour offrir un refuge apaisant lors des moments tendus.',
    action: <Button variant="primary">Composer une ambiance</Button>
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="success"
      title="Faire simple"
      description="Un état vide doit guider sans culpabiliser. Indiquer l’étape suivante et la valeur ajoutée."
    >
      <ul>
        <li>Utiliser role="status" pour annoncer la situation.</li>
        <li>Éviter les images de tristesse caricaturale.</li>
        <li>Proposer une action claire, non chiffrée.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
