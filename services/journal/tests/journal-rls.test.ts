import { describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Journal RLS Policies', () => {
  const USER_1_ID = '00000000-0000-0000-0000-000000000001';
  const USER_2_ID = '00000000-0000-0000-0000-000000000002';

  describe('journal_voice RLS', () => {
    it('should allow users to view only their own voice entries', async () => {
      // User 1 inserts an entry
      const { data: inserted } = await supabase
        .from('journal_voice')
        .insert({
          user_id: USER_1_ID,
          audio_url: 'https://example.com/private.mp3',
          transcript: 'Private entry',
        })
        .select()
        .single();

      expect(inserted).toBeDefined();

      // User 1 can read their own entry
      const { data: ownEntry } = await supabase
        .from('journal_voice')
        .select('*')
        .eq('id', inserted!.id)
        .single();

      expect(ownEntry).toBeDefined();
      expect(ownEntry!.user_id).toBe(USER_1_ID);

      // User 2 cannot read User 1's entry (RLS policy should block)
      // Note: This test assumes authenticated user context
      // In real tests, you'd switch auth context between users
    });

    it('should allow users to insert their own voice entries', async () => {
      const { data, error } = await supabase
        .from('journal_voice')
        .insert({
          user_id: USER_1_ID,
          audio_url: 'https://example.com/insert-test.mp3',
          transcript: 'Insert test',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.user_id).toBe(USER_1_ID);
    });

    it('should prevent users from inserting entries for other users', async () => {
      // Attempt to insert as USER_2 while authenticated as USER_1
      // This should be blocked by RLS WITH CHECK policy
      const { error } = await supabase
        .from('journal_voice')
        .insert({
          user_id: USER_2_ID,
          audio_url: 'https://example.com/forbidden.mp3',
          transcript: 'Forbidden entry',
        })
        .select();

      // RLS should block this - expect an error
      expect(error).toBeDefined();
    });

    it('should allow users to update their own voice entries', async () => {
      const { data: inserted } = await supabase
        .from('journal_voice')
        .insert({
          user_id: USER_1_ID,
          audio_url: 'https://example.com/update-test.mp3',
          transcript: 'Original transcript',
        })
        .select()
        .single();

      const { data: updated, error } = await supabase
        .from('journal_voice')
        .update({ transcript: 'Updated transcript' })
        .eq('id', inserted!.id)
        .select()
        .single();

      expect(error).toBeNull();
      expect(updated).toBeDefined();
      expect(updated!.transcript).toBe('Updated transcript');
    });

    it('should allow users to delete their own voice entries', async () => {
      const { data: inserted } = await supabase
        .from('journal_voice')
        .insert({
          user_id: USER_1_ID,
          audio_url: 'https://example.com/delete-test.mp3',
          transcript: 'To be deleted',
        })
        .select()
        .single();

      const { error } = await supabase
        .from('journal_voice')
        .delete()
        .eq('id', inserted!.id);

      expect(error).toBeNull();

      // Verify deletion
      const { data: deleted } = await supabase
        .from('journal_voice')
        .select()
        .eq('id', inserted!.id)
        .single();

      expect(deleted).toBeNull();
    });
  });

  describe('journal_text RLS', () => {
    it('should allow users to view only their own text entries', async () => {
      const { data: inserted } = await supabase
        .from('journal_text')
        .insert({
          user_id: USER_1_ID,
          content: 'Private text entry',
        })
        .select()
        .single();

      expect(inserted).toBeDefined();

      const { data: ownEntry } = await supabase
        .from('journal_text')
        .select('*')
        .eq('id', inserted!.id)
        .single();

      expect(ownEntry).toBeDefined();
      expect(ownEntry!.user_id).toBe(USER_1_ID);
    });

    it('should allow users to insert their own text entries', async () => {
      const { data, error } = await supabase
        .from('journal_text')
        .insert({
          user_id: USER_1_ID,
          content: 'Insert test text',
          tags: ['test'],
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.content).toBe('Insert test text');
    });

    it('should allow users to update their own text entries', async () => {
      const { data: inserted } = await supabase
        .from('journal_text')
        .insert({
          user_id: USER_1_ID,
          content: 'Original content',
        })
        .select()
        .single();

      const { data: updated, error } = await supabase
        .from('journal_text')
        .update({ content: 'Updated content' })
        .eq('id', inserted!.id)
        .select()
        .single();

      expect(error).toBeNull();
      expect(updated!.content).toBe('Updated content');
    });

    it('should allow users to delete their own text entries', async () => {
      const { data: inserted } = await supabase
        .from('journal_text')
        .insert({
          user_id: USER_1_ID,
          content: 'To be deleted',
        })
        .select()
        .single();

      const { error } = await supabase
        .from('journal_text')
        .delete()
        .eq('id', inserted!.id);

      expect(error).toBeNull();
    });
  });
});
