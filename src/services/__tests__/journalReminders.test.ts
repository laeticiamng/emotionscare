// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { journalRemindersService } from '@/services/journalReminders';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('journalRemindersService', () => {
  const mockUser = { id: 'user-123' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getUser).mockResolvedValue({ 
      data: { user: mockUser }, 
      error: null 
    } as any);
  });

  describe('getUserReminders', () => {
    it('récupère les rappels de l\'utilisateur triés', async () => {
      const mockReminders = [
        { id: '1', reminder_time: '09:00', days_of_week: [1, 2, 3] },
        { id: '2', reminder_time: '18:00', days_of_week: [0, 6] },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockReminders, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalRemindersService.getUserReminders();

      expect(supabase.from).toHaveBeenCalledWith('journal_reminders');
      expect(mockQuery.order).toHaveBeenCalledWith('reminder_time', { ascending: true });
      expect(result).toEqual(mockReminders);
    });

    it('retourne un tableau vide si aucune donnée', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalRemindersService.getUserReminders();

      expect(result).toEqual([]);
    });
  });

  describe('createReminder', () => {
    it('crée un nouveau rappel avec les bonnes données', async () => {
      const params = {
        reminder_time: '10:00',
        days_of_week: [1, 3, 5],
        message: 'Test reminder',
      };

      const mockReminder = { id: '1', user_id: 'user-123', ...params };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockReminder, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalRemindersService.createReminder(params);

      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: 'user-123',
        reminder_time: '10:00',
        days_of_week: [1, 3, 5],
        message: 'Test reminder',
        is_active: true,
      });
      expect(result).toEqual(mockReminder);
    });

    it('utilise is_active par défaut à true', async () => {
      const params = {
        reminder_time: '10:00',
        days_of_week: [1],
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await journalRemindersService.createReminder(params);

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: true })
      );
    });

    it('lève une erreur si utilisateur non authentifié', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      } as any);

      const params = {
        reminder_time: '10:00',
        days_of_week: [1],
      };

      await expect(journalRemindersService.createReminder(params)).rejects.toThrow(
        'Utilisateur non authentifié'
      );
    });
  });

  describe('updateReminder', () => {
    it('met à jour un rappel existant', async () => {
      const updates = { reminder_time: '11:00', is_active: false };
      const mockUpdated = { id: 'reminder-1', ...updates };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdated, error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await journalRemindersService.updateReminder('reminder-1', updates);

      expect(mockQuery.update).toHaveBeenCalledWith(updates);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'reminder-1');
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('toggleReminder', () => {
    it('active/désactive un rappel', async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await journalRemindersService.toggleReminder('reminder-1', false);

      expect(mockQuery.update).toHaveBeenCalledWith({ is_active: false });
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'reminder-1');
    });
  });

  describe('deleteReminder', () => {
    it('supprime un rappel', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await journalRemindersService.deleteReminder('reminder-1');

      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'reminder-1');
    });
  });
});
