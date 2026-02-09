import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminEmptyState from '../AdminEmptyState';
import { Database } from 'lucide-react';

describe('AdminEmptyState', () => {
  it('renders title', () => {
    render(<AdminEmptyState title="Aucune donnee" />);
    expect(screen.getByText('Aucune donnee')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <AdminEmptyState
        title="Vide"
        description="Il n'y a rien ici pour le moment."
      />
    );
    expect(screen.getByText("Il n'y a rien ici pour le moment.")).toBeInTheDocument();
  });

  it('renders action button and handles click', () => {
    const onClick = vi.fn();
    render(
      <AdminEmptyState
        title="Vide"
        action={{ label: 'Ajouter', onClick }}
      />
    );
    const button = screen.getByRole('button', { name: 'Ajouter' });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders secondary action button', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <AdminEmptyState
        title="Vide"
        action={{ label: 'Creer', onClick: onPrimary }}
        secondaryAction={{ label: 'Importer', onClick: onSecondary }}
      />
    );
    expect(screen.getByRole('button', { name: 'Creer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Importer' })).toBeInTheDocument();
  });

  it('accepts custom icon', () => {
    const { container } = render(
      <AdminEmptyState title="Vide" icon={Database} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('uses preset icons correctly', () => {
    const { container: c1 } = render(
      <AdminEmptyState preset="no-results" title="Aucun resultat" />
    );
    expect(c1.querySelector('svg')).toBeInTheDocument();
  });

  it('has status role for accessibility', () => {
    render(<AdminEmptyState title="Vide" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
