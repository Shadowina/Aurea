import { useTranslation } from 'react-i18next'

export default function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  confirmBusy = false,
  onConfirm,
}) {
  const { t } = useTranslation();

  if (!open) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-peach/90 text-white hover:bg-peach'
      : 'bg-teal text-white hover:bg-teal/90';

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight/40 px-4 backdrop-blur-sm dark:bg-black/60"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="card w-full max-w-md border border-white/70 bg-white/95 p-6 shadow-xl dark:border-slate-600/80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-midnight dark:text-slate-100">
          {title}
        </h2>
        {message && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={confirmBusy}
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmBusy}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${confirmClasses}`}
          >
            {confirmBusy ? t('common.pleaseWait') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
