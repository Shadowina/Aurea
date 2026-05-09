import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { auth, provider } from '../../../config/firebase.js';

const EMAIL_AUTH_KEYS = {
  'auth/email-already-in-use': 'emailInUse',
  'auth/invalid-email': 'invalidEmail',
  'auth/weak-password': 'weakPassword',
  'auth/user-not-found': 'userNotFound',
  'auth/wrong-password': 'wrongPassword',
  'auth/invalid-credential': 'invalidCredential',
};

const GOOGLE_AUTH_KEYS = {
  'auth/popup-closed-by-user': 'popupClosed',
  'auth/popup-blocked': 'popupBlocked',
  'auth/account-exists-with-different-credential': 'accountExists',
};

export default function Auth() {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError(t('auth.errors.fillFields'));
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.passwordShort'));
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const suffix = EMAIL_AUTH_KEYS[err.code];
      setError(
        suffix ? t(`auth.errors.${suffix}`) : err.message || t('auth.errors.tryAgain'),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      const suffix = GOOGLE_AUTH_KEYS[err.code];
      if (suffix) {
        setError(t(`auth.errors.${suffix}`));
      } else {
        setError(err.message || t('auth.errors.googleFailed'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card border border-white/70 px-8 py-10 shadow-soft animate-in dark:border-slate-700/80">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/20 text-3xl">
                ✨
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-midnight dark:text-slate-100">
              {isSignUp ? t('auth.createAccount') : t('auth.welcomeBack')}
            </h1>
            <p className="text-sm text-slate-500">
              {isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full rounded-xl border border-neutral/60 bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full rounded-xl border border-neutral/60 bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full rounded-xl border border-neutral/60 bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isSignUp ? t('auth.creatingAccount') : t('auth.signingIn')}
                </span>
              ) : isSignUp ? (
                t('auth.createAccountBtn')
              ) : (
                t('auth.signInBtn')
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral/60"></div>
            <span className="text-xs font-medium text-slate-400">{t('auth.or')}</span>
            <div className="h-px flex-1 bg-neutral/60"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral/60 bg-white/70 px-4 py-3 text-sm font-medium text-midnight transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {googleLoading ? (
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>{googleLoading ? t('auth.signingInGoogle') : t('auth.continueGoogle')}</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {isSignUp ? t('auth.alreadyHave') : t('auth.noAccount')}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-teal transition hover:text-teal/80 focus:outline-none focus:underline"
                disabled={loading || googleLoading}
              >
                {isSignUp ? t('auth.signInLink') : t('auth.signUpLink')}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">{t('auth.terms')}</p>
      </div>
    </div>
  );
}
