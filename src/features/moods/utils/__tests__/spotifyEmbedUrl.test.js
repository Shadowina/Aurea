import { describe, expect, it } from 'vitest';
import { openSpotifyUrlToEmbedSrc } from '../spotifyEmbedUrl.js';

describe('openSpotifyUrlToEmbedSrc', () => {
  it('maps track URL', () => {
    expect(openSpotifyUrlToEmbedSrc('https://open.spotify.com/track/6rqhFgbbKqdBsBGbtBmG57')).toBe(
      'https://open.spotify.com/embed/track/6rqhFgbbKqdBsBGbtBmG57',
    );
  });

  it('strips intl path prefix', () => {
    expect(openSpotifyUrlToEmbedSrc('https://open.spotify.com/intl-de/track/6rqhFgbbKqdBsBGbtBmG57')).toBe(
      'https://open.spotify.com/embed/track/6rqhFgbbKqdBsBGbtBmG57',
    );
  });

  it('preserves non-theme query params on embed URL', () => {
    const out = openSpotifyUrlToEmbedSrc(
      'https://open.spotify.com/track/6rqhFgbbKqdBsBGbtBmG57?si=abcdef&utm_medium=share',
    );
    expect(out).toContain('/embed/track/6rqhFgbbKqdBsBGbtBmG57');
    expect(out).toContain('si=abcdef');
  });

  it('maps spotify URI', () => {
    expect(openSpotifyUrlToEmbedSrc('spotify:track:6rqhFgbbKqdBsBGbtBmG57')).toBe(
      'https://open.spotify.com/embed/track/6rqhFgbbKqdBsBGbtBmG57',
    );
  });

  it('returns null for non-Spotify URLs', () => {
    expect(openSpotifyUrlToEmbedSrc('https://example.com')).toBeNull();
    expect(openSpotifyUrlToEmbedSrc('')).toBeNull();
  });
});
