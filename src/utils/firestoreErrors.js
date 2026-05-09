/**
 * Maps Firebase/Firestore errors to user-facing copy.
 */

const GENERIC = 'Something went wrong. Please try again.';
const PERMISSION =
  'Your changes could not be saved because access was denied. If this keeps happening, ask an admin to publish Firestore security rules for this app.';
const OFFLINE = 'You appear to be offline. Check your connection and try again.';
const UNAVAILABLE = 'The service is temporarily unavailable. Please try again in a moment.';
const NOT_FOUND = 'That item could not be found. It may have already been removed.';

export function getFirestoreUserMessage(error, fallback = GENERIC) {
  if (!error) return fallback;

  const code = error.code ?? error?.cause?.code;

  switch (code) {
    case 'permission-denied':
      return PERMISSION;
    case 'unauthenticated':
      return 'You must be signed in to do that.';
    case 'failed-precondition':
      return 'This action is not available right now. Please try again.';
    case 'unavailable':
      return UNAVAILABLE;
    case 'deadline-exceeded':
      return 'The request took too long. Please try again.';
    case 'resource-exhausted':
      return 'Too many requests. Please wait a moment and try again.';
    case 'not-found':
      return NOT_FOUND;
    case 'cancelled':
      return 'The request was cancelled.';
    default:
      break;
  }

  const msg = typeof error.message === 'string' ? error.message : '';
  if (/Missing or insufficient permissions/i.test(msg)) {
    return PERMISSION;
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return OFFLINE;
  }

  return fallback;
}
