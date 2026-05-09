import { describe, expect, it } from 'vitest';
import { getFirestoreUserMessage } from '../firestoreErrors.js';

describe('getFirestoreUserMessage', () => {
  it('maps permission-denied to a friendly explanation', () => {
    const msg = getFirestoreUserMessage({ code: 'permission-denied' });
    expect(msg).toContain('access was denied');
    expect(msg).not.toMatch(/Missing or insufficient permissions/i);
  });

  it('maps raw Firebase permission text when code is missing', () => {
    const msg = getFirestoreUserMessage({ message: 'Missing or insufficient permissions.' });
    expect(msg).toContain('access was denied');
  });

  it('maps unauthenticated', () => {
    expect(getFirestoreUserMessage({ code: 'unauthenticated' })).toContain('signed in');
  });

  it('uses fallback for unknown errors', () => {
    expect(getFirestoreUserMessage({ code: 'unknown', message: 'weird' }, 'Custom fallback')).toBe(
      'Custom fallback',
    );
  });
});
