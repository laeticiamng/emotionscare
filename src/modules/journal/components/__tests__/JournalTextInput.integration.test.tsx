import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { JournalTextInput } from '../JournalTextInput';
import type { JournalPrompt } from '@/services/journalPrompts';

describe('JournalTextInput - Intégration avec prompts', () => {
  const mockPrompt: JournalPrompt = {
    id: '1',
    category: 'gratitude',
    prompt_text: 'Qu\'est-ce qui vous a rendu reconnaissant aujourd\'hui ?',
    difficulty_level: 2,
    usage_count: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  };

  it('affiche le bouton de suggestion quand aucun prompt actif', () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={null}
        onRequestNewPrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Obtenir une suggestion d\'écriture')).toBeInTheDocument();
  });

  it('masque le bouton de suggestion si showPromptSuggestion false', () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={false}
        currentPrompt={null}
        onRequestNewPrompt={vi.fn()}
      />
    );

    expect(screen.queryByText('Obtenir une suggestion d\'écriture')).not.toBeInTheDocument();
  });

  it('appelle onRequestNewPrompt au clic sur le bouton', () => {
    const onRequestNewPrompt = vi.fn();
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={null}
        onRequestNewPrompt={onRequestNewPrompt}
      />
    );

    fireEvent.click(screen.getByText('Obtenir une suggestion d\'écriture'));
    expect(onRequestNewPrompt).toHaveBeenCalledTimes(1);
  });

  it('affiche la carte de prompt quand un prompt est fourni', () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onRequestNewPrompt={vi.fn()}
      />
    );

    expect(screen.getByText(mockPrompt.prompt_text)).toBeInTheDocument();
    expect(screen.getByText('Gratitude')).toBeInTheDocument();
  });

  it('remplit le textarea avec le texte du prompt utilisé', async () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onRequestNewPrompt={vi.fn()}
        onDismissPrompt={vi.fn()}
      />
    );

    const useButton = screen.getByText('Utiliser ce prompt');
    fireEvent.click(useButton);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(mockPrompt.prompt_text);
  });

  it('appelle onDismissPrompt après utilisation du prompt', async () => {
    const onDismissPrompt = vi.fn();
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onDismissPrompt={onDismissPrompt}
      />
    );

    const useButton = screen.getByText('Utiliser ce prompt');
    fireEvent.click(useButton);

    expect(onDismissPrompt).toHaveBeenCalledTimes(1);
  });

  it('permet de soumettre après avoir utilisé un prompt', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalTextInput
        onSubmit={onSubmit}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onDismissPrompt={vi.fn()}
      />
    );

    // Utiliser le prompt
    const useButton = screen.getByText('Utiliser ce prompt');
    fireEvent.click(useButton);

    // Soumettre
    const submitButton = screen.getByText('Enregistrer');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(mockPrompt.prompt_text);
    });
  });

  it('permet de modifier le texte après utilisation du prompt', async () => {
    const user = userEvent.setup();
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onDismissPrompt={vi.fn()}
      />
    );

    // Utiliser le prompt
    const useButton = screen.getByText('Utiliser ce prompt');
    fireEvent.click(useButton);

    // Modifier le texte
    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Mon texte modifié');

    expect(textarea).toHaveValue('Mon texte modifié');
  });

  it('masque le bouton de suggestion quand un prompt est affiché', () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onRequestNewPrompt={vi.fn()}
      />
    );

    expect(screen.queryByText('Obtenir une suggestion d\'écriture')).not.toBeInTheDocument();
  });

  it('gère le flux complet : demande > utilisation > soumission', async () => {
    const onRequestNewPrompt = vi.fn();
    const onDismissPrompt = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    const { rerender } = render(
      <JournalTextInput
        onSubmit={onSubmit}
        showPromptSuggestion={true}
        currentPrompt={null}
        onRequestNewPrompt={onRequestNewPrompt}
        onDismissPrompt={onDismissPrompt}
      />
    );

    // 1. Demander un prompt
    fireEvent.click(screen.getByText('Obtenir une suggestion d\'écriture'));
    expect(onRequestNewPrompt).toHaveBeenCalled();

    // 2. Simuler l'apparition du prompt
    rerender(
      <JournalTextInput
        onSubmit={onSubmit}
        showPromptSuggestion={true}
        currentPrompt={mockPrompt}
        onRequestNewPrompt={onRequestNewPrompt}
        onDismissPrompt={onDismissPrompt}
      />
    );

    // 3. Utiliser le prompt
    fireEvent.click(screen.getByText('Utiliser ce prompt'));
    expect(onDismissPrompt).toHaveBeenCalled();

    // 4. Soumettre
    fireEvent.click(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(mockPrompt.prompt_text);
    });
  });

  it('désactive le bouton de suggestion pendant le chargement', () => {
    render(
      <JournalTextInput
        onSubmit={vi.fn()}
        isLoading={true}
        showPromptSuggestion={true}
        currentPrompt={null}
        onRequestNewPrompt={vi.fn()}
      />
    );

    const button = screen.getByText('Obtenir une suggestion d\'écriture').closest('button');
    expect(button).toBeDisabled();
  });
});
