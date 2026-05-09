export const USER_ENTRIES_COLLECTION = 'entries';

export function userEntriesCollectionRefSegments(uid) {
  return ['users', uid, USER_ENTRIES_COLLECTION];
}
