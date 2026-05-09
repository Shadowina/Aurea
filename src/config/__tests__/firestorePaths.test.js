import { describe, expect, it } from 'vitest';
import { USER_ENTRIES_COLLECTION, userEntriesCollectionRefSegments } from '../firestorePaths.js';

describe('Firestore paths (smoke)', () => {
  it('uses the entries subcollection under each user', () => {
    expect(USER_ENTRIES_COLLECTION).toBe('entries');
    expect(userEntriesCollectionRefSegments('abc')).toEqual(['users', 'abc', 'entries']);
  });
});
