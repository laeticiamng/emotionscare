import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ChartA11yCaption } from '../ChartA11yCaption';
import { Alert } from '../Alert';

const meta: Meta<typeof ChartA11yCaption> = {
  title: 'Design System/ChartA11yCaption',
  component: ChartA11yCaption,
  parameters: {
    docs: {
      description: {
        component: 'Légende descriptive pour relier un graphique à une narration textuelle. Permet d’annoncer les tendances sans chiffres.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChartA11yCaption>;

function ChartPreview() {
  useEffect(() => {
    // Crée un élément factice pour simuler le graphique.
    const canvas = document.createElement('div');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Courbe de sérénité sur la semaine');
    canvas.style.height = '160px';
    canvas.style.borderRadius = '1rem';
    canvas.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(16, 185, 129, 0.16))';
    const container = document.getElementById('demo-chart');
    if (container && container.firstChild === null) {
      container.appendChild(canvas);
    }
    return () => {
      if (container && canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <figure id="demo-chart" aria-labelledby="demo-chart-title">
      <h3 id="demo-chart-title" style={{ marginBottom: '0.75rem' }}>
        Perception de calme
      </h3>
      <ChartA11yCaption
        figureId="demo-chart"
        title="Lecture accessible"
        description="La courbe illustre une progression régulière vers plus de détente au fil des derniers jours."
        insights={['Montée douce en fin de journée', 'Aucun pic brutal détecté']}
        recommendations={['Proposer un rituel similaire en début de soirée', 'Encourager une respiration lente après le repas']}
      />
    </figure>
  );
}

export const Controls: Story = {
  render: () => <ChartPreview />
};

export const A11yNotes: Story = {
  render: () => (
    <Alert
      tone="info"
      title="Description riche"
      description="Détailler la tendance plutôt que les valeurs. Mentionner le contexte temporel et l’impact attendu."
    >
      <ul>
        <li>Relier la description via aria-describedby.</li>
        <li>Ajouter une alternative textuelle si le graphique est décoratif.</li>
        <li>Éviter toute donnée numérique affichée.</li>
      </ul>
    </Alert>
  ),
  parameters: {
    controls: { disable: true },
    actions: { disable: true }
  }
};
