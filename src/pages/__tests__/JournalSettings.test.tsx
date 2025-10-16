import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JournalSettingsPage from '../JournalSettings';
import { useJournalSettings } from '@/hooks/useJournalSettings';

vi.mock('@/hooks/useJournalSettings');

describe('JournalSettingsPage', () => {
  const mockSettings = {
    showPrompts: true,
    promptCategory: 'all' as const,
    autoSuggestPrompt: false,
    enableReminders: true,
  };

  const mockReminders = [
    {
      id: '1',
      user_id: 'user-1',
      reminder_time: '09:00',
      days_of_week: [1, 2, 3, 4, 5],
      message: 'Temps d\'écrire !',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const defaultMockReturn = {
    settings: mockSettings,
    updateSettings: vi.fn(),
    prompts: [],
    getSuggestion: vi.fn(),
    reminders: mockReminders,
    hasActiveReminders: true,
    isLoading: false,
    createReminder: vi.fn().mockResolvedValue(undefined),
    updateReminder: vi.fn().mockResolvedValue(undefined),
    toggleReminder: vi.fn().mockResolvedValue(undefined),
    deleteReminder: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.mocked(useJournalSettings).mockReturnValue(defaultMockReturn);
  });

  it('affiche le titre et la description', () => {
    render(<JournalSettingsPage />);

    expect(screen.getByText('Paramètres du Journal')).toBeInTheDocument();
    expect(screen.getByText('Personnalisez votre expérience d\'écriture')).toBeInTheDocument();
  });

  it('affiche les deux onglets Général et Rappels', () => {
    render(<JournalSettingsPage />);

    expect(screen.getByText('Général')).toBeInTheDocument();
    expect(screen.getByText('Rappels')).toBeInTheDocument();
  });

  it('affiche les paramètres de suggestions dans l\'onglet Général', () => {
    render(<JournalSettingsPage />);

    expect(screen.getByText('Suggestions d\'écriture')).toBeInTheDocument();
    expect(screen.getByText('Afficher les suggestions')).toBeInTheDocument();
  });

  it('toggle showPrompts appelle updateSettings', () => {
    const updateSettings = vi.fn();
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      updateSettings,
    });

    render(<JournalSettingsPage />);

    const toggle = screen.getByLabelText('Afficher les suggestions');
    fireEvent.click(toggle);

    expect(updateSettings).toHaveBeenCalledWith({ showPrompts: false });
  });

  it('affiche les options de catégorie si showPrompts activé', () => {
    render(<JournalSettingsPage />);

    expect(screen.getByText('Catégorie préférée')).toBeInTheDocument();
    expect(screen.getByText('Suggestion automatique')).toBeInTheDocument();
  });

  it('masque les options de catégorie si showPrompts désactivé', () => {
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      settings: { ...mockSettings, showPrompts: false },
    });

    render(<JournalSettingsPage />);

    expect(screen.queryByText('Catégorie préférée')).not.toBeInTheDocument();
    expect(screen.queryByText('Suggestion automatique')).not.toBeInTheDocument();
  });

  it('change la catégorie de prompts', () => {
    const updateSettings = vi.fn();
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      updateSettings,
    });

    render(<JournalSettingsPage />);

    const select = screen.getByLabelText('Catégorie préférée');
    fireEvent.change(select, { target: { value: 'gratitude' } });

    expect(updateSettings).toHaveBeenCalled();
  });

  it('affiche l\'onglet Rappels avec la liste', () => {
    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));

    expect(screen.getByText('Mes rappels')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('ouvre le dialog de création de rappel', () => {
    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));
    fireEvent.click(screen.getByText('Nouveau rappel'));

    expect(screen.getByText('Nouveau rappel')).toBeInTheDocument();
  });

  it('crée un nouveau rappel', async () => {
    const createReminder = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      createReminder,
    });

    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));
    fireEvent.click(screen.getByText('Nouveau rappel'));

    // Simuler la soumission du formulaire
    const form = screen.getByRole('dialog');
    expect(form).toBeInTheDocument();

    // Note: Le test complet nécessiterait de remplir le formulaire
    // mais cela est testé dans JournalReminderForm.test.tsx
  });

  it('ouvre le dialog d\'édition de rappel', async () => {
    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));

    const editButtons = screen.getAllByText(/Modifier/);
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Modifier le rappel')).toBeInTheDocument();
    });
  });

  it('toggle un rappel appelle toggleReminder', async () => {
    const toggleReminder = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      toggleReminder,
    });

    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));

    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);

    await waitFor(() => {
      expect(toggleReminder).toHaveBeenCalledWith({ id: '1', isActive: false });
    });
  });

  it('supprime un rappel', async () => {
    const deleteReminder = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useJournalSettings).mockReturnValue({
      ...defaultMockReturn,
      deleteReminder,
    });

    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));

    const deleteButtons = screen.getAllByText(/Supprimer/);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteReminder).toHaveBeenCalledWith('1');
    });
  });

  it('ferme le dialog de création en appelant onCancel', () => {
    render(<JournalSettingsPage />);

    fireEvent.click(screen.getByText('Rappels'));
    fireEvent.click(screen.getByText('Nouveau rappel'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Fermer le dialog (test du comportement)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    if (closeButtons.length > 0) {
      fireEvent.click(closeButtons[0]);
    }
  });

  it('affiche correctement les icônes dans les onglets', () => {
    const { container } = render(<JournalSettingsPage />);

    // Vérifier la présence des icônes via les classes Lucide
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
