/**
 * Tests pour JournalEntryCard
 * Day 41 - Module 21: Journal UI Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { JournalEntryCard } from '../JournalEntryCard';
import type { JournalEntry } from '@/services/journal';

describe('JournalEntryCard', () => {
  const mockEntry: JournalEntry = {
    id: 'entry-1',
    user_id: 'user-1',
    content: 'Test journal entry content',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  };

  it('affiche le contenu de l\'entrée', () => {
    render(<JournalEntryCard entry={mockEntry} />);
    
    expect(screen.getByText('Test journal entry content')).toBeInTheDocument();
  });

  it('affiche la date formatée en français', () => {
    render(<JournalEntryCard entry={mockEntry} />);
    
    expect(screen.getByText(/15 janvier 2025/i)).toBeInTheDocument();
  });

  it('affiche le badge de ton positif', () => {
    const entryWithTone = {
      ...mockEntry,
      emotion_analysis: { tone: 'positive' },
    };
    
    render(<JournalEntryCard entry={entryWithTone} />);
    
    expect(screen.getByText('Positif')).toBeInTheDocument();
  });

  it('affiche le badge de ton négatif', () => {
    const entryWithTone = {
      ...mockEntry,
      emotion_analysis: { tone: 'negative' },
    };
    
    render(<JournalEntryCard entry={entryWithTone} />);
    
    expect(screen.getByText('Négatif')).toBeInTheDocument();
  });

  it('affiche le badge de ton neutre', () => {
    const entryWithTone = {
      ...mockEntry,
      emotion_analysis: { tone: 'neutral' },
    };
    
    render(<JournalEntryCard entry={entryWithTone} />);
    
    expect(screen.getByText('Neutre')).toBeInTheDocument();
  });

  it('affiche le bouton audio si disponible', () => {
    const entryWithAudio = {
      ...mockEntry,
      emotion_analysis: { audio_url: 'https://example.com/audio.mp3' },
    };
    
    render(<JournalEntryCard entry={entryWithAudio} />);
    
    const audioButton = screen.getByLabelText('Écouter l\'enregistrement');
    expect(audioButton).toBeInTheDocument();
  });

  it('appelle onPlayAudio au clic sur le bouton audio', () => {
    const onPlayAudio = vi.fn();
    const entryWithAudio = {
      ...mockEntry,
      emotion_analysis: { audio_url: 'https://example.com/audio.mp3' },
    };
    
    render(<JournalEntryCard entry={entryWithAudio} onPlayAudio={onPlayAudio} />);
    
    const audioButton = screen.getByLabelText('Écouter l\'enregistrement');
    fireEvent.click(audioButton);
    
    expect(onPlayAudio).toHaveBeenCalledWith('https://example.com/audio.mp3');
  });

  it('affiche le bouton éditer si onEdit fourni', () => {
    const onEdit = vi.fn();
    
    render(<JournalEntryCard entry={mockEntry} onEdit={onEdit} />);
    
    const editButton = screen.getByLabelText('Modifier l\'entrée');
    expect(editButton).toBeInTheDocument();
  });

  it('appelle onEdit avec l\'entrée au clic', () => {
    const onEdit = vi.fn();
    
    render(<JournalEntryCard entry={mockEntry} onEdit={onEdit} />);
    
    const editButton = screen.getByLabelText('Modifier l\'entrée');
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockEntry);
  });

  it('affiche le bouton supprimer si onDelete fourni', () => {
    const onDelete = vi.fn();
    
    render(<JournalEntryCard entry={mockEntry} onDelete={onDelete} />);
    
    const deleteButton = screen.getByLabelText('Supprimer l\'entrée');
    expect(deleteButton).toBeInTheDocument();
  });

  it('appelle onDelete avec l\'id au clic', () => {
    const onDelete = vi.fn();
    
    render(<JournalEntryCard entry={mockEntry} onDelete={onDelete} />);
    
    const deleteButton = screen.getByLabelText('Supprimer l\'entrée');
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('entry-1');
  });

  it('n\'affiche pas de boutons d\'action si non fournis', () => {
    render(<JournalEntryCard entry={mockEntry} />);
    
    expect(screen.queryByLabelText('Modifier l\'entrée')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Supprimer l\'entrée')).not.toBeInTheDocument();
  });

  it('applique la classe CSS personnalisée', () => {
    const { container } = render(
      <JournalEntryCard entry={mockEntry} className="custom-class" />
    );
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('préserve les sauts de ligne dans le contenu', () => {
    const entryWithNewlines = {
      ...mockEntry,
      content: 'Ligne 1\nLigne 2\nLigne 3',
    };
    
    render(<JournalEntryCard entry={entryWithNewlines} />);
    
    const content = screen.getByText(/Ligne 1/);
    expect(content).toHaveClass('whitespace-pre-wrap');
  });
});
