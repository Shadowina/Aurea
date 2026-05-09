import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const STORAGE_KEY = 'moodboard-locale';

function readStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en' || v === 'fr' || v === 'es') return v;
  } catch {
    /* ignore */
  }
  return 'en';
}

const initialLng = readStoredLocale();

function applyHtmlLang(lng) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'fr' ? 'fr' : lng === 'es' ? 'es' : 'en';
  }
}

applyHtmlLang(initialLng);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
  },
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  applyHtmlLang(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
});

export default i18n;
