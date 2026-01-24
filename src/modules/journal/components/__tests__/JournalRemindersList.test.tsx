import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { JournalRemindersList } from '../JournalRemindersList';
import type { JournalReminder } from '@/services/journalReminders';

describe('JournalRemindersList', () => {
  const mockReminders: JournalReminder[] = [
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
    {
      id: '2',
      user_id: 'user-1',
      reminder_time: '20:00',
      days_of_week: [0, 6],
      message: null,
      is_active: false,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  it('affiche un message si aucun rappel', () => {
    render(
      <JournalRemindersList
        reminders={[]}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Aucun rappel configuré')).toBeInTheDocument();
    expect(screen.getByText(/Créez un rappel pour maintenir/)).toBeInTheDocument();
  });

  it('affiche tous les rappels', () => {
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
    expect(screen.getByText('Temps d\'écrire !')).toBeInTheDocument();
  });

  it('affiche le message par défaut si message null', () => {
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Temps d\'écrire dans votre journal')).toBeInTheDocument();
  });

  it('affiche les jours de la semaine avec badges', () => {
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Lun')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
    expect(screen.getByText('Dim')).toBeInTheDocument();
    expect(screen.getByText('Sam')).toBeInTheDocument();
  });

  it('applique l\'opacité réduite aux rappels inactifs', () => {
    const { container } = render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const cards = container.querySelectorAll('[class*="opacity"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('appelle onToggle avec les bons paramètres', () => {
    const onToggle = vi.fn();
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);

    expect(onToggle).toHaveBeenCalledWith('1', false);
  });

  it('appelle onEdit avec le rappel complet', () => {
    const onEdit = vi.fn();
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    const editButtons = screen.getAllByText(/Modifier/);
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockReminders[0]);
  });

  it('appelle onDelete avec l\'id du rappel', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByText(/Supprimer/);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });

  it('désactive le bouton supprimer pendant la suppression', async () => {
    const onDelete = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByText(/Supprimer/);
    const firstDeleteButton = deleteButtons[0].closest('button');
    
    fireEvent.click(firstDeleteButton!);

    expect(firstDeleteButton).toBeDisabled();
  });

  it('affiche les bons attributs aria pour l\'accessibilité', () => {
    render(
      <JournalRemindersList
        reminders={mockReminders}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const switches = screen.getAllByRole('switch');
    expect(switches[0]).toHaveAttribute('aria-label', 'Activer/Désactiver le rappel');
  });
});
