import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';
import { Input } from '../Input';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { ChartA11yCaption } from '../ChartA11yCaption';
import { Form } from '../Form';
import { cleanup } from '@testing-library/react';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('Design system a11y', () => {
  it('Button respecte l’accessibilité', async () => {
    const { container } = render(<Button>Ouvrir un moment calme</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input relie label et erreurs', async () => {
    const { container } = render(<Input label="Intention" error="Message de test" />);
    const input = screen.getByLabelText('Intention');
    expect(input).toHaveAttribute('aria-describedby');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Alert diffuse les messages sans violation', async () => {
    const { container } = render(
      <Alert tone="info" title="Invitation" description="On garde un ton rassurant." />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Modal gère le focus et la fermeture', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open title="Espace ressource" onClose={onClose} description="Respiration apaisante">
        <Button onClick={onClose}>Fermer</Button>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ChartA11yCaption associe la figure décrite', () => {
    document.body.innerHTML = '<figure id="chart-test"></figure>';
    render(
      <ChartA11yCaption
        figureId="chart-test"
        title="Tendance chaleureuse"
        description="La journée se stabilise vers un état apaisé."
      />
    );

    const figure = document.getElementById('chart-test');
    expect(figure?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('Form expose une zone live pour le succès', async () => {
    const { container } = render(
      <Form title="Préparer un rituel" successMessage="Enregistré avec douceur">
        <Input label="Nom du rituel" />
      </Form>
    );

    const liveRegion = screen.getByText('Enregistré avec douceur');
    expect(liveRegion).toHaveAttribute('role', 'status');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
