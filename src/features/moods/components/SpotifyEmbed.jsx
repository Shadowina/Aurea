import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { openSpotifyUrlToEmbedSrc } from '../utils/spotifyEmbedUrl.js';

function useSpotifyEmbedTheme() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '0' : '1',
  );

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(el.classList.contains('dark') ? '0' : '1');
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return theme;
}

export default function SpotifyEmbed({ spotifyUrl }) {
  const { t } = useTranslation();
  const theme = useSpotifyEmbedTheme();

  const embedSrc = useMemo(() => {
    const base = openSpotifyUrlToEmbedSrc(spotifyUrl);
    if (!base) return null;
    const u = new URL(base);
    u.searchParams.set('theme', theme);
    return u.toString();
  }, [spotifyUrl, theme]);

  if (!embedSrc) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/60 shadow-inner dark:border-slate-600/80">
      <iframe
        title={t('moodCard.spotifyEmbedTitle')}
        src={embedSrc}
        width="100%"
        height={352}
        style={{ border: 0, maxWidth: '100%' }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block bg-transparent"
      />
    </div>
  );
}
