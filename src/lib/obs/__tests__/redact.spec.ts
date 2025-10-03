import { describe, expect, it } from 'vitest';
import { redact } from '../redact';

describe('redact', () => {
  it('redacts sensitive keys recursively', () => {
    const input = {
      token: 'secret-token',
      profile: {
        email: 'user@example.com',
        nested: {
          user_id: 'user-123',
        },
      },
      allowed: 'value',
    };

    expect(redact(input)).toEqual({
      token: '[REDACTED]',
      profile: {
        email: '[REDACTED]',
        nested: {
          user_id: '[REDACTED]',
        },
      },
      allowed: 'value',
    });
  });

  it('masks bearer tokens in strings', () => {
    expect(redact('Bearer abc.def-123')).toBe('Bearer [REDACTED]');
  });

  it('keeps non sensitive arrays intact', () => {
    expect(redact(['ok', { password: 'value' }])).toEqual(['ok', { password: '[REDACTED]' }]);
  });
});
