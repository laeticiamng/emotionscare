import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../Alert';

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: 'Message contextualisé pour informer ou rassurer. Les variantes ajustent le ton (info, succès, attention, soutien).'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Controls: Story = {
  args: {
    tone: 'info',
    title: 'Respiration conseillée',
    description: 'Proposez de respirer profondément et de laisser les épaules s’alourdir quelques instants.'
  }
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="warning"
      title="Régions live"
      description={'Choisir role="status" pour les informations calmes, role="alert" pour les urgences.'}
    >
      <ul>
        <li>Limiter la densité textuelle pour favoriser une lecture rapide.</li>
        <li>Éviter les onomatopées anxiogènes.</li>
        <li>Prioriser une tonalité empathique et sans chiffres.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
