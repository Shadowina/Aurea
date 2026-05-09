import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronDown, LogOut, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import ConfirmDialog from '../../../components/ConfirmDialog.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-xs font-medium transition ${
    isActive
      ? 'bg-teal/15 text-teal dark:bg-teal/25 dark:text-teal-200'
      : 'text-slate-600 hover:bg-slate-100/70 hover:text-midnight dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
  }`

const menuItemClass = ({ isActive }) =>
  `flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
    isActive
      ? 'bg-teal/10 font-medium text-teal dark:bg-teal/20 dark:text-teal-200'
      : 'text-midnight hover:bg-slate-100/90 dark:text-slate-200 dark:hover:bg-slate-800/90'
  }`

export default function AppHeader({ user, totalEntries, onSignOut }) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const handleSignOutClick = () => {
    setMenuOpen(false)
    setConfirmOpen(true)
  }

  const handleConfirmSignOut = () => {
    onSignOut()
    setConfirmOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  const openMenu = () => setMenuOpen(true)

  const displayLabel = user?.displayName?.trim() || user?.email || t('common.unknown')

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/85">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal/20 text-xl text-teal">
            ✨
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">{t('header.brandSubtitle')}</p>
            <h1 className="truncate text-xl font-semibold text-midnight dark:text-slate-100">{t('header.tagline')}</h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100/70 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 sm:flex">
            <span className="rounded-full bg-white px-3 py-1 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {t('header.entriesLabel')}
            </span>
            <span className="text-slate-700 dark:text-slate-200">{totalEntries}</span>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2" aria-label={t('nav.main')}>
            <NavLink to="/" end className={navLinkClass}>
              {t('nav.dashboard')}
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass}>
              {t('nav.analytics')}
            </NavLink>
            <NavLink to="/gallery" className={navLinkClass}>
              {t('nav.gallery')}
            </NavLink>
          </nav>

          {user && (
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                type="button"
                id="user-menu-button"
                className="flex max-w-[min(100vw-12rem,200px)] items-center gap-2 rounded-full border border-transparent px-2 py-1.5 text-left transition hover:border-slate-200/80 hover:bg-slate-100/70 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-controls="user-menu"
                title={t('header.userMenuToggle')}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/20 text-sm font-semibold text-teal">
                  {(user.displayName || user.email) ? (user.displayName || user.email).charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="hidden max-w-[120px] truncate text-xs text-slate-600 dark:text-slate-400 sm:inline">
                  {displayLabel}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform dark:text-slate-400 ${menuOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              <div
                id="user-menu"
                role="menu"
                aria-labelledby="user-menu-button"
                className={`absolute right-0 top-full z-50 -mt-2 pt-3 transition-opacity duration-150 ${
                  menuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
                }`}
              >
                <div className="min-w-[220px] rounded-2xl border border-white/80 bg-white/95 py-2 shadow-xl backdrop-blur-md dark:border-slate-600 dark:bg-slate-900/95">
                  <p className="border-b border-slate-100 px-4 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500 sm:hidden">
                    {displayLabel}
                  </p>
                  <NavLink
                    role="menuitem"
                    to="/calendar"
                    className={menuItemClass}
                    onClick={closeMenu}
                  >
                    <Calendar className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    {t('nav.calendar')}
                  </NavLink>
                  <NavLink
                    role="menuitem"
                    to="/settings"
                    className={menuItemClass}
                    onClick={closeMenu}
                  >
                    <Settings className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    {t('nav.settings')}
                  </NavLink>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-midnight transition hover:bg-slate-100/90 dark:text-slate-200 dark:hover:bg-slate-800/90"
                    onClick={handleSignOutClick}
                  >
                    <LogOut className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    {t('header.signOut')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('header.signOutTitle')}
        message={t('header.signOutMessage')}
        confirmLabel={t('header.signOutConfirm')}
        cancelLabel={t('header.signOutCancel')}
        onConfirm={handleConfirmSignOut}
      />
    </header>
  )
}
