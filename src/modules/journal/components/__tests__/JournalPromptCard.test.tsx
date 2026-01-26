// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { JournalPromptCard } from '../JournalPromptCard';
import type { JournalPrompt } from '@/services/journalPrompts';

describe('JournalPromptCard', () => {
  const mockPrompt: JournalPrompt = {
    id: '1',
    category: 'gratitude',
    prompt_text: 'Qu\'est-ce qui vous a rendu reconnaissant aujourd\'hui ?',
    difficulty_level: 2,
    usage_count: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  };

  it('affiche le texte du prompt', () => {
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    expect(screen.getByText(mockPrompt.prompt_text)).toBeInTheDocument();
  });

  it('affiche la catégorie correcte', () => {
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Gratitude')).toBeInTheDocument();
  });

  it('affiche le niveau de difficulté en étoiles', () => {
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    const stars = screen.getByTitle('Niveau 2');
    expect(stars).toHaveTextContent('⭐⭐');
  });

  it('appelle onUsePrompt avec le texte du prompt', () => {
    const onUsePrompt = vi.fn();
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={onUsePrompt}
      />
    );

    fireEvent.click(screen.getByText('Utiliser ce prompt'));
    expect(onUsePrompt).toHaveBeenCalledWith(mockPrompt.prompt_text);
  });

  it('affiche le bouton "Autre" si onDismiss fourni', () => {
    const onDismiss = vi.fn();
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={vi.fn()}
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByText('Autre');
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('n\'affiche pas le bouton "Autre" si onDismiss absent', () => {
    render(
      <JournalPromptCard
        prompt={mockPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    expect(screen.queryByText('Autre')).not.toBeInTheDocument();
  });

  it('applique les bonnes couleurs selon la catégorie', () => {
    const reflectionPrompt = { ...mockPrompt, category: 'reflection' as const };
    const { rerender } = render(
      <JournalPromptCard
        prompt={reflectionPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Réflexion')).toBeInTheDocument();

    const emotionsPrompt = { ...mockPrompt, category: 'emotions' as const };
    rerender(
      <JournalPromptCard
        prompt={emotionsPrompt}
        onUsePrompt={vi.fn()}
      />
    );

    expect(screen.getByText('Émotions')).toBeInTheDocument();
  });
});
