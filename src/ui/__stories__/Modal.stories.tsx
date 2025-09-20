import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component:
          'Fenêtre modale avec focus trap, fermeture Esc et retour du focus. À réserver aux interventions délicates nécessitant une attention pleine.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Modal>;

function ModalPlayground() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Ouvrir la respiration guidée</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Respiration cohérente"
        description="Invitez la personne à se déposer. Décrivez la posture et la durée ressentie, sans compter les inspirations."
      >
        <p>
          Proposez un rythme doux : inspirez profondément en visualisant une couleur apaisante, puis relâchez lentement les épaules.
          Suggérez un son rassurant ou une lumière tamisée pour accompagner ce moment.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button onClick={() => setOpen(false)}>Commencer</Button>
        </div>
      </Modal>
    </div>
  );
}

export const Controls: Story = {
  render: () => <ModalPlayground />
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="warning"
      title="Garder le focus maîtrisé"
      description="La modale capture le focus et le restitue au déclencheur. La fermeture via Échap et clic sur l’arrière-plan est supportée."
    >
      <ul>
        <li>Définir aria-modal="true" et aria-describedby relié à la description.</li>
        <li>Limiter les modales aux actions critiques.</li>
        <li>Prévoir une alternative non modale si la situation le permet.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
