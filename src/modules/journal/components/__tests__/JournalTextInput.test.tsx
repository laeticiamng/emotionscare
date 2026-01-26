/**
 * Tests pour JournalTextInput
 * Day 41 - Module 21: Journal UI Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { JournalTextInput } from '../JournalTextInput';

describe('JournalTextInput', () => {
  it('affiche le placeholder par défaut', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    expect(screen.getByPlaceholderText('Écrivez votre pensée du jour...')).toBeInTheDocument();
  });

  it('affiche un placeholder personnalisé', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} placeholder="Placeholder personnalisé" />);
    
    expect(screen.getByPlaceholderText('Placeholder personnalisé')).toBeInTheDocument();
  });

  it('met à jour le compteur de caractères lors de la saisie', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Test');
    
    expect(screen.getByText('4 / 5000')).toBeInTheDocument();
  });

  it('empêche la saisie au-delà de maxLength', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} maxLength={10} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Texte trop long');
    
    // Seulement 10 caractères devraient être acceptés
    expect(screen.getByText('10 / 10')).toBeInTheDocument();
  });

  it('affiche un compteur proche de la limite', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} maxLength={10} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, '123456789'); // 9 caractères (> 90% de 10)
    
    const counter = screen.getByText('9 / 10');
    expect(counter).toBeInTheDocument();
  });

  it('désactive le bouton si texte vide', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    // Le bouton contient "Enregistrer" dans son span enfant
    const button = screen.getByText('Enregistrer').closest('button');
    expect(button).toBeDisabled();
  });

  it('désactive le bouton si seulement des espaces', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, '   ');
    
    const button = screen.getByText('Enregistrer').closest('button');
    expect(button).toBeDisabled();
  });

  it('active le bouton avec du texte valide', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Test valide');
    
    const button = screen.getByText('Enregistrer').closest('button');
    expect(button).not.toBeDisabled();
  });

  it('appelle onSubmit avec le texte au clic du bouton', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Mon entrée');
    
    const button = screen.getByText('Enregistrer').closest('button')!;
    await user.click(button);
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Mon entrée');
    });
  });

  it('efface le texte après soumission réussie', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal') as HTMLTextAreaElement;
    await user.type(textarea, 'Mon entrée');
    
    const button = screen.getByText('Enregistrer').closest('button')!;
    await user.click(button);
    
    await waitFor(() => {
      expect(textarea.value).toBe('');
      expect(screen.getByText('0 / 5000')).toBeInTheDocument();
    });
  });

  it('soumet avec Ctrl+Entrée', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Mon entrée');
    await user.keyboard('{Control>}{Enter}{/Control}');
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Mon entrée');
    });
  });

  it('soumet avec Cmd+Entrée (Mac)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    await user.type(textarea, 'Mon entrée');
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Mon entrée');
    });
  });

  it('désactive le bouton via la prop isLoading', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} isLoading={true} />);
    
    // Pendant le chargement, le texte change
    const button = screen.getByText('Enregistrement...').closest('button');
    expect(button).toBeDisabled();
  });

  it('affiche un loader pendant isLoading', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} isLoading={true} />);
    
    expect(screen.getByText('Enregistrement...')).toBeInTheDocument();
  });

  it('désactive le textarea pendant isLoading', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} isLoading={true} />);
    
    const textarea = screen.getByLabelText('Saisie de journal');
    expect(textarea).toBeDisabled();
  });

  it('affiche l\'astuce du raccourci clavier', () => {
    const onSubmit = vi.fn();
    
    render(<JournalTextInput onSubmit={onSubmit} />);
    
    expect(screen.getByText(/Ctrl\+Entrée/i)).toBeInTheDocument();
  });
});
