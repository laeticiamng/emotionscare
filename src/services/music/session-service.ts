// @ts-nocheck
import { MusicSession } from '@/types/music';

const sessions: MusicSession[] = [];

export async function createMusicSession(session: Omit<MusicSession, 'id' | 'createdAt' | 'updatedAt'> & { notes?: string }): Promise<MusicSession> {
  const newSession: MusicSession = {
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    ...session,
  };
  sessions.push(newSession);
  return new Promise(resolve => setTimeout(() => resolve(newSession), 300));
}

export async function updateMusicSession(id: string, updates: Partial<MusicSession>): Promise<MusicSession> {
  const index = sessions.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Session not found');
  }
  const updated = { ...sessions[index], ...updates, updatedAt: new Date().toISOString() };
  sessions[index] = updated;
  return new Promise(resolve => setTimeout(() => resolve(updated), 300));
}

export async function getUserMusicSessions(userId: string): Promise<MusicSession[]> {
  return new Promise(resolve =>
    setTimeout(() => resolve(sessions.filter(s => s.userId === userId)), 200)
  );
}
