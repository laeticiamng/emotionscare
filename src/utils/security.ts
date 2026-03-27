// @ts-nocheck
export interface LoginAttempt {
  count: number;
  lastAttempt: number;
}

const attempts: Record<string, LoginAttempt> = {};

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutes

export function recordLoginAttempt(email: string, success: boolean) {
  const key = email.toLowerCase();
  const now = Date.now();
  const data = attempts[key] || { count: 0, lastAttempt: now };

  if (success) {
    delete attempts[key];
    return;
  }

  if (now - data.lastAttempt > LOGIN_LOCK_TIME_MS) {
    data.count = 1;
  } else {
    data.count += 1;
  }
  data.lastAttempt = now;
  attempts[key] = data;
}

export function isLoginLocked(email: string): boolean {
  const key = email.toLowerCase();
  const data = attempts[key];
  if (!data) return false;
  if (data.count >= MAX_LOGIN_ATTEMPTS && Date.now() - data.lastAttempt < LOGIN_LOCK_TIME_MS) {
    return true;
  }
  return false;
}
