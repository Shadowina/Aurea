/**
 * Maps open.spotify.com links (and spotify: URIs) to the matching embed iframe URL.
 * See https://developer.spotify.com/documentation/embeds
 *
 * @param {string} raw
 * @returns {string | null}
 */
export function openSpotifyUrlToEmbedSrc(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s) return null;

  if (s.startsWith('spotify:')) {
    const segments = s.split(':').filter(Boolean);
    if (segments[0] !== 'spotify' || segments.length < 3) return null;
    const type = segments[1].toLowerCase();
    const id = segments[2];
    const allowed = new Set(['track', 'album', 'playlist', 'episode', 'show', 'artist']);
    if (!allowed.has(type) || !/^[a-zA-Z0-9]+$/.test(id)) return null;
    return `https://open.spotify.com/embed/${type}/${id}`;
  }

  try {
    const u = new URL(s);
    if (u.hostname !== 'open.spotify.com') return null;

    const path = u.pathname.replace(/^\/intl-[a-z]{2}\//i, '/');
    const match = path.match(/^\/(track|album|playlist|episode|show|artist)\/([a-zA-Z0-9]+)/i);
    if (!match) return null;
    const kind = match[1].toLowerCase();
    const id = match[2];
    const next = new URL(`https://open.spotify.com/embed/${kind}/${id}`);
    u.searchParams.forEach((value, key) => {
      if (key !== 'theme') next.searchParams.set(key, value);
    });
    return next.toString();
  } catch {
    return null;
  }
}
